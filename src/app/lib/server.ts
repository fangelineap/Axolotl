"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}

export async function getUserFromSession() {
  const supabase = await createSupabaseServerClient();
  const { data: sessionData, error } = await supabase.auth.getSession();

  // Return early if there's no session or an error
  if (error || !sessionData?.session) {
    return { data: null, error: error || new Error("No session found") };
  }

  // Fetch the user from the database
  const { data: user, error: userError } = await supabase
    .from("users")
    .select()
    .eq("user_id", sessionData.session.user.id);

  return {
    data: user || null,
    error: userError || null,
  };
}
