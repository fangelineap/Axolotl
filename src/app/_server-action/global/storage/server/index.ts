"use server";

import createSupabaseServerClient from "@/lib/server";
import { unstable_noStore } from "next/cache";

/**
 * * Function to get public storage URL in server component
 * @param storage
 * @param path
 * @returns
 */
export async function getServerPublicStorageURL(storage: string, path: string) {
  const supabase = await createSupabaseServerClient();

  try {
    const { data } = supabase.storage.from(storage).getPublicUrl(path);

    if (!data) {
      console.error("Error fetching public storage URL");

      return null;
    }

    const publicURL = data.publicUrl;

    return publicURL;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return null;
  }
}

/**
 * * Function to get private storage URL in server component
 * @param storage
 * @param path
 * @returns
 */
export async function getServerPrivateStorageURL(
  storage: string,
  path: string
) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data } = await supabase.storage
      .from(storage)
      .createSignedUrl(path, 900);

    if (!data) {
      console.error("Error fetching private storage URL");

      return null;
    }

    console.log({ storage, path, data });

    return data.signedUrl;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return null;
  }
}
