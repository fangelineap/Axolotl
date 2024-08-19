"use server";

import createSupabaseServerClient from "@/app/lib/server";

export default async function readUserSession() {
  const supabase = await createSupabaseServerClient();

  return supabase.auth.getSession();
}
