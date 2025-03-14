'use server';

import urlMetadata from 'url-metadata';
import * as Sentry from '@sentry/nextjs';
import { type UrlMetadata } from '~/app/_common/interfaces/metadata.interface';
import ky from 'ky';

interface MetadataResponse {
  data: UrlMetadata;
}

const options = {
  requestHeaders: {
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'Accept-Encoding': 'gzip',
    'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  },
};

export async function getMetadata(url: string, isFallback = false) {
  let metadata: UrlMetadata;

  if (isFallback) {
    const response = await getMetadataFallback(url);
    return response.data;
  }

  try {
    const response = await urlMetadata(url, options);
    metadata = {
      title: response.title,
      description: response.description,
      url: response.url,
    };
  } catch (error) {
    Sentry.captureException('url-metadata failed, falling back to metadata vision', {
      extra: {
        url,
        error,
      },
    });

    const response = await getMetadataFallback(url);

    metadata = {
      title: response.data.title,
      description: response.data.description,
      url: response.data.url,
    };
  }

  return metadata;
}

export async function getMetadataFallback(url: string) {
  const response = await ky
    .get<MetadataResponse>(`https://og.metadata.vision/${url}`, {
      timeout: 30000,
      retry: 2,
    })
    .json();

  return response;
}
