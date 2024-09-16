"use server";

import { NextResponse } from "next/server";
import { getUserFromSession } from "./app/lib/server";

export async function middleware(request: Request) {
  const { data, error } = await getUserFromSession();

  /**
   * If there's no Session & the user is trying to continue the personalinformation
   */
  if (!data || error) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const userRole = data[0]?.role;

  /**
   * If there's session, and the user tries to visit other roles based page
   */
  if (request.url.includes("/patient")) {
    if (userRole == "Patient") {
      return NextResponse.next();
    } else if (userRole == "Nurse" || userRole == "Midwife") {
      return NextResponse.redirect(new URL("/caregiver", request.url));
    } else if (userRole == "Admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (request.url.includes("/caregiver")) {
    if (userRole == "Patient") {
      return NextResponse.redirect(new URL("/patient", request.url));
    } else if (userRole == "Nurse" || userRole == "Midwife") {
      return NextResponse.next();
    } else if (userRole == "Admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (request.url.includes("/admin")) {
    if (userRole == "Patient") {
      return NextResponse.redirect(new URL("/patient", request.url));
    } else if (userRole == "Nurse" || userRole == "Midwife") {
      return NextResponse.redirect(new URL("/caregiver", request.url));
    } else if (userRole == "Admin") {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    "/patient/:path*",
    "/admin/:path*",
    "/caregiver/:path*",
    "/auth/register/createaccount/personalinformation:path*/:path*",
  ],
};
