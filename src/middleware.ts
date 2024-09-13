"use server";

import { NextResponse } from "next/server";
import { getUserFromSession } from "./app/lib/server";

export async function middleware(request: Request) {
  const { data, error } = await getUserFromSession();

  if (!data) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (request.url.includes("/patient")) {
    if (data[0].role == "Patient") {
      return NextResponse.next();
    } else if (data[0].role == "Nurse" || data[0].role == "Midwife") {
      return NextResponse.redirect(new URL("/caregiver", request.url));
    } else if (data[0].role == "Admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (request.url.includes("/caregiver")) {
    if (data[0].role == "Patient") {
      return NextResponse.redirect(new URL("/patient", request.url));
    } else if (data[0].role == "Nurse" || data[0].role == "Midwife") {
      return NextResponse.next();
    } else if (data[0].role == "Admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (request.url.includes("/admin")) {
    if (data[0].role == "Patient") {
      return NextResponse.redirect(new URL("/patient", request.url));
    } else if (data[0].role == "Nurse" || data[0].role == "Midwife") {
      return NextResponse.redirect(new URL("/caregiver", request.url));
    } else if (data[0].role == "Admin") {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL("guest", request.url));
}

export const config = {
  matcher: ["/patient", "/admin", "/caregiver"],
};
