"use server";

import createSupabaseServerClient from "@/app/lib/server";

export async function getCaregiverPhoto(storage_id: string) {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase.storage
    .from("profile_photo")
    .getPublicUrl(storage_id);

  if (data) {
    return data.publicUrl;
  }
}
