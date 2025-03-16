import * as Sentry from '@sentry/nextjs';
import { NextResponse, type NextRequest } from 'next/server';
import { isAuthenticated, refreshNewAccessToken } from '~/app/_common/actions/auth.action';
import { unauthenticatedRoutes } from '~/path';

export async function middleware(request: NextRequest) {
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
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
