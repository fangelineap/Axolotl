"use server";

import createSupabaseServerClient from "@/app/lib/server";
import { unstable_noStore } from "next/cache";
import { AdminUserTable } from "../table/data";

export async function getAllUsers() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.from("users").select("*");

    const filterData = data?.filter((user: AdminUserTable) => user.user_id !== null);

    if (error) {
      console.error("Error fetching data:", error.message);
      return [];
    }

    return filterData as AdminUserTable[];
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return [];
  }
}
