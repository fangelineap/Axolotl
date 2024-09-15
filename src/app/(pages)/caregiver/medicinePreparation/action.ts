"use server";

import createSupabaseServerClient from "@/app/lib/server";

export const fetchMedicine = async () => {
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await supabase.from("medicine").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error fetching medicine:", error.message);
      throw new Error("Failed to fetch medicine");
    } else {
      console.log("Unknown error fetching medicine");
      throw new Error("An unknown error occurred while fetching medicine");
    }
  }
};
