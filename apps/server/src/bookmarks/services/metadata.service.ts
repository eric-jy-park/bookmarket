import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as http from 'http';
import { IncomingMessage } from 'http';
import * as https from 'https';
import { Readable } from 'stream';
import { URL } from 'url';
import * as zlib from 'zlib';

export interface UrlMetadata {
  title: string;
  description: string;
  logo?: string;
  url: string;
}

@Injectable()
export class MetadataService {
  async fetchMetadata(url: string): Promise<UrlMetadata> {
    const normalizedUrl = this.normalizeUrl(url);
    console.log(`\n=== MetadataService: Fetching ${normalizedUrl} ===`);

    // Try multiple strategies for difficult sites
    const strategies = [
      () => this.fetchHtmlWithRedirects(normalizedUrl),
      () => this.fetchWithDifferentUA(normalizedUrl),
      () => this.fetchWithGoogleReferer(normalizedUrl),
    ];

    for (let i = 0; i < strategies.length; i++) {
      try {
        console.log(`Trying strategy ${i + 1}/${strategies.length}...`);
        const { html, finalUrl } = await strategies[i]();
        console.log(`Got HTML response: ${html.length} characters, final URL: ${finalUrl}`);

        if (html.length < 100) {
          console.log(`Warning: Very short HTML response: "${html}"`);
          if (i < strategies.length - 1) continue; // Try next strategy
        }

        const metadata = this.parseMetadataWithCheerio(html, finalUrl);

        return {
          title: metadata.title || this.extractTitleFromUrl(finalUrl),
          description: metadata.description || '',
          logo: metadata.logo,
          url: finalUrl,
        };
      } catch (error) {
        console.log(`Strategy ${i + 1} failed:`, error instanceof Error ? error.message : String(error));
        if (i < strategies.length - 1) {
          await this.randomDelay(); // Wait before trying next strategy
        }
      }
    }

    // All strategies failed
    console.log(`All strategies failed for ${normalizedUrl}`);
    return {
      title: this.extractTitleFromUrl(normalizedUrl),
      description: '',
      url: normalizedUrl,
    };
  }

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }

  private async fetchHtmlWithRedirects(
    url: string,
    customHeaders?: Record<string, string>,
    maxRedirects = 5,
  ): Promise<{ html: string; finalUrl: string }> {
    let currentUrl = url;
    let redirectCount = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await this.fetchHtml(currentUrl, customHeaders);

        if (result.statusCode >= 300 && result.statusCode < 400 && result.location) {
          // Handle redirect
          if (redirectCount >= maxRedirects) {
            throw new Error('Too many redirects');
          }
          currentUrl = this.resolveUrl(currentUrl, result.location);
          redirectCount += 1;
          // eslint-disable-next-line no-continue
          continue;
        }

        if (result.statusCode >= 200 && result.statusCode < 300) {
          return { html: result.html, finalUrl: currentUrl };
        }

        console.log(`HTTP error ${result.statusCode} for ${currentUrl}`);
        throw new Error(`HTTP ${result.statusCode}`);
      } catch (error) {
        if (redirectCount === 0) {
          throw error;
        }
        break;
      }
    }

    throw new Error('Too many redirects');
  }

  private async fetchHtml(
    url: string,
    customHeaders?: Record<string, string>,
  ): Promise<{ html: string; statusCode: number; location?: string }> {
    // Add random delay to avoid looking like a bot
    await this.randomDelay();

    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      // Use custom headers if provided, otherwise generate realistic headers
      const headers = customHeaders || this.generateRealisticHeaders(url);

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers,
        timeout: 20000, // Increase timeout
      };

      const req = protocol.request(options, (res: IncomingMessage) => {
        let stream: Readable = res;
        const encoding = res.headers['content-encoding'];

        // Handle compressed responses
        if (encoding === 'gzip') {
          stream = res.pipe(zlib.createGunzip());
        } else if (encoding === 'deflate') {
          stream = res.pipe(zlib.createInflate());
        } else if (encoding === 'br') {
          stream = res.pipe(zlib.createBrotliDecompress());
        }

        let data = '';

        // Handle different encodings
        stream.setEncoding('utf8');

        stream.on('data', chunk => {
          data += chunk;
          // Limit response size to prevent memory issues
          if (data.length > 2 * 1024 * 1024) {
            // 2MB limit
            req.destroy();
            reject(new Error('Response too large'));
          }
        });

        stream.on('end', () => {
          resolve({
            html: data,
            statusCode: res.statusCode || 0,
            location: res.headers.location as string,
          });
        });

        stream.on('error', error => {
          reject(error);
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  private parseMetadataWithCheerio(html: string, url: string): Partial<UrlMetadata> {
    const $ = cheerio.load(html);
    const metadata: Partial<UrlMetadata> = {};

    // Extract title with priority: og:title > twitter:title > title tag
    metadata.title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      '';

    // Clean up title
    if (metadata.title) {
      metadata.title = this.cleanText(metadata.title);
    }

    // Extract description with priority: og:description > twitter:description > meta description
    metadata.description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    // Clean up description
    if (metadata.description) {
      metadata.description = this.cleanText(metadata.description);
    }

    // Extract favicon/logo
    metadata.logo = this.extractFaviconWithCheerio($, url);

    return metadata;
  }

  private extractFaviconWithCheerio($: cheerio.CheerioAPI, url: string): string | undefined {
    const parsedUrl = new URL(url);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.port ? `:${parsedUrl.port}` : ''}`;

    // Debug: Check if we can find the head and any link tags
    const hasHead = $('head').length > 0;
    const allLinkCount = $('link').length;
    console.log(`HTML parsing: Found head=${hasHead}, total links=${allLinkCount}`);

    // Collect all favicon candidates
    const candidates: string[] = [];

    // Try favicon links first (most reliable)
    $('link[rel="icon"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        console.log(`Found icon link: ${href}`);
        candidates.push(href);
      }
    });

    $('link[rel="shortcut icon"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        console.log(`Found shortcut icon link: ${href}`);
        candidates.push(href);
      }
    });

    // Try apple touch icons (good fallback for mobile)
    $('link[rel="apple-touch-icon"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        console.log(`Found apple touch icon: ${href}`);
        candidates.push(href);
      }
    });

    $('link[rel="apple-touch-icon-precomposed"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        console.log(`Found apple touch icon precomposed: ${href}`);
        candidates.push(href);
      }
    });

    console.log(`Found ${candidates.length} favicon candidates for ${url}:`, candidates);

    // Since these candidates come from <link rel="icon"> tags, they're already high quality
    // Just need to avoid obviously bad ones and prefer good ones

    // First pass: look for candidates with "favicon" in the name
    for (const candidate of candidates) {
      const resolvedUrl = this.resolveUrl(url, candidate);
      if (resolvedUrl.toLowerCase().includes('favicon')) {
        console.log(`✅ Selected favicon by name: ${resolvedUrl}`);
        return resolvedUrl;
      }
    }

    // Second pass: look for any valid image that's not obviously wrong
    for (const candidate of candidates) {
      const resolvedUrl = this.resolveUrl(url, candidate);

      // Only exclude obvious social media images
      if (this.isNotSocialMediaImage(resolvedUrl)) {
        console.log(`✅ Selected favicon: ${resolvedUrl}`);
        return resolvedUrl;
      }
    }

    // If we found any candidate, use the first one (they came from favicon link tags)
    if (candidates.length > 0) {
      const firstCandidate = this.resolveUrl(url, candidates[0]);
      console.log(`✅ Using first candidate as fallback: ${firstCandidate}`);
      return firstCandidate;
    }

    // No favicon found - return undefined so client can use fallback
    console.log(`No valid favicon found for ${url}, returning undefined`);
    return undefined;
  }

  private isNotSocialMediaImage(url: string): boolean {
    const lowerUrl = url.toLowerCase();

    // Exclude large images and social media images
    return !(
      lowerUrl.includes('1200x') ||
      lowerUrl.includes('800x') ||
      lowerUrl.includes('600x') ||
      lowerUrl.includes('social') ||
      lowerUrl.includes('og-image') ||
      lowerUrl.includes('og_image') ||
      lowerUrl.includes('twitter-image') ||
      lowerUrl.includes('linkedin') ||
      lowerUrl.includes('facebook') ||
      lowerUrl.includes('share-image') ||
      lowerUrl.includes('preview-image')
    );
  }

  private isLikelyFaviconUrl(url: string): boolean {
    const lowerUrl = url.toLowerCase();

    // Exclude large images and social media images first
    if (!this.isNotSocialMediaImage(url)) {
      return false;
    }

    // Check if it's likely a favicon
    return (
      lowerUrl.includes('favicon') ||
      (lowerUrl.includes('icon') && !lowerUrl.includes('social')) ||
      (lowerUrl.includes('logo') &&
        (lowerUrl.includes('16x') || lowerUrl.includes('32x') || lowerUrl.includes('64x'))) ||
      // Size indicators that suggest it's an icon
      lowerUrl.includes('16x16') ||
      lowerUrl.includes('32x32') ||
      lowerUrl.includes('64x64') ||
      lowerUrl.includes('128x128') ||
      lowerUrl.includes('180x180') ||
      lowerUrl.includes('152x152') ||
      lowerUrl.includes('192x192') ||
      // Common favicon file extensions
      lowerUrl.endsWith('.ico') ||
      lowerUrl.endsWith('.png') ||
      lowerUrl.endsWith('.jpg') ||
      lowerUrl.endsWith('.jpeg') ||
      lowerUrl.endsWith('.gif') ||
      lowerUrl.endsWith('.svg')
    );
  }

  private resolveUrl(baseUrl: string, relativeUrl: string): string {
    try {
      if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
        return relativeUrl;
      }

      if (relativeUrl.startsWith('//')) {
        const base = new URL(baseUrl);
        return `${base.protocol}${relativeUrl}`;
      }

      return new URL(relativeUrl, baseUrl).toString();
    } catch {
      return relativeUrl;
    }
  }

  private isLikelyImageUrl(url: string): boolean {
    const imageExtensions = ['.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    const lowerUrl = url.toLowerCase();

    return (
      imageExtensions.some(ext => lowerUrl.includes(ext)) ||
      lowerUrl.includes('favicon') ||
      lowerUrl.includes('icon') ||
      lowerUrl.includes('logo')
    );
  }

  private cleanText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/[\r\n\t]/g, ' ') // Replace newlines and tabs with space
      .substring(0, 500); // Limit length
  }

  private extractTitleFromUrl(url: string): string {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.replace('www.', '');

      // Capitalize first letter of each word
      const [domainName] = hostname.split('.');
      return domainName.charAt(0).toUpperCase() + domainName.slice(1);
    } catch {
      return url;
    }
  }

  private async fetchWithDifferentUA(url: string): Promise<{ html: string; finalUrl: string }> {
    console.log(`Trying with different User-Agent...`);
    // Use a mobile user agent to bypass some blocks
    const mobileUA =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1';

    const customHeaders = {
      'User-Agent': mobileUA,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    return this.fetchHtmlWithRedirects(url, customHeaders);
  }

  private async fetchWithGoogleReferer(url: string): Promise<{ html: string; finalUrl: string }> {
    console.log(`Trying with Google referer...`);
    // Pretend we're coming from Google search
    const baseHeaders = this.generateRealisticHeaders(url);
    const customHeaders = {
      ...baseHeaders,
      Referer: `https://www.google.com/search?q=${encodeURIComponent(new URL(url).hostname)}`,
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Dest': 'document',
    };

    return this.fetchHtmlWithRedirects(url, customHeaders);
  }

  private async randomDelay(): Promise<void> {
    // Random delay between 500ms and 2000ms to avoid looking like a bot
    const delay = Math.floor(Math.random() * 1500) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private generateRealisticHeaders(url: string): Record<string, string> {
    const parsedUrl = new URL(url);
    const isHTTPS = parsedUrl.protocol === 'https:';

    // Vary user agents to look more realistic
    const userAgents = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
    ];

    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

    const baseHeaders: Record<string, string> = {
      'User-Agent': randomUA,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': `gzip, deflate${isHTTPS ? ', br' : ''}`,
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0',
      DNT: '1',
    };

    // Add realistic referer for some sites
    if (Math.random() > 0.5) {
      baseHeaders.Referer = 'https://www.google.com/';
    }

    // Add sec-fetch headers for HTTPS
    if (isHTTPS) {
      baseHeaders['Sec-Fetch-Dest'] = 'document';
      baseHeaders['Sec-Fetch-Mode'] = 'navigate';
      baseHeaders['Sec-Fetch-Site'] = Math.random() > 0.5 ? 'cross-site' : 'none';
      baseHeaders['Sec-Fetch-User'] = '?1';

      // Add Chrome-specific headers
      if (randomUA.includes('Chrome')) {
        baseHeaders['Sec-CH-UA'] = '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"';
        baseHeaders['Sec-CH-UA-Mobile'] = '?0';
        baseHeaders['Sec-CH-UA-Platform'] = randomUA.includes('Windows') ? '"Windows"' : '"macOS"';
      }
    }

    return baseHeaders;
  }
}
