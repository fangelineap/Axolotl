"use server";

import createSupabaseServerClient from "@/lib/server";
import { unstable_noStore } from "next/cache";
import { AdminApprovalTable } from "../table/data";
import { getGlobalUserDataByUserId } from "@/app/_server-action/global";

/**
 * * Get all caregiver
 * @returns
 */
export async function getAllAdminApproval() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data: caregivers, error } = await supabase
      .from("caregiver")
      .select("*, users(*)");

    if (error) {
      console.error("Error fetching caregivers data:", error.message);

      return [];
    }

    return caregivers as AdminApprovalTable[];
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return [];
  }
}

/**
 * * Get single caregiver
 * @param user_id
 * @returns
 */
export async function getSingleAdminApprovalById(user_id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const userData = await getGlobalUserDataByUserId(user_id);

    if (!userData) {
      console.error("Error fetching user data");

      return [];
    }

    const { data: caregiver, error } = await supabase
      .from("caregiver")
      .select("*, users(*)")
      .eq("caregiver_id", userData.id)
      .single();

    if (error) {
      console.error("Error fetching caregiver data:", error.message);
    }

    const caregiverWithUserDetails: AdminApprovalTable = {
      ...caregiver,
      users: caregiver.users
    };

    return caregiverWithUserDetails;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return [];
  }
}

/**
 * * Helper function to update caregiver verification status
 * @param caregiver_id
 * @param status
 * @param notes
 * @returns
 */
async function updateCaregiverStatus(
  caregiver_id: string,
  status: "Verified" | "Rejected",
  notes?: string
) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  const updateData = {
    status,
    reviewed_at: new Date(),
    updated_at: new Date(),
    ...(notes && { notes })
  };

  try {
    const { data, error } = await supabase
      .from("caregiver")
      .update(updateData)
      .eq("caregiver_id", caregiver_id)
      .single();

    if (error) {
      console.error("Error updating caregiver status:", error.message);

      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { data: null, error };
  }
}

/**
 * * Approve caregiver
 * @param caregiver_id
 * @returns
 */
export async function adminApproveCaregiver(caregiver_id: string) {
  return await updateCaregiverStatus(caregiver_id, "Verified");
}

/**
 * * Reject caregiver
 * @param caregiver_id
 * @param notes
 * @returns
 */
export async function adminRejectCaregiver(
  caregiver_id: string,
  notes: string
) {
  return await updateCaregiverStatus(caregiver_id, "Rejected", notes);
}
