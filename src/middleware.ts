"use server";

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import {
  getCaregiverScheduleStatus,
  getCaregiverVerificationStatus,
  getIncompleteUserPersonalInformation
} from "./app/_server-action/auth";
import { validateSession } from "./utils/Validation/auth/ValidateSession";

/**
 * * Check if the pathname matches any guest page pattern
 * @param pathname
 * @returns
 */
function isGuestPage(pathname: string): boolean {
  const guestPages = ["/", "/guest/about", "/guest/careers"];
  const authPaths = [
    "/auth/register",
    "/auth/forgetpassword",
    "/auth/resetpassword"
  ];

  if (
    guestPages.includes(pathname) ||
    authPaths.some((authPath) => pathname.includes(authPath))
  ) {
    return true;
  }

  return false;
}

/**
 * * Handling the page protection between roles
 * @param userRole
 * @returns
 */
function getRoleRedirect(userRole: string): string {
  const roleRedirects: { [key: string]: string } = {
    Patient: "/patient",
    Caregiver: "/caregiver",
    Nurse: "/caregiver",
    Midwife: "/caregiver",
    Admin: "/admin"
  };

  return roleRedirects[userRole] || "/";
}

/**
 * * Update the session based on the user's role
 * @param request
 * @returns
 */
async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isGuestPage(pathname)) {
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

  // User Session Validation with Cookie
  const { isValid, user, response } = await validateSession(supabase, request);

  if (!isValid || !user) {
    console.error("Session is invalid:", { isValid, user, response });

    if (pathname.startsWith("/auth/signin")) return NextResponse.next();

    return response;
  }

  const userId = user.id;

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!userData) {
    console.error("Error fetching user data:", { user });

    return response;
  }

  const userRole = userData.role;
  const roleRedirect = getRoleRedirect(userRole);

  const userPersonalData = await getIncompleteUserPersonalInformation(
    userData.id,
    userRole
  );

  const userValidity = {
    Middleware: {
      User: {
        user_id: userId,
        user_name: userData.first_name + " " + userData.last_name,
        email: user.email,
        userRole
      },
      Validity: {
        Session: isValid,
        isPersonalDataFetched: userPersonalData.success,
        isPersonalDataCompleted: userPersonalData.is_complete,
        PersonalDataMessage: userPersonalData.message
      }
    }
  };

  console.log(userValidity);

  // If there is a invalid role query parameter with the current user role
  const urlRole = new URL(request.url).searchParams.get("role");
  const urlUser = new URL(request.url).searchParams.get("user");

  // ! INCOMPLETE USER DATA
  if (userPersonalData.success && !userPersonalData.is_complete) {
    if (pathname !== "/registration/personal-information") {
      return NextResponse.redirect(
        new URL(
          `/registration/personal-information?role=${userRole}&user=${userId}&signed-in=${userPersonalData.success}&personal-information=${userPersonalData.is_complete}`,
          request.url
        )
      );
    }

    if ((urlRole && urlRole !== userRole) || (urlUser && urlUser !== userId)) {
      return NextResponse.redirect(
        new URL(
          `/registration/personal-information?role=${userRole}&user=${userId}&signed-in=${userPersonalData.success}&personal-information=${userPersonalData.is_complete}`,
          request.url
        )
      );
    }

    return NextResponse.next();
  }

  if (userPersonalData.success && userPersonalData.is_complete) {
    if (pathname.startsWith("/registration/personal-information")) {
      return NextResponse.redirect(new URL(roleRedirect, request.url));
    }
  }

  if (pathname.startsWith("/profile") || pathname.startsWith("/profile/edit")) {
    if (!urlRole || !urlUser)
      return NextResponse.redirect(new URL(roleRedirect, request.url));

    if (urlRole && urlRole !== userRole) {
      const redirectPath = pathname.startsWith("/profile/edit")
        ? `/profile/edit?user=${userId}&role=${userRole}`
        : `/profile?user=${userId}&role=${userRole}`;

      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    if (urlUser && urlUser !== userId) {
      const redirectPath = pathname.startsWith("/profile/edit")
        ? `/profile/edit?user=${userId}&role=${userRole}`
        : `/profile?user=${userId}&role=${userRole}`;

      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
  }

  // ! ADMIN
  if (pathname.startsWith("/admin")) {
    if (userRole !== "Admin") {
      return NextResponse.redirect(new URL(roleRedirect, request.url));
    }

    return NextResponse.next();
  }

  // ! PATIENT
  if (pathname.startsWith("/patient")) {
    if (userRole !== "Patient") {
      return NextResponse.redirect(new URL(roleRedirect, request.url));
    }

    return NextResponse.next();
  }

  // ! CAREGIVER
  if (pathname.startsWith("/caregiver")) {
    if (!["Nurse", "Midwife", "Caregiver"].includes(userRole)) {
      return NextResponse.redirect(new URL(roleRedirect, request.url));
    }

    const caregiverStatus = await getCaregiverVerificationStatus(userData.id);

    if (!caregiverStatus)
      return NextResponse.redirect(new URL("/", request.url));

    console.log({ caregiverStatus });

    if (isValid && ["Rejected", "Unverified"].includes(caregiverStatus)) {
      if (pathname !== "/caregiver/review") {
        return NextResponse.redirect(new URL("/caregiver/review", request.url));
      }

      return NextResponse.next();
    }

    const caregiverScheduleStatus = await getCaregiverScheduleStatus(
      userData.id
    );

    if (isValid && caregiverStatus === "Verified" && !caregiverScheduleStatus) {
      if (pathname !== `/profile`) {
        return NextResponse.redirect(
          new URL(
            `/profile?user=${userId}&role=${userRole}&hasSchedule=false`,
            request.url
          )
        );
      }

      return NextResponse.next();
    }

    if (isValid && caregiverStatus === "Verified" && caregiverScheduleStatus)
      return NextResponse.next();
  }

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
