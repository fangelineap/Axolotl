"use server";

import createSupabaseServerClient from "@/lib/server";
import {
  createUser,
  deleteUser,
  getUserAuthSchema
} from "@/app/server-action/admin/SupaAdmin";
import { NEW_ADMIN_AUTH_SCHEMA } from "@/types/axolotl";
import { unstable_noStore } from "next/cache";
import { AdminUserTable, AdminCaregiverDetails } from "../table/data";

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
export async function createAdminNewAdmin(form: NEW_ADMIN_AUTH_SCHEMA) {
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
    const { data: authData, error: authError } = await createUser(
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

    const filterData: AdminUserTable[] = data?.filter(
      (user: AdminUserTable) => user.user_id !== null
    );

    return filterData;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return [];
  }
}

/**
 * * Get single user and mapped them according to their roles
 * @param user_id
 * @returns
 */
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
 * * Get Caregiver Total Order
 * @param user_id
 * @returns
 */
export async function getAdminCaregiverTotalOrders(user_id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("*, caregiver(*)")
      .eq("user_id", user_id)
      .single();

    if (userDataError) {
      console.error("Error fetching userData:", userDataError.message);

      return { data: null, userDataError };
    }

    const caregiverData = Array.isArray(userData.caregiver)
      ? userData.caregiver[0]
      : userData.caregiver;

    const detailedCaregiverData: AdminCaregiverDetails = {
      ...userData,
      caregiver: caregiverData
    };

    const { data: orderData, error: orderDataError } = await supabase
      .from("order")
      .select("*")
      .eq("caregiver_id", detailedCaregiverData.caregiver.id);

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
 * * Delete a user
 * @param user_id
 * @returns
 */
export async function deleteAdminUser(user_id: string) {
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

    await deleteUser(user_id);

    return true;
  } catch (error) {
    console.error(error);

    return null;
  }
}
