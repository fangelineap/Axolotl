"use server";

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getCaregiverVerificationStatus } from "./app/server-action/auth";

function getRoleRedirect(userRole: string): string {
  const roleRedirects: { [key: string]: string } = {
    Patient: "/patient",
    Nurse: "/caregiver",
    Midwife: "/caregiver",
    Admin: "/admin",
  };

  return roleRedirects[userRole] || "/";
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const guestPages = [
    "/auth/signin",
    "/auth/register",
    "/auth/resetpassword",
    "/auth/forgetpassword",
    "/",
    "/guest/about",
    "/guest/careers",
  ];

  if (guestPages.includes(pathname)) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    console.log(user);
  }

  /**
   * If the user is not authenticated, redirect to signin and clear auth cookies
   */
  if (!user) {
    // User is not authenticated, clear auth cookies and redirect to signin
    const response = NextResponse.redirect(
      new URL("/auth/signin", request.url),
    );

    // Clear Supabase auth cookies
    response.cookies.set("sb-access-token", "", { expires: new Date(0) });
    response.cookies.set("sb-refresh-token", "", { expires: new Date(0) });

    return response;
  }

  const userId = user?.id;

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (userData) {
    console.log(user);
    console.log(userData);
  }

  const userRole = userData.role;
  const roleRedirect = getRoleRedirect(userRole);

  // If the user is already on their role-specific page, allow access without redirection
  if (pathname.startsWith(roleRedirect)) {
    return NextResponse.next();
  }

  console.log({ userRole });

  // Handle patient, caregiver, and admin access
  if (pathname.startsWith("/patient")) {
    if (userRole === "Patient") {
      return NextResponse.next();
    } else {
      // Redirect to the correct role page
      return NextResponse.redirect(new URL(roleRedirect, request.url));
    }
  } else if (pathname.startsWith("/caregiver")) {
    if (userRole === "Nurse" || userRole === "Midwife") {
      const caregiverStatus = await getCaregiverVerificationStatus(userId!);

      const caregiverRedirects = {
        Verified: NextResponse.next(),
        Rejected: NextResponse.redirect(
          new URL(
            "/auth/register/createaccount/personalinformation/review?role=Caregiver",
            request.url,
          ),
        ),
        Unverified: NextResponse.redirect(
          new URL(
            "/auth/register/createaccount/personalinformation/review?role=Caregiver",
            request.url,
          ),
        ),
      };

      return (
        (caregiverStatus !== null && caregiverRedirects[caregiverStatus]) ||
        NextResponse.redirect(new URL("/", request.url))
      );
    } else {
      // Redirect to the correct role page
      return NextResponse.redirect(new URL(roleRedirect, request.url));
    }
  } else if (pathname.startsWith("/admin")) {
    if (userRole === "Admin") {
      return NextResponse.next();
    } else {
      // Redirect to the correct role page
      return NextResponse.redirect(new URL(roleRedirect, request.url));
    }
  }

  // Default role-based redirection
  return supabaseResponse;
}

export default async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.\\.(?:svg|png|jpg|jpeg|gif|webp)$).)",
  ],
};
