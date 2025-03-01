"use server";

import { AdminOrderMedicineLogsTable } from "@/app/(pages)/admin/order/medicine/table/data";
import { AdminOrderServiceLogsTable } from "@/app/(pages)/admin/order/service/table/data";
import { createSupabaseAdminClient } from "@/lib/admin";
import createSupabaseServerClient from "@/lib/server";
import { USER_AUTH_SCHEMA } from "@/types/AxolotlMultipleTypes";
import { unstable_noStore } from "next/cache";

/**
 * * Create a user
 * @param email
 * @param password
 */
export async function adminCreateUser(email: string, password: string) {
  const supabaseAdmin = await createSupabaseAdminClient();

  try {
    const { data, error } = await supabaseAdmin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (error) {
      console.error("Error creating new user:", error.message);

      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error in createUser", error);

    return { data: null, error };
  }
}

/**
 * * Get the user's authentication schema from Supabase
 * @param user_id
 * @returns
 */
export async function adminGetUserAuthSchema(user_id: string) {
  unstable_noStore();

  const supabaseAdmin = await createSupabaseAdminClient();

  try {
    const { data: response, error } = await supabaseAdmin.getUserById(user_id);

    if (error) {
      console.error("Error fetching user data:", error.message);

      return null;
    }

    const authSchema = response.user as unknown as USER_AUTH_SCHEMA;

    return authSchema;
  } catch (error) {
    console.error("Error in adminGetUserAuthSchema:", error);

    return null;
  }
}

/**
 * * Delete a user from Supabase
 * @param user_id
 * @returns
 */
export async function adminDeleteUser(user_id: string) {
  unstable_noStore();

  const supabaseAdmin = await createSupabaseAdminClient();

  try {
    const { error } = await supabaseAdmin.deleteUser(user_id);
    if (error) {
      console.error("Error deleting user:", error.message);

      return null;
    }

    return true;
  } catch (error) {
    console.error("Error in adminDeleteUser:", error);

    return null;
  }
}

/**
 * * Update user email
 * @param email
 * @param existingEmail
 * @param user_id
 * @returns
 */
export async function adminUpdateUserEmail(
  email: string,
  existingEmail: string,
  user_id: string
) {
  unstable_noStore();

  const supabaseAdmin = await createSupabaseAdminClient();

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
 * * Update user password
 * @param user_id
 * @param password
 * @returns
 */
export async function adminUpdateUserPassword(
  user_id: string,
  password: string
) {
  unstable_noStore();

  const supabaseAdmin = await createSupabaseAdminClient();

  try {
    const { error } = await supabaseAdmin.updateUserById(user_id, {
      password
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
 * * Helper function to get all order service logs (no medicine)
 * @returns
 */
async function adminServiceLogs() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("order")
      .select("*, appointment(*), patient(*, users(*)), caregiver(*, users(*))")
      .is("medicine_order_id", null)
      .not("appointment_order_id", "is", null)
      .not("patient_id", "is", null)
      .not("caregiver_id", "is", null);

    if (error) {
      console.error("Error fetching Order Service Logs:", error);

      return [];
    }

    if (!data || data.length === 0) return [];

    return data as AdminOrderServiceLogsTable[];
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return [];
  }
}

/**
 * * Helper function to get all order medicine logs (incl. service logs)
 * @returns
 */
async function adminMedicineLogs() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("order")
      .select(
        "*, appointment(*), medicineOrder(*, medicineOrderDetail(*, medicine(*))), patient(*, users(*)), caregiver(*, users(*))"
      )
      .not("medicine_order_id", "is", null)
      .not("appointment_order_id", "is", null)
      .not("patient_id", "is", null)
      .not("caregiver_id", "is", null);

    if (error) {
      console.error("Error fetching Order Service Logs:", error);

      return [];
    }

    if (!data || data.length === 0) return [];

    return data as AdminOrderMedicineLogsTable[];
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return [];
  }
}

/**
 * * Get all order logs based on the log type
 * @param logType
 * @returns
 */
export async function adminGetAllOrderLogs(
  logType: "service" | "medicine"
): Promise<AdminOrderServiceLogsTable[] | AdminOrderMedicineLogsTable[]> {
  switch (logType) {
    case "service": {
      const serviceLogs = await adminServiceLogs();

      return serviceLogs as AdminOrderServiceLogsTable[];
    }
    case "medicine": {
      const medicineLogs = await adminMedicineLogs();

      return medicineLogs as AdminOrderMedicineLogsTable[];
    }
    default:
      throw new Error("Invalid log type");
  }
}

/**
 * * Get order service log details based on the order ID
 * @param orderId
 * @returns
 */
async function adminServiceLogsByOrderId(orderId: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("order")
      .select("*, appointment(*), patient(*, users(*)), caregiver(*, users(*))")
      .is("medicine_order_id", null)
      .not("appointment_order_id", "is", null)
      .not("patient_id", "is", null)
      .not("caregiver_id", "is", null)
      .eq("id", orderId)
      .single();

    if (error) {
      console.error("Error fetching Order Service Logs:", error);

      return { data: null, error };
    }

    return data as AdminOrderServiceLogsTable;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { data: null, error };
  }
}

/**
 * * Get order medicine log details based on the order ID
 * @param orderId
 * @returns
 */
async function adminMedicineLogsByOrderId(orderId: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("order")
      .select(
        "*, appointment(*), medicineOrder(*, medicineOrderDetail(*, medicine(*))), patient(*, users(*)), caregiver(*, users(*))"
      )
      .not("medicine_order_id", "is", null)
      .not("appointment_order_id", "is", null)
      .not("patient_id", "is", null)
      .not("caregiver_id", "is", null)
      .eq("id", orderId)
      .single();

    if (error) {
      console.error("Error fetching Order Service Logs:", error);

      return { data: null, error };
    }

    return data as AdminOrderMedicineLogsTable;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { data: null, error };
  }
}

/**
 * * Get order log details based on the order ID and log type
 * @param logType
 * @param orderId
 * @returns
 */
export async function adminGetOrderLogsByOrderId(
  logType: "service" | "medicine",
  orderId: string
): Promise<AdminOrderServiceLogsTable | AdminOrderMedicineLogsTable> {
  switch (logType) {
    case "service": {
      const serviceLogs = await adminServiceLogsByOrderId(orderId);

      return serviceLogs as AdminOrderServiceLogsTable;
    }
    case "medicine": {
      const medicineLogs = await adminMedicineLogsByOrderId(orderId);

      return medicineLogs as AdminOrderMedicineLogsTable;
    }
    default:
      throw new Error("Invalid log type");
  }
}
