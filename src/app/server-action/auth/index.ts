"use server";

import createSupabaseServerClient from "@/app/lib/server";

export async function signInWithEmailAndPassword(
  email: string,
  password: string,
) {
  const supabase = await createSupabaseServerClient();

  return supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
}
