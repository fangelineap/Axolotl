"use server";

import createSupabaseServerClient from "@/app/lib/server";
import { unstable_noStore } from "next/cache";
import { AdminApprovalTable } from "../table/data";

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

    const caregiverWithUserDetails: AdminApprovalTable[] = caregivers.map(
      (caregiver) => ({
        ...caregiver,
        user: caregiver.users
      })
    );

    return caregiverWithUserDetails;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return [];
  }
}

/**
 * * Get single caregiver
 * @param caregiver_id
 * @returns
 */
export async function getSingleAdminApprovalById(caregiver_id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data: caregivers } = await supabase
      .from("caregiver")
      .select("*, users(*)")
      .eq("caregiver_id", caregiver_id)
      .single();

    const caregiverWithUserDetails: AdminApprovalTable = {
      ...caregivers,
      user: caregivers.users
    };

    return caregiverWithUserDetails;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return [];
  }
}

/**
 * * Approve caregiver
 * @param caregiver_id
 * @returns
 */
export async function adminApproveCaregiver(caregiver_id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data } = await supabase
      .from("caregiver")
      .update({
        status: "Verified",
        reviewed_at: new Date(),
        updated_at: new Date()
      })
      .eq("caregiver_id", caregiver_id)
      .single();

    return { data, error: null };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { data: null, error };
  }
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
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data } = await supabase
      .from("caregiver")
      .update({
        status: "Rejected",
        reviewed_at: new Date(),
        notes: notes,
        updated_at: new Date()
      })
      .eq("caregiver_id", caregiver_id)
      .single();

    return { data, error: null };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { data: null, error };
  }
}
