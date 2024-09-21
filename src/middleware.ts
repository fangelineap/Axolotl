"use server";

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

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
   * If there's no Session & the user is trying to continue the personalinformation
   */
  if (!user && !request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const userId = user?.id;

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (userData) {
    console.log({ user, userData });
  }

  const userRole = userData.role;

  console.log({ userRole });

  // const { url } = request;

  // // Role-based redirects
  // const roleRedirects: { [key: string]: string } = {
  //   Patient: "/patient",
  //   Nurse: "/caregiver",
  //   Midwife: "/caregiver",
  //   Admin: "/admin",
  // };

  // // Handle patient, caregiver, and admin access
  // if (url.includes("/patient")) {
  //   if (userRole === "Patient") return NextResponse.next();
  // } else if (url.includes("/caregiver")) {
  //   if (userRole === "Nurse" || userRole === "Midwife") {
  //     const caregiverStatus = await getCaregiverVerificationStatus(userId);

  //     const caregiverRedirects = {
  //       Verified: NextResponse.next(),
  //       Rejected: NextResponse.redirect(
  //         new URL(
  //           "/auth/register/createaccount/personalinformation/review?role=Caregiver",
  //           url,
  //         ),
  //       ),
  //       Unverified: NextResponse.redirect(
  //         new URL(
  //           "/auth/register/createaccount/personalinformation/review?role=Caregiver",
  //           url,
  //         ),
  //       ),
  //     };

  //     return (
  //       (caregiverStatus !== null && caregiverRedirects[caregiverStatus]) ||
  //       NextResponse.redirect(new URL("/", url))
  //     );
  //   }
  // } else if (url.includes("/admin")) {
  //   if (userRole === "Admin") return NextResponse.next();
  // }

  // // Default role-based redirection
  // const redirectUrl = roleRedirects[userRole];
  // if (redirectUrl) {
  //   return NextResponse.redirect(new URL(redirectUrl, request.url));
  // }

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