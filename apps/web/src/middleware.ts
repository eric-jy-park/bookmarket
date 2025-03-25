import * as Sentry from '@sentry/nextjs';
import { NextResponse, type NextRequest } from 'next/server';
import { isAuthenticated, refreshNewAccessToken } from '~/app/_common/actions/auth.action';
import { unauthenticatedRoutes } from '~/path';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host');
  const mainDomain = process.env.NEXT_PUBLIC_DOMAIN!;
  const pathname = request.nextUrl.pathname;

  // Log for debugging in production
  console.log(`Middleware processing: Host=${host}, MainDomain=${mainDomain}, Path=${pathname}`);

  // Skip subdomain rewriting for static assets and images
  const isStaticAsset =
    pathname.match(/\.(jpe?g|png|gif|svg|webp|avif|ico|bmp|css|js)$/i) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/_vercel/');

  // Static assets should always be accessible
  if (isStaticAsset) {
    return NextResponse.next();
  }

  if (
    host &&
    host.includes('.') &&
    host.endsWith(mainDomain) &&
    !host.startsWith('www.') &&
    !host.startsWith('api.') &&
    !host.startsWith('bmkt.')
  ) {
    // Logic for handling subdomains
    const subdomain = host.split('.')[0];
    console.log(`Detected subdomain: ${subdomain}`);

    const protocol = request.nextUrl.protocol;
    const newUrl = new URL(`/s/${subdomain}`, `${protocol}//${mainDomain}`);

    newUrl.search = request.nextUrl.search;
    if (request.nextUrl.pathname !== '/') {
      newUrl.pathname = `${newUrl.pathname}${request.nextUrl.pathname}`;
    }

    console.log(`Rewriting to: ${newUrl.toString()}`);
    return NextResponse.rewrite(newUrl);
  }

  if (unauthenticatedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) return NextResponse.next();

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
}

export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)'],
};
