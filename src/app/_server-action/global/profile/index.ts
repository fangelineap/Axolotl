"use server";

import { AdminUserTable } from "@/app/(pages)/admin/manage/user/table/data";
import createSupabaseServerClient, { getUserFromSession } from "@/lib/server";
import {
  BASIC_PROFILE_DETAILS,
  CAREGIVER_PROFILE_DETAILS,
  CAREGIVER_SCHEDULE_DATA,
  PATIENT_PROFILE_DETAILS
} from "@/types/AxolotlMultipleTypes";
import { ServerFormValidation } from "@/utils/Validation/form/ServerFormValidation";
import { unstable_noStore } from "next/cache";
import { adminGetUserAuthSchema, adminUpdateUserEmail } from "../../admin";

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

      return { data: null, error: userDataError };
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

/**
 * * Update basic profile details
 * @param form
 * @returns
 */
export async function updateBasicProfileDetails(form: BASIC_PROFILE_DETAILS) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  // Form Validation
  const { email, phone_number, address } = form;
  const validationError = ServerFormValidation({
    email,
    phone_number,
    address
  });

  if (validationError) {
    console.error("Validation Error:", validationError);

    return { success: false, message: validationError.message };
  }

  try {
    const { data: currentUserData, error: currentUserError } =
      await getUserFromSession();

    if (currentUserError || !currentUserData) {
      console.error("Error fetching current user data:", currentUserError);

      return { success: false, message: "Failed to fetch current user data" };
    }

    const userId = currentUserData.id;
    const userUUID = currentUserData.user_id;

    // Check existing email
    const authSchema = await adminGetUserAuthSchema(userUUID);

    if (!authSchema) {
      console.error("Error fetching user auth schema");

      return { success: false, message: "Failed to fetch user auth schema" };
    }

    const isEmailUpdated = await adminUpdateUserEmail(
      email,
      authSchema.email,
      userUUID
    );

    if (!isEmailUpdated) {
      console.error("Error updating user email");

      return { success: false, message: "Failed to update user email" };
    }

    const { error } = await supabase
      .from("users")
      .update({
        phone_number,
        address,
        updated_at: new Date()
      })
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error updating user data:", error);

      return { success: false, message: "Failed to update user data" };
    }

    return { success: true, message: "User data updated successfully" };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { success: false, message: "An unexpected error occurred" };
  }
}

/**
 * * Helper function to update patient profile details
 * @param form
 * @param userId
 * @returns
 */
async function updatePatientProfileDetails(
  form: PATIENT_PROFILE_DETAILS,
  userId: string
) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  // Form Validation
  const { weight, height, is_smoking, illness_history } = form;

  const validationError = ServerFormValidation({
    weight,
    height,
    is_smoking,
    illness_history
  });

  if (validationError) {
    console.error("Validation error:", validationError);

    return { success: false, message: validationError.message };
  }

  try {
    const { data, error } = await supabase
      .from("patient")
      .update({
        ...form,
        updated_at: new Date()
      })
      .eq("patient_id", userId)
      .single();

    if (error) {
      console.error("Error updating patient data:", error);

      return { success: false, message: "Failed to update patient data" };
    }

    console.dir(data, { depth: null, color: true });

    return { success: true, message: "Patient data updated successfully" };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { success: false, message: "An unexpected error occurred" };
  }
}

/**
 * * Helper function to update caregiver profile details
 * @param form
 * @param userId
 * @returns
 */
async function updateCaregiverProfileDetails(
  form: CAREGIVER_PROFILE_DETAILS,
  userId: string
) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  // Form Validation
  const { start_day, end_day, start_time, end_time } = form;
  const validationError = ServerFormValidation({
    start_day,
    end_day,
    start_time,
    end_time
  });

  const updateFields = {
    schedule_start_day: start_day,
    schedule_end_day: end_day,
    schedule_start_time: start_time,
    schedule_end_time: end_time
  };

  if (validationError) {
    console.error("Validation error:", validationError);

    return { success: false, message: validationError.message };
  }

  try {
    const { error } = await supabase
      .from("caregiver")
      .update({
        ...updateFields,
        updated_at: new Date()
      })
      .eq("caregiver_id", userId)
      .single();

    if (error) {
      console.error("Error updating caregiver data:", error);

      return { success: false, message: "Failed to update caregiver data" };
    }

    return { success: true, message: "Caregiver data updated successfully" };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { success: false, message: "An unexpected error occurred" };
  }
}

/**
 * * Update user profile details based on their role
 * @param form
 * @returns
 */
export async function updateRoleProfileDetails(
  form: PATIENT_PROFILE_DETAILS | CAREGIVER_PROFILE_DETAILS
) {
  unstable_noStore();

  try {
    const { data: currentUserData, error: currentUserError } =
      await getUserFromSession();

    if (currentUserError || !currentUserData) {
      console.error("Error fetching current user data:", currentUserError);

      return { success: false, message: "Failed to fetch current user data" };
    }

    const userId = currentUserData.id;
    const userRole = currentUserData.role;

    switch (userRole) {
      case "Patient":
        return await updatePatientProfileDetails(
          form as PATIENT_PROFILE_DETAILS,
          userId
        );

      case "Midwife":
      case "Nurse":
        return await updateCaregiverProfileDetails(
          form as CAREGIVER_PROFILE_DETAILS,
          userId
        );

      default:
        return { success: false, message: "Invalid user role" };
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { success: false, message: "An unexpected error occurred" };
  }
}

/**
 * * Identical function with updateCaregiverProfileDetails to update caregiver schedule
 * @param form
 * @returns
 */
export async function updateCaregiverSchedule(form: CAREGIVER_SCHEDULE_DATA) {
  unstable_noStore();

  const { start_day, end_day, start_time, end_time } = form;
  const validationError = ServerFormValidation({
    start_day,
    end_day,
    start_time,
    end_time
  });

  if (validationError) {
    console.error("Validation error:", validationError);

    return { success: false, message: validationError.message };
  }

  try {
    const { data: currentUserData, error: currentUserError } =
      await getUserFromSession();

    if (currentUserError || !currentUserData) {
      console.error("Error fetching current user data:", currentUserError);

      return { success: false, message: "Failed to fetch current user data" };
    }

    const userId = currentUserData.id;

    const { success } = await updateCaregiverProfileDetails(form, userId);

    if (!success) {
      console.error("Error updating caregiver schedule");

      return { success: false, message: "Failed to update caregiver schedule" };
    }

    return {
      success: true,
      message: "Caregiver schedule updated successfully"
    };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { success: false, message: "An unexpected error occurred" };
  }
}
