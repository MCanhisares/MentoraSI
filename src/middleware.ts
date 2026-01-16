import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "alumni_session";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME);

  // Protect alumni routes (except login)
  if (
    request.nextUrl.pathname.startsWith("/alumni/dashboard") ||
    request.nextUrl.pathname.startsWith("/alumni/availability")
  ) {
    if (!session?.value) {
      const url = request.nextUrl.clone();
      url.pathname = "/alumni/login";
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === "/alumni/login" && session?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/alumni/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/alumni/:path*"],
};
