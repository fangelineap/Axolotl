"use server";

import {
  adminCreateUser,
  adminDeleteUser,
  adminGetUserAuthSchema
} from "@/app/_server-action/admin";
import {
  getGlobalCaregiverDataByCaregiverOrUserId,
  getGlobalUserDataByUserId
} from "@/app/_server-action/global";
import { getAdminAuthClient } from "@/lib/admin";
import createSupabaseServerClient from "@/lib/server";
import { CREATE_NEW_ADMIN_AUTH_SCHEMA } from "@/types/AxolotlMultipleTypes";
import { unstable_noStore } from "next/cache";
import { CAREGIVER } from "@/types/AxolotlMainType";
import {
  AdminUpdateAdminDetails,
  AdminUpdateCaregiverDetails,
  AdminUserTable
} from "../table/data";

/**
 * * Validate required fields
 * @param fields
 * @returns
 */
function validateRequiredFields(fields: Record<string, any>) {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      return {
        name: `Missing ${key}`,
        message: `${key} is required`
      };
    }
  }

  return null;
}

/**
 * * Create an admin
 * @param form
 * @returns
 */
export async function createAdminNewAdmin(form: CREATE_NEW_ADMIN_AUTH_SCHEMA) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  const {
    email,
    password,
    first_name,
    last_name,
    phone_number,
    address,
    gender,
    birthdate
  } = form;

  const validationError = validateRequiredFields({
    email,
    password,
    first_name,
    last_name,
    phone_number,
    address,
    gender,
    birthdate
  });

  if (validationError) {
    console.error("Validation error:", validationError);

    return {
      data: null,
      validationError
    };
  }

  try {
    const { data: authData, error: authError } = await adminCreateUser(
      email,
      password
    );

    if (!authData || authError) {
      console.error(authError);

      return {
        data: null,
        error: {
          name: "Authentication Error",
          message: authError
        }
      };
    }

    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .insert({
        first_name,
        last_name,
        phone_number,
        address,
        gender,
        birthdate,
        role: "Admin",
        user_id: authData.user?.id
      });

    if (userDataError) {
      console.error(userDataError);

      return {
        data: null,
        error: {
          name: "Database Error",
          message:
            userDataError.message || "Failed to insert user into the database."
        }
      };
    }

    return { data: userData, error: null };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { data: null, error };
  }
}

/**
 * * Get all users within users table
 * @returns
 */
export async function getAdminAllUsers() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Error fetching data:", error.message);

      return [];
    }

    if (!data || data.length === 0) return [];

    const responses = await Promise.all(
      data
        .map(async (user) => {
          const response = await adminGetUserAuthSchema(user.user_id);

          return response ? { ...user, email: response.email } : null;
        })
        .filter((response) => response !== null)
    );

    return responses as AdminUserTable[];
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return [];
  }
}

/**
 * * Get Caregiver Total Order
 * @param user_id
 * @returns
 */
export async function getAdminCaregiverTotalOrders(user_id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const userData = await getGlobalUserDataByUserId(user_id);

    if (!userData) {
      console.error("Error fetching user data");

      return { data: null, userDataError: "Error fetching user data" };
    }

    const { data: caregiver, error: caregiverError } = await supabase
      .from("caregiver")
      .select("*, users(*)")
      .eq("caregiver_id", userData.id)
      .single();

    if (caregiverError) {
      console.error("Error fetching userData:", caregiverError.message);

      return { data: null, caregiverError };
    }

    const { data: orderData, error: orderDataError } = await supabase
      .from("order")
      .select("*")
      .eq("caregiver_id", caregiver.id);

    if (orderDataError) {
      console.error("Error fetching orderData:", orderDataError.message);

      return { data: null, orderDataError };
    }

    const totalOrders = orderData?.length;

    if (totalOrders === 0) return { data: 0, error: null };

    return { data: totalOrders, error: null };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { data: null, error };
  }
}

/**
 * * Helper Function to update user email
 * @param email
 * @param existingEmail
 * @returns
 */
