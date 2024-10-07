"use server";

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getCaregiverVerificationStatus } from "./app/server-action/auth";

/**
 * * Handling the page protection between roles
 * @param userRole
 * @returns
 */
function getRoleRedirect(userRole: string): string {
  const roleRedirects: { [key: string]: string } = {
    Patient: "/patient",
    Nurse: "/caregiver",
    Midwife: "/caregiver",
    Admin: "/admin"
  };

  return roleRedirects[userRole] || "/";
}

/**
 * * Validate the current session with the last session stored in the browser
 * @param supabase
 * @param request
 * @returns
 */
async function validateSession(
  supabase: ReturnType<typeof createServerClient>,
  request: NextRequest
) {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  // If error exists, session might be invalid or expired
  if (error || !user) {
    const response = NextResponse.redirect(
      new URL("/auth/signin", request.url)
    );

    // Clear session cookies
    response.cookies.set("sb-access-token", "", { expires: new Date(0) });
    response.cookies.set("sb-refresh-token", "", { expires: new Date(0) });

    return { isValid: false, response };
  }

  return { isValid: true, user };
}

/**
 * * Update the session based on the user's role
 * @param request
 * @returns
 */
async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const guestPages = [
    "/auth/signin",
    "/auth/register",
    "/auth/resetpassword",
    "/auth/forgetpassword",
    "/",
    "/guest/about",
    "/guest/careers"
  ];

  if (guestPages.includes(pathname)) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request: { headers: request.headers }
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
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  /**
   * ! Validate the user's session
   */
  const { isValid, user, response } = await validateSession(supabase, request);

  if (!isValid) {
    return response;
  }

  if (user) {
    console.log(user);
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
      const caregiverStatus = (await getCaregiverVerificationStatus(
        userId!
      )) as "Verified" | "Rejected" | "Unverified";

      const caregiverRedirects: {
        [key in "Verified" | "Rejected" | "Unverified"]: NextResponse;
      } = {
        Verified: NextResponse.next(),
        Rejected: NextResponse.redirect(
          new URL(
            "/auth/register/createaccount/personalinformation/review?role=Caregiver",
            request.url
          )
        ),
        Unverified: NextResponse.redirect(
          new URL(
            "/auth/register/createaccount/personalinformation/review?role=Caregiver",
            request.url
          )
        )
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

/**
 * * Middleware
 * @param request
 * @returns
 */
export default async function middleware(request: NextRequest) {
  return await updateSession(request);
}

/**
 * * Middleware Config
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
