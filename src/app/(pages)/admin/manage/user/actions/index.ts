"use server";

import createSupabaseServerClient from "@/app/lib/server";
import {
  deleteUser,
  getUserAuthSchema
} from "@/app/server-action/admin/SupaAdmin";
import { unstable_noStore } from "next/cache";
import { AdminUserTable } from "../table/data";
import { USER_AUTH_SCHEMA } from "@/types/axolotl";

export async function addAdminNewAdmin(form: USER_AUTH_SCHEMA) {
  unstable_noStore();
}

export async function getAdminAllUsers() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.from("users").select("*");

    const filterData = data?.filter(
      (user: AdminUserTable) => user.user_id !== null
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

    const authSchema = await getUserAuthSchema(user_id);

    const allData: AdminUserTable = {
      ...userData,
      email: authSchema?.email,
      patient: userData?.patient.length === 0 ? null : userData?.patient[0],
      caregiver:
        userData?.caregiver.length === 0 ? null : userData?.caregiver[0]
    };

    return allData as AdminUserTable;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return { data: null, error };
  }
}

export async function deleteAdminUser(user_id: string) {
  unstable_noStore();

  try {
    const supabase = await createSupabaseServerClient();
    const { error: deleteFromUserTableError } = await supabase
      .from("users")
      .delete()
      .eq("user_id", user_id);

    await deleteUser(user_id);

    if (deleteFromUserTableError) {
      console.error("Error deleting user:", deleteFromUserTableError?.message);
      return null;
    }
    console.log("Successfully deleted user:", user_id);

    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
}
