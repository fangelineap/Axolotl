"use server";

import createSupabaseServerClient from "@/lib/server";

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
