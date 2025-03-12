import { NextRequest } from "next/server";
import { getMe } from "~/app/_common/actions/auth.action";
import { unauthenticatedRoutes } from "~/path";

export async function middleware(request: NextRequest) {
  const auth = await getMe();

  if (
    !auth &&
    !unauthenticatedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    )
  ) {
    return Response.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
