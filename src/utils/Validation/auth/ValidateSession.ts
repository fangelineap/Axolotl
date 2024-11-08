import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/**
 * * Validate the current session with the last session stored in the browser
 * @param supabase
 * @param request
 * @returns
 */
export async function validateSession(
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
    response.cookies.set("sb-aldbaqcbjyujaoncrhuc-auth-token", "", {
      expires: new Date(0)
    });
    response.cookies.set(
      "sb-aldbaqcbjyujaoncrhuc-auth-token-code-verifier",
      "",
      { expires: new Date(0) }
    );

    return { isValid: false, response };
  }

  return { isValid: true, user };
}