async function updateAdminUserEmail(
  email: string,
  existingEmail: string,
  user_id: string
) {
  unstable_noStore();

  const supabaseAdmin = await getAdminAuthClient();

  if (email === existingEmail) return true;

  try {
    const { error } = await supabaseAdmin.updateUserById(user_id, {
      email,
      email_confirm: true
    });

    if (error) {
      console.error("Error updating user email:", error.message);

      return false;
    }

    return true;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return false;
  }
}

/**
 * * Update admin data
 * @param userData
 * @param user_id
 * @returns
 */
export async function updateAdminUserData(
  form: AdminUpdateAdminDetails
): Promise<{ data?: any; success: boolean }> {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  // Form Validation
  const { user_id, email, phone_number, address } = form;
  const validationError = validateRequiredFields({
    user_id,
    email,
    phone_number,
    address
  });

  if (validationError) {
    console.error("Validation error:", validationError);

    return { success: false };
  }

  try {
    // Check existing email
    const authSchema = await adminGetUserAuthSchema(user_id);
    if (!authSchema) return { success: false };

    const isEmailUpdated = await updateAdminUserEmail(
      email,
      authSchema.email,
      user_id
    );

    if (!isEmailUpdated) return { success: false };

    // Update user data
    const { data, error } = await supabase
      .from("users")
      .update({
        phone_number,
        address,
        updated_at: new Date()
      })
      .eq("user_id", user_id)
      .single();

    if (error) {
      console.error("Error updating user data:", error.message);

      return { success: false };
    }

    return { data, success: true };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { success: false };
  }
}

/**
 * * Update caregiver data
 * @param supabase
 * @param user_id
 * @param caregiverData
 * @returns
 */
export async function updateAdminCaregiverData(
  form: AdminUpdateCaregiverDetails
): Promise<{ data?: any; success: boolean }> {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  // Form Validation
  const {
    user_id,
    employment_type,
    work_experiences,
    workplace,
    cv,
    degree_certificate,
    str,
    sip
  } = form;

  const validationError = validateRequiredFields({
    user_id,
    employment_type,
    work_experiences,
    workplace,
    cv,
    degree_certificate,
    str,
    sip
  });

  if (validationError) {
    console.error("Validation error:", validationError);

    return { success: false };
  }

  try {
    const {
      data: getCaregiverDetailedData,
      error: getCaregiverDetailedDataError
    } = await getGlobalCaregiverDataByCaregiverOrUserId("users", user_id);

    if (getCaregiverDetailedDataError) {
      console.error(
        "Error fetching detailed caregiver data:",
        getCaregiverDetailedDataError
      );

      return { success: false };
    }

    const caregiverDetailedData = getCaregiverDetailedData
      .caregiver[0] as CAREGIVER;

    // Server side validation for caregiver status
    if (["Rejected", "Unverified"].includes(caregiverDetailedData.status))
      return { success: false };

    const caregiver_id = caregiverDetailedData.id;

    // Update detailed caregiver data
    const {
      data: updatedCaregiverDetailedData,
      error: updatedCaregiverDetailedDataError
    } = await supabase
      .from("caregiver")
      .update({
        employment_type,
        work_experiences,
        workplace,
        cv,
        degree_certificate,
        str,
        sip,
        updated_at: new Date()
      })
      .eq("id", caregiver_id)
      .single();

    if (updatedCaregiverDetailedDataError) {
      console.error(
        "Error updating caregiver data:",
        updatedCaregiverDetailedDataError.message
      );

      return { success: false };
    }

    return { data: updatedCaregiverDetailedData, success: true };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { success: false };
  }
}

/**
 * * Delete a user
 * @param user_id
 * @returns
 */
export async function deleteAdminUserFromUserTable(user_id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { error: deleteFromUserTableError } = await supabase
      .from("users")
      .delete()
      .eq("user_id", user_id);

    if (deleteFromUserTableError) {
      console.error("Error deleting user:", deleteFromUserTableError?.message);

      return null;
    }

    await adminDeleteUser(user_id);

    return true;
  } catch (error) {
    console.error(error);

    return null;
  }
}
