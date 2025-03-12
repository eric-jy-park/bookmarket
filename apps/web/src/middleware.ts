import { NextRequest } from "next/server";
import { getMe, refreshNewAccessToken } from "~/app/_common/actions/auth.action";
import { unauthenticatedRoutes } from "~/path";
import * as Sentry from "@sentry/nextjs";

export async function middleware(request: NextRequest) {
  const auth = await getMe();

  if (
    !auth &&
    !unauthenticatedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    )
  ) {
    try{
      refreshNewAccessToken();
      return Response.redirect(new URL("/login", request.url));
    } catch(e){
      Sentry.captureException(e);
    }

  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
