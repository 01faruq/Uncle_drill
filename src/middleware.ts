/**
 * @purpose Next.js Edge Middleware for Supabase Auth Session Refresh, Onboarding Gate, and RBAC Guard.
 * @security Always calls supabase.auth.getUser() on the server to validate JWT freshness and refresh cookies securely.
 * @reference docs/04_SYSTEM_ARCHITECTURE.md (Architecture & URL Routing Laws),
 *            docs/08_USER_JOURNEY_AND_DRILL_EXPERIENCE.md
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/env";
import type { Database } from "@/types/database.types";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Critical Security: Always use getUser() on server to guarantee authentic non-spoofed session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const isOnboardingRoute = pathname === "/onboarding";
  const isProtectedWorkspaceRoute =
    pathname.startsWith("/roadmap") ||
    pathname.startsWith("/study") ||
    pathname.startsWith("/drill");
  const isCommandRoute = pathname.startsWith("/command");

  const udOnboardedCookie = request.cookies.get("ud_onboarded")?.value === "true";

  // 1. Unauthenticated users trying to access protected workspace or command room
  if (!user && (isProtectedWorkspaceRoute || isCommandRoute || isOnboardingRoute)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If authenticated, check onboarding and role status
  if (user) {
    const founderEmail =
      (typeof process !== "undefined" && process.env?.FOUNDER_ADMIN_EMAIL) ||
      "4sulymanumar@gmail.com";
    const isFounder =
      user.email?.toLowerCase() === "4sulymanumar@gmail.com" ||
      user.email?.toLowerCase() === founderEmail.toLowerCase();

    // The Founder is unconditionally granted Super Admin and bypasses onboarding locks
    if (isFounder) {
      if (!udOnboardedCookie) {
        response.cookies.set("ud_onboarded", "true", { path: "/" });
      }

      if (isAuthRoute || isOnboardingRoute) {
        return NextResponse.redirect(new URL("/command", request.url));
      }

      return response;
    }

    let onboardingCompleted = udOnboardedCookie;
    let role: string = "STUDENT";

    // If cookie not present or if checking command route, query profile
    if (!onboardingCompleted || isCommandRoute) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, onboarding_completed")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.onboarding_completed) {
        onboardingCompleted = true;
      }
      if (profile?.role) {
        role = profile.role;
      }
    }

    // If onboarding not completed, force user to /onboarding unless they are already there
    if (!onboardingCompleted) {
      if (!isOnboardingRoute) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
      return response;
    }

    // If onboarding is already completed and user visits /onboarding or auth routes, redirect to /roadmap
    if (isOnboardingRoute || isAuthRoute) {
      return NextResponse.redirect(new URL("/roadmap", request.url));
    }

    // Super Admin Command Room guard: Only users with role === 'SUPER_ADMIN' may enter
    if (isCommandRoute && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/roadmap?error=UNAUTHORIZED_COMMAND", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (/brand/, images, SVG)
     * - api routes (unless specified)
     */
    "/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|map|woff|woff2|ttf|eot)$).*)",
  ],
};
