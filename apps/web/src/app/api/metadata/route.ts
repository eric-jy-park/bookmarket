import ky from "ky";
import { NextResponse } from "next/server";
import urlMetadata from "url-metadata";
import * as Sentry from "@sentry/nextjs";
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

interface MetadataResponse {
  data: {
    title: string;
    description: string;
    logo: string;
    url: string;
  };
}

export async function POST(req: Request) {
  const { url }: { url: string } = await req.json();
  try {
    const response = await urlMetadata(url, options);
    const metadata = {
      title: response.title,
      description: response.description,
      logo: response.icon,
      url: response.url,
    };
    return NextResponse.json(metadata);
  } catch (error) {
    Sentry.captureException(
      "url-metadata failed, falling back to metadata-vision",
      {
        extra: {
          url,
          error,
        },
      },
    );

    const response = await ky
      .get<MetadataResponse>(`https://og.metadata.vision/${url}`, {
        timeout: 30000,
        retry: 2,
        hooks: {
          beforeRetry: [
            async ({ error }) => {
              console.log(`Retrying metadata fetch due to: ${error?.message}`);
            },
          ],
        },
      })
      .json();

    const metadata = {
      title: response.data.title,
      description: response.data.description,
      logo: response.data.logo,
      url: response.data.url,
    };

    return NextResponse.json(metadata);
  }
}
