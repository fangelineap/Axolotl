"use server";

import createSupabaseServerClient from "@/lib/server";
import { unstable_noStore } from "next/cache";

/**
 * * Global Get User Profile Photo
 * ! Do not enable noStore for this function
 * @param profile_photo
 * @returns
 */
export async function getGlobalUserProfilePhoto(profile_photo: string) {
  const supabase = await createSupabaseServerClient();

  try {
    const { data } = supabase.storage
      .from("profile_photo")
      .getPublicUrl(profile_photo);

    if (!data) {
      console.error("Error fetching profile photo");

      return null;
    }

    const profilePhotoUrl = data.publicUrl;

    return profilePhotoUrl;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return null;
  }
}

/**
 * * Global Get User Role
 * @param user_id
 * @returns
 */
export async function getGlobalUserRole(user_id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error) {
      console.error("Error fetching data:", error.message);

      return null;
    }

    return data.role;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return null;
  }
}

/**
 * * Global Get Caregiver Data by ID from Caregiver Table
 * @param caregiver_id
 * @returns
 */
export async function getGlobalCaregiverDataById(caregiver_id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("caregiver")
      .select("*")
      .eq("caregiver_id", caregiver_id)
      .single();

    if (error) {
      console.error("Error fetching caregivers data:", error.message);

      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { data: null, error };
  }
}
