import * as Sentry from '@sentry/nextjs';
import { type NextRequest } from 'next/server';
import { isAuthenticated, refreshNewAccessToken } from '~/app/_common/actions/auth.action';
import { unauthenticatedRoutes } from '~/path';

export async function middleware(request: NextRequest) {
  const auth = await isAuthenticated();

  if (!auth && !unauthenticatedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    try {
      await refreshNewAccessToken();
      if (!(await isAuthenticated())) {
        return Response.redirect(new URL('/login', request.url));
      }
    } catch (e) {
      Sentry.captureException(e);
      return Response.redirect(new URL('/login', request.url));
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
