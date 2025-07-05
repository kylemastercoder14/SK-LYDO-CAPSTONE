import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_CONFIG } from "@/lib/config";

// Define your public routes
const PUBLIC_ROUTES = ["/", "/sign-in", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthRoute = ["/sign-in", "/forgot-password"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Get session from API (Edge-compatible)
  const user = await getEdgeSession(request);
  type RoleKey = keyof typeof ROLE_CONFIG;

  // If user is logged in and trying to access auth page, redirect to dashboard
  if (user && isAuthRoute) {
    if (user.role && user.role in ROLE_CONFIG) {
      return NextResponse.redirect(
        new URL(ROLE_CONFIG[user.role as RoleKey].dashboard, request.url)
      );
    }
    // If role is not recognized, clear session and allow access to auth page
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.delete("auth-session");
    return response;
  }

  // Check if the route is public
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If no user session and trying to access protected route, redirect to sign-in
  if (!user) {
    const signInUrl = new URL("/sign-in", request.url);
    // Only set redirect if it's not already an auth route
    if (!isAuthRoute) {
      signInUrl.searchParams.set("redirect", pathname + search);
    }
    return NextResponse.redirect(signInUrl);
  }

  // Check if user has access to the requested path
  const hasAccess = pathname.startsWith(
    ROLE_CONFIG[user.role as RoleKey].prefix
  );

  // If user doesn't have access to this route
  if (!hasAccess) {
    // Redirect to their dashboard if they're logged in but trying to access wrong route
    if (user.role in ROLE_CONFIG) {
      return NextResponse.redirect(
        new URL(ROLE_CONFIG[user.role as RoleKey].dashboard, request.url)
      );
    }
    // If role is not recognized, clear session and redirect to sign-in
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.delete("auth-session");
    return response;
  }

  // If everything is fine, continue
  return NextResponse.next();
}

async function getEdgeSession(request: NextRequest) {
  const cookie = request.cookies.get("auth-session")?.value;
  if (!cookie) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`,
      {
        headers: {
          Cookie: `auth-session=${cookie}`,
        },
        // Important for Edge functions
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Edge session error:", error);
    return null;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|ttf|eot|otf)).*)",
  ],
};
