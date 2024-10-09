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
    const { data, error: insertError } = await supabase
      .from("medicine")
      .insert({
        name: name,
        type: type,
        price: price,
        exp_date: exp_date,
        medicine_photo: medicine_photo
      });

    if (insertError) {
      console.error("Error inserting data:", insertError);

      return { data: null, error: insertError };
    }

    return { data, error: null };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { data: null, error };
  }
}

/**
 * * Get all medicine
 * @returns
 */
export async function getAdminMedicine() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.from("medicine").select("*");

    if (error) {
      console.error("Error fetching data:", error);

      return [];
    }

    return data as AdminMedicineTable[];
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return [];
  }
}

/**
 * * Get medicine by id
 * @param uuid
 * @returns
 */
export async function getAdminMedicineById(uuid: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("medicine")
      .select("*")
      .eq("uuid", uuid)
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
 *
 * TODO: Add uuid to Parameter
 *
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
        name: name,
        type: type,
        price: price,
        exp_date: exp_date,
        medicine_photo: medicine_photo
      })
      .eq("uuid", form.uuid)
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
 * @param uuid
 * @returns
 */
export async function deleteAdminMedicine(uuid: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("medicine")
      .delete()
      .eq("uuid", uuid)
      .single();

    if (error) {
      console.error("Error deleting data:", error);

      return { data: null, error };
    }

    revalidatePath("/admin/manage/medicine");

    return { data, error: null };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { data: null, error };
  }
}
