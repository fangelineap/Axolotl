"use server";

import createSupabaseServerClient from "@/app/lib/server";
import { unstable_noStore } from "next/cache";
import { AdminUserTable } from "../table/data";
import { getUserAuthSchema } from "@/app/server-action/admin/SupaAdmin";

export async function getAdminAllUsers() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.from("users").select("*");

    const filterData = data?.filter(
      (user: AdminUserTable) => user.user_id !== null,
    );

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

export async function getAdminUserByUserID(user_id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("*, patient(*), caregiver(*)")
      .eq("user_id", user_id)
      .single();

    if (userDataError) {
      console.error("Error fetching data:", userDataError.message);
      return null;
    }

    const authSchema = await getUserAuthSchema(
      user_id,
    );

    const allData: AdminUserTable = {
      ...userData,
      email: authSchema?.email,
      patient: (userData?.patient.length === 0) ? null : userData?.patient[0],
      caregiver: (userData?.caregiver.length === 0) ? null : userData?.caregiver[0],
    };

    return allData as AdminUserTable;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return { data: null, error };
  }
}
