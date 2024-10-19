"use server";

import createSupabaseServerClient from "@/lib/server";
import { revalidatePath, unstable_noStore } from "next/cache";
import { AdminMedicineTable } from "../table/data";

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
 * * Create new medicine
 * @param form
 * @returns
 */
export async function addAdminMedicine(form: AdminMedicineTable) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  const { name, type, price, exp_date, medicine_photo } = form;

  const validationError = validateRequiredFields({
    name,
    type,
    price,
    exp_date
  });

  if (validationError) {
    console.error("Validation error:", validationError);

    return { data: null, validationError };
  }

  try {
    const { error } = await supabase.from("medicine").insert({
      name,
      type,
      price,
      exp_date,
      medicine_photo
    });

    if (error) {
      console.error("Error inserting data:", error);

      return false;
    }

    return true;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return false;
  }
}

/**
 * * Get medicine by id
 * @param medicine_uuid
 * @returns
 */
export async function getAdminMedicineById(medicine_uuid: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("medicine")
      .select("*")
      .eq("uuid", medicine_uuid)
      .single();

    if (error) {
      console.error("Error fetching data:", error);

      return [];
    }

    return data;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { data: [], error };
  }
}

/**
 * * Update medicine
 * @param form
 * @returns
 */
export async function updateAdminMedicineById(form: AdminMedicineTable) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  const { uuid, name, type, price, exp_date, medicine_photo } = form;

  const validationError = validateRequiredFields({
    uuid,
    name,
    type,
    price,
    exp_date,
    medicine_photo
  });

  if (validationError) {
    console.error("Validation error:", validationError);

    return { data: null, validationError };
  }

  try {
    const { data, error: updateError } = await supabase
      .from("medicine")
      .update({
        name,
        type,
        price,
        exp_date,
        medicine_photo
      })
      .eq("uuid", uuid)
      .single();

    if (updateError) {
      console.error("Error updating data:", updateError);

      return { data: null, updateError };
    }

    return { data, error: null };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { data: null, error };
  }
}

/**
 * * Delete medicine
 * @param medicine_uuid
 * @returns
 */
export async function deleteAdminMedicine(medicine_uuid: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { error } = await supabase
      .from("medicine")
      .delete()
      .eq("uuid", medicine_uuid)
      .single();

    if (error) {
      console.error("Error deleting data:", error);

      return false;
    }

    revalidatePath("/admin/manage/medicine");

    return true;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return false;
  }
}
