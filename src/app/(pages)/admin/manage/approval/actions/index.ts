"use server";

import createSupabaseServerClient from "@/app/lib/server";
import { unstable_noStore } from "next/cache";
import { AdminApprovalTable } from "../table/data";

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
        user: caregiver.users,
      }),
    );

    return caregiverWithUserDetails;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return [];
  }
}

export async function getSingleAdminApprovalById(caregiver_id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    // Fetch caregivers data
    const { data: caregivers, error: caregiverError } = await supabase
      .from("caregiver")
      .select("*, users(*)")
      .eq("caregiver_id", caregiver_id)
      .single();

    if (caregiverError || !caregivers) {
      console.error(
        "Error fetching caregivers data:",
        caregiverError?.message || "No caregiver found",
      );
      return null;
    }

    const caregiverWithUserDetails: AdminApprovalTable = {
      ...caregivers,
      user: caregivers.users,
    };

    return caregiverWithUserDetails;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return [];
  }
}

export async function adminApproveCaregiver(caregiver_id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("caregiver")
      .update({
        status: "Verified",
        reviewed_at: new Date(),
      })
      .eq("caregiver_id", caregiver_id)
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return { data: null, error };
  }
}

export async function adminRejectCaregiver(caregiver_id: string, notes: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("caregiver")
      .update({
        status: "Rejected",
        reviewed_at: new Date(),
        notes: notes,
      })
      .eq("caregiver_id", caregiver_id)
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return { data: null, error };
  }
}
