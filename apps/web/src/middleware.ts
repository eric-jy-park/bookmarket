import * as Sentry from '@sentry/nextjs';
import { NextResponse, type NextRequest } from 'next/server';
import { isAuthenticated, refreshNewAccessToken } from '~/app/_common/actions/auth.action';
import { unauthenticatedRoutes } from '~/path';

export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)'],
};

function isSubdomain(hostname: string, mainDomain: string) {
  if (!hostname.endsWith(mainDomain)) {
    return false;
  }

  const parts = hostname.split('.');
  const subdomain = parts[0];

  if (hostname === mainDomain) {
    return false;
  }

  return !['www', 'api'].includes(subdomain);
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const mainDomain = process.env.NEXT_PUBLIC_DOMAIN!;
  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams ? `?${searchParams}` : ''}`;

  console.log(`Processing request: ${hostname}${path}`);

  if (isSubdomain(hostname, mainDomain)) {
    const subdomain = hostname.split('.')[0];
    console.log(`Detected subdomain: ${subdomain}, rewriting to /s/${subdomain}${path}`);
    return NextResponse.rewrite(new URL(`/s/${subdomain}${path}`, request.url));
  }

  if (unauthenticatedRoutes.some(route => url.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const auth = await isAuthenticated();

  if (!auth) {
    try {
      const tokens = await refreshNewAccessToken();
      if (!tokens) return NextResponse.redirect(new URL('/login', request.url));
      return NextResponse.next();
    } catch (e) {
      Sentry.captureException(e);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
