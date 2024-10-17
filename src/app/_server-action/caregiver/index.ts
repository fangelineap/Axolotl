"use server";

import createSupabaseServerClient from "@/lib/server";
import { unstable_noStore } from "next/cache";

export async function getCaregiverPhoto(storage_id: string) {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase.storage
    .from("profile_photo")
    .getPublicUrl(storage_id);

  if (data) {
    return data.publicUrl;
  }
}

export async function getProfilePhoto(profile_photo: string) {
  const supabase = await createSupabaseServerClient();

  const { data } = supabase.storage
    .from("profile_photo")
    .getPublicUrl(profile_photo);

  if (data) {
    return data.publicUrl;
  }
}

export async function getCaregiverDataById(caregiver_id: string) {
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
