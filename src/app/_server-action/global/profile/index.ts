"use server";

import { AdminUserTable } from "@/app/(pages)/admin/manage/user/table/data";
import createSupabaseServerClient from "@/lib/server";
import {
  BASIC_PROFILE_DETAILS,
  CAREGIVER_PROFILE_DETAILS,
  PATIENT_PROFILE_DETAILS
} from "@/types/AxolotlMultipleTypes";
import { unstable_noStore } from "next/cache";
import { adminGetUserAuthSchema } from "../../admin";

/**
 * * Get single user and mapped them according to their roles
 * @param user_id
 * @returns
 */
export async function getGlobalProfile(user_id: string) {
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

    const authSchema = await adminGetUserAuthSchema(user_id);

    /* Combine user data with auth schema */
    const allData: AdminUserTable = {
      ...userData,
      email: authSchema?.email,
      patient: userData?.patient.length === 0 ? null : userData?.patient[0],
      caregiver:
        userData?.caregiver.length === 0 ? null : userData?.caregiver[0]
    };

    return allData;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { data: null, error };
  }
}

export async function updateBasicProfileDetails(form: BASIC_PROFILE_DETAILS) {
  unstable_noStore();

  // const supabase = await createSupabaseServerClient();

  console.log(form);

  return { success: true, message: "Basic Profile updated successfully" };
}

export async function updatePatientProfileDetails(
  form: PATIENT_PROFILE_DETAILS
) {
  unstable_noStore();

  // const supabase = await createSupabaseServerClient();

  console.log(form);

  return { success: true, message: "Patient Profile updated successfully" };
}

export async function updateCaregiverProfileDetails(
  form: CAREGIVER_PROFILE_DETAILS
) {
  unstable_noStore();

  // const supabase = await createSupabaseServerClient();

  console.log(form);

  return { success: true, message: "Caregiver Profile updated successfully" };
}
