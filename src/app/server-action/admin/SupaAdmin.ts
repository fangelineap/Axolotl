"use server";

import { createClient } from "@supabase/supabase-js";

async function getAdminAuthClient() {
  const supabaseAdminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  return supabaseAdminClient.auth.admin;
}

export async function getUserAuthSchema(user_id: string) {
  const supabaseAdmin = await getAdminAuthClient();

  try {
    const { data: response, error } = await supabaseAdmin.getUserById(user_id);

    if (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }

    return response?.user;
  } catch (error) {
    console.error("Error in getUserAuthSchema:", error);
    return null;
  }
}
