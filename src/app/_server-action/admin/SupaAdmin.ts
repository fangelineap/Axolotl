"use server";

import { createClient } from "@supabase/supabase-js";
import { unstable_noStore } from "next/cache";

/**
 * * Get the admin auth client
 * @returns
 */
async function getAdminAuthClient() {
  const supabaseAdminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  return supabaseAdminClient.auth.admin;
}

/**
 * * Create a user
 * @param email
 * @param password
 */
export async function createUser(email: string, password: string) {
  const supabaseAdmin = await getAdminAuthClient();

  try {
    const { data, error } = await supabaseAdmin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (error) {
      console.error("Error creating new user:", error.message);

      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error in createUser", error);

    return { data: null, error };
  }
}

/**
 * * Get the user's authentication schema from Supabase
 * @param user_id
 * @returns
 */
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

/**
 * * Delete a user from Supabase
 * @param user_id
 * @returns
 */
export async function deleteUser(user_id: string) {
  unstable_noStore();

  try {
    const supabaseAdmin = await getAdminAuthClient();
    const { error } = await supabaseAdmin.deleteUser(user_id);
    if (error) {
      console.error("Error deleting user:", error.message);

      return null;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteUser:", error);

    return null;
  }
}
