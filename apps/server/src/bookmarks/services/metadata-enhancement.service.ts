import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Sentry from '@sentry/nestjs';
import { Repository } from 'typeorm';
import urlMetadata from 'url-metadata';
import { Bookmark } from '../entities/bookmark.entity';
import { MetadataService } from './metadata.service';

export interface EnhancedMetadata {
  title?: string;
  description?: string;
  faviconUrl?: string;
}

@Injectable()
export class MetadataEnhancementService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    private readonly metadataService: MetadataService,
  ) {}

  async enhanceBookmarkMetadata(bookmarkId: string): Promise<void> {
    try {
      const bookmark = await this.bookmarkRepository.findOne({
        where: { id: bookmarkId },
      });

      if (!bookmark) {
        console.log(`Bookmark ${bookmarkId} not found for enhancement`);
        return;
      }

      console.log(`Enhancing metadata for: ${bookmark.url}`);

      const enhancedMetadata = await this.fetchEnhancedMetadata(bookmark.url);

      if (enhancedMetadata) {
        await this.updateBookmarkWithEnhancedMetadata(bookmarkId, enhancedMetadata);
        console.log(`Successfully enhanced metadata for bookmark ${bookmarkId}`);
      }
    } catch (error) {
      console.error(`Failed to enhance metadata for bookmark ${bookmarkId}:`, error);
      Sentry.captureException(error, {
        tags: { service: 'metadata-enhancement' },
        extra: { bookmarkId },
      });
    }
  }

  private async fetchEnhancedMetadata(url: string): Promise<EnhancedMetadata | null> {
    try {
      const options = {
        requestHeaders: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Encoding': 'gzip',
          'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
          'Upgrade-Insecure-Requests': '1',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 15000,
      };

      const response = await urlMetadata(url, options);

      // Debug: Log relevant properties
      console.log(`\n=== url-metadata response for ${url} ===`);
      console.log('Title:', response.title);
      console.log('Description:', response.description);
      console.log('Icon:', response.icon);
      console.log('Favicon:', response.favicon);
      console.log('og:image:', response['og:image']);
      console.log('Source:', response.source);

      // Get favicon with better logic
      let faviconUrl = this.extractBestFavicon(response, url);

      console.log(`Extracted favicon: ${faviconUrl}`);

      // If url-metadata didn't find a favicon or fell back to default, use our fallback service
      if (!faviconUrl) {
        console.log(`url-metadata failed to find favicon, using fallback service`);
        const fallbackMetadata = await this.fetchMetadataFallback(url);
        if (fallbackMetadata && fallbackMetadata.faviconUrl) {
          faviconUrl = fallbackMetadata.faviconUrl;
          console.log(`Fallback service found favicon: ${faviconUrl}`);
        } else {
          console.log(`Fallback service also found no favicon - will save undefined`);
        }
      }

      return {
        title: response.title,
        description: response.description,
        faviconUrl: faviconUrl || undefined,
      };
    } catch (error) {
      console.error(`url-metadata failed for ${url}:`, error);

      // Fallback to custom metadata service for 403 errors
      if (error instanceof Error && error.message.includes('403')) {
        console.log(`Attempting fallback metadata fetch for ${url}`);
        return this.fetchMetadataFallback(url);
      }

      return null;
    }
  }

  private async fetchMetadataFallback(url: string): Promise<EnhancedMetadata | null> {
    try {
      console.log(`Using fallback metadata service for ${url}`);
      const metadata = await this.metadataService.fetchMetadata(url);

      return {
        title: metadata.title,
        description: metadata.description,
        faviconUrl: metadata.logo,
      };
    } catch (error) {
      console.error(`Fallback metadata fetch failed for ${url}:`, error);
      return null;
    }
  }

  private async updateBookmarkWithEnhancedMetadata(bookmarkId: string, metadata: EnhancedMetadata): Promise<void> {
    const updateData: Partial<Bookmark> = {};

    // Only update fields that have meaningful values
    if (metadata.title && metadata.title.trim()) {
      updateData.title = metadata.title.trim();
    }

    if (metadata.description && metadata.description.trim()) {
      updateData.description = metadata.description.trim();
    }

    if (metadata.faviconUrl !== undefined) {
      if (metadata.faviconUrl && metadata.faviconUrl.trim()) {
        updateData.faviconUrl = metadata.faviconUrl.trim();
      } else {
        // Explicitly set to undefined when no favicon is found
        updateData.faviconUrl = undefined;
      }
    }

    // Only update if we have something to update
    if (Object.keys(updateData).length > 0) {
      await this.bookmarkRepository.update(bookmarkId, updateData);
      console.log(`Updated bookmark ${bookmarkId} with:`, updateData);
    }
  }

  private extractBestFavicon(response: any, baseUrl: string): string | null {
    // Try favicon sources only, excluding og:image which is often large social media images
    const candidates = [response.favicon, response.icon].filter(Boolean);

    console.log(`url-metadata candidates:`, candidates);

    if (candidates.length === 0) {
      console.log(`No favicon candidates from url-metadata, will use fallback service`);
      // Return null so the fallback service is used
      return null;
    }

    // Find the best favicon candidate
    for (const candidate of candidates) {
      if (typeof candidate === 'string') {
        // Skip user avatars and large social media images
        if (
          candidate.includes('avatars.githubusercontent.com') ||
          candidate.includes('avatar') ||
          candidate.includes('profile') ||
          candidate.includes('og:image') ||
          candidate.includes('1200x') ||
          candidate.includes('800x') ||
          candidate.includes('social')
        ) {
          continue;
        }

        // Prefer actual favicon-named files
        if (candidate.toLowerCase().includes('favicon')) {
          return this.resolveAndCleanUrl(candidate, baseUrl);
        }

        // Check if it looks like a favicon by size or path
        if (this.isLikelyFavicon(candidate)) {
          return this.resolveAndCleanUrl(candidate, baseUrl);
        }
      }
    }

    // If no good favicon found, return the first candidate if it exists
    const firstCandidate = candidates[0];
    if (typeof firstCandidate === 'string') {
      return this.resolveAndCleanUrl(firstCandidate, baseUrl);
    }

    // No favicon found - return null so client can use fallback
    console.log(`No favicon found for ${baseUrl}, returning null`);
    return null;
  }

  private isLikelyFavicon(url: string): boolean {
    const lowerUrl = url.toLowerCase();

    // Exclude large images and social media images first
    if (
      lowerUrl.includes('1200x') ||
      lowerUrl.includes('800x') ||
      lowerUrl.includes('600x') ||
      lowerUrl.includes('social') ||
      lowerUrl.includes('og-image') ||
      lowerUrl.includes('og_image') ||
      lowerUrl.includes('twitter-image') ||
      lowerUrl.includes('share-image') ||
      lowerUrl.includes('preview-image')
    ) {
      return false;
    }

    // Check for favicon indicators
    return (
      lowerUrl.includes('favicon') ||
      (lowerUrl.includes('icon') && !lowerUrl.includes('social')) ||
      // Size indicators that suggest it's an icon (not large images)
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

  private resolveAndCleanUrl(url: string, baseUrl: string): string {
    // Clean up malformed URLs (fix double query parameters)
    let cleanUrl = url.replace(/\?v=\d+\?/g, '?');

    // Make relative URLs absolute
    if (cleanUrl.startsWith('/')) {
      try {
        const base = new URL(baseUrl);
        cleanUrl = `${base.protocol}//${base.host}${cleanUrl}`;
      } catch {
        return url;
      }
    }

    return cleanUrl;
  }

  // Queue enhancement for background processing
  async queueEnhancement(bookmarkId: string): Promise<void> {
    // For now, we'll process immediately
    // In production, you might want to use a proper queue like Bull or similar
    setImmediate(() => {
      this.enhanceBookmarkMetadata(bookmarkId);
    });
  }
}
