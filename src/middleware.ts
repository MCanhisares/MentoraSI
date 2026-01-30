import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SESSION_COOKIE_NAME = "alumni_session";

export async function middleware(request: NextRequest) {
  // Check Supabase Auth
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getSession instead of getUser for middleware
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  // Check old cookie auth (during migration)
  const oldSession = request.cookies.get(SESSION_COOKIE_NAME);

  // User is authenticated if either auth method is valid
  const isAuthenticated = !!(user || oldSession?.value);

  // Protect alumni routes (except login)
  if (
    request.nextUrl.pathname.startsWith("/alumni/dashboard") ||
    request.nextUrl.pathname.startsWith("/alumni/availability") ||
    request.nextUrl.pathname.startsWith("/alumni/admin")
  ) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/alumni/login";
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from login page
  // TEMPORARILY DISABLED FOR DEBUGGING
  // if (request.nextUrl.pathname === "/alumni/login" && isAuthenticated) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/alumni/dashboard";
  //   return NextResponse.redirect(url);
  // }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/alumni/dashboard/:path*",
    "/alumni/availability/:path*",
    "/alumni/admin/:path*",
    "/alumni/login",
  ],
};
