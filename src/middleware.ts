"use server";

import { NextResponse } from "next/server";
import { getUserFromSession } from "./app/lib/server";
import { getCaregiverVerificationStatus } from "./app/server-action/auth";

export async function middleware(request: Request) {
  const { data, error } = await getUserFromSession();
  console.log(data, error);

  /**
   * If there's no Session & the user is trying to continue the personalinformation
   */
  if (!data || error) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const userRole = data[0]?.role;
  const userId = data[0]?.id;
  const { url } = request;

  // Role-based redirects
  const roleRedirects: { [key: string]: string } = {
    Patient: "/patient",
    Nurse: "/caregiver",
    Midwife: "/caregiver",
    Admin: "/admin",
  };

  // Handle patient, caregiver, and admin access
  if (url.includes("/patient")) {
    if (userRole === "Patient") return NextResponse.next();
  } else if (url.includes("/caregiver")) {
    if (userRole === "Nurse" || userRole === "Midwife") {
      const caregiverStatus = await getCaregiverVerificationStatus(userId);

      const caregiverRedirects = {
        Verified: NextResponse.next(),
        Rejected: NextResponse.redirect(
          new URL(
            "/auth/register/createaccount/personalinformation/review?role=Caregiver",
            url,
          ),
        ),
        Unverified: NextResponse.redirect(
          new URL(
            "/auth/register/createaccount/personalinformation/review?role=Caregiver",
            url,
          ),
        ),
      };

      return (
        (caregiverStatus !== null && caregiverRedirects[caregiverStatus]) ||
        NextResponse.redirect(new URL("/", url))
      );
    }
  } else if (url.includes("/admin")) {
    if (userRole === "Admin") return NextResponse.next();
  }

  // Default role-based redirection
  return NextResponse.redirect(new URL(roleRedirects[userRole] || "/", url));
}

export const config = {
  matcher: ["/patient/:path*", "/admin/:path*", "/caregiver/:path*"],
};
