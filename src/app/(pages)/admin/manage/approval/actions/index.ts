"use server";

import createSupabaseServerClient from "@/app/lib/server";
import { unstable_noStore } from "next/cache";
import { AdminApprovalTable } from "../table/data";

export async function getAdminApproval() {
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

    // Directly cast caregivers to the expected AdminApprovalTable[] type
    const userWithCaregiver: AdminApprovalTable[] = caregivers ?? [];

    return userWithCaregiver;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return [];
  }
}

export async function getAdminCaregiverDataById(id: number) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("caregiver")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching data:", error.message);
      return null;
    }

    return data as AdminApprovalTable;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return [];
  }
}

export async function getAdminApprovalById(caregiver_id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    // Fetch caregivers data
    const { data: caregivers, error: caregiverError } = await supabase
      .from("caregiver")
      .select("*")
      .eq("caregiver_id", caregiver_id)
      .single();

    if (caregiverError || !caregivers) {
      console.error(
        "Error fetching caregivers data:",
        caregiverError?.message || "No caregiver found",
      );
      return null;
    }

    // Fetch corresponding user data for each caregiver_id
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", caregivers.caregiver_id)
      .single();

    if (userError) {
      console.error(
        `Error fetching user data for caregiver_id ${caregivers.caregiver_id}:`,
        userError.message,
      );
      return { caregivers, user: null } as unknown as AdminApprovalTable;
    }

    // Combine caregiver data with user data
    const detailedData: AdminApprovalTable = { ...caregivers, user };

    return detailedData;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return [];
  }
}

export async function approveCaregiver(caregiver_id: string) {
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

export async function rejectCaregiver(caregiver_id: string, notes: string) {
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
