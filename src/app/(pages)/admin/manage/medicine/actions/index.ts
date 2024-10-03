"use server";

import createSupabaseServerClient from "@/app/lib/server";
import { revalidatePath, unstable_noStore } from "next/cache";
import { AdminMedicineTable } from "../table/data";

/**
 * * Create new medicine
 * @param form
 * @returns
 */
export async function addAdminMedicine(form: AdminMedicineTable) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  const { name, type, price, exp_date, medicine_photo } = form;

  const requiredFields = {
    name,
    type,
    price,
    exp_date,
    medicine_photo
  };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      return {
        data: null,
        error: {
          name: `Missing ${key}`,
          message: `${key} is required`
        }
      };
    }
  }

  try {
    const { data } = await supabase.from("medicine").insert({
      name: name,
      type: type,
      price: price,
      exp_date: exp_date,
      medicine_photo: medicine_photo
    });

    return { data, error: null };
  } catch (error) {
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
    const { data } = await supabase.from("medicine").select("*");

    return data as AdminMedicineTable[];
  } catch (error) {
    console.error("Error fetching data:", error);

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
    const { data } = await supabase
      .from("medicine")
      .select("*")
      .eq("uuid", uuid)
      .single();

    return data;
  } catch (error) {
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

  const requiredFields = {
    uuid,
    name,
    type,
    price,
    exp_date
  };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      return {
        data: null,
        error: {
          name: `Missing ${key}`,
          message: `${key} is required`
        }
      };
    }
  }

  try {
    const { data, error } = await supabase
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

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
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
    const { data } = await supabase
      .from("medicine")
      .delete()
      .eq("uuid", uuid)
      .single();

    revalidatePath("/admin/manage/medicine");

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
