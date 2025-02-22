import { NextResponse } from "next/server";
import urlMetadata from "url-metadata";
import puppeteer from "puppeteer";

const options = {
  requestHeaders: {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
    "Accept-Encoding": "gzip",
    "Accept-Language": "en-US,en;q=0.9,es;q=0.8",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
};

export async function POST(req: Request) {
  const { url }: { url: string } = await req.json();
  try {
    const response = await urlMetadata(url, options);
    const metadata = {
      title: response.title,
      description: response.description,
      faviconUrl: response.icon,
      url: response.url,
    };
    return NextResponse.json(metadata);
  } catch (error) {
    console.error("url-metadata failed, falling back to puppeteer", error);

    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setUserAgent(options.requestHeaders["User-Agent"]);
      await page.goto(url, { waitUntil: "networkidle2" });

      const metadata = await page.evaluate(() => {
        const metaTags = Array.from(document.getElementsByTagName("meta"));
        const metadata: Record<string, string> = {};
        metaTags.forEach((tag) => {
          if (tag.getAttribute("name")) {
            metadata[tag.getAttribute("name")!] = tag.getAttribute("content")!;
          } else if (tag.getAttribute("property")) {
            metadata[tag.getAttribute("property")!] =
              tag.getAttribute("content")!;
          }
        });

        const title = document.querySelector("title")?.innerText ?? "";
        const faviconUrl =
          document.querySelector("link[rel~='icon']")?.getAttribute("href") ??
          "";

        return {
          title,
          description: metadata.description ?? "",
          faviconUrl,
          url: window.location.href,
        };
      });

      await browser.close();
      return NextResponse.json(metadata);
    } catch (puppeteerError) {
      console.error("puppeteer failed", puppeteerError);
      return NextResponse.json(
        { error: "Failed to fetch metadata" },
        { status: 500 },
      );
    }
  }
}
