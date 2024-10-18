"use server";

import { getAdminAuthClient } from "@/lib/admin";
import { USER_AUTH_SCHEMA } from "@/types/axolotl";
import { unstable_noStore } from "next/cache";

/**
 * * Create a user
 * @param email
 * @param password
 */
export async function adminCreateUser(email: string, password: string) {
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
export async function adminGetUserAuthSchema(user_id: string) {
  const supabaseAdmin = await getAdminAuthClient();

  try {
    const { data: response, error } = await supabaseAdmin.getUserById(user_id);

    if (error) {
      console.error("Error fetching user data:", error.message);

      return null;
    }

    const authSchema = response.user as unknown as USER_AUTH_SCHEMA;

    return authSchema;
  } catch (error) {
    console.error("Error in adminGetUserAuthSchema:", error);

    return null;
  }
}

/**
 * * Delete a user from Supabase
 * @param user_id
 * @returns
 */
export async function adminDeleteUser(user_id: string) {
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
    console.error("Error in adminDeleteUser:", error);

    return null;
  }
}
