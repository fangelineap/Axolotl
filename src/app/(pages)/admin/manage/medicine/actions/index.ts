"use server";

import createSupabaseServerClient from "@/app/lib/server";
import { unstable_noStore } from "next/cache";
import { AdminMedicineTable } from "../table/data";

export async function addAdminMedicine() {}

export async function getAdminMedicine() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("medicine").select("*");

  if (error) {
    console.error("Error fetching data:", error);
    return { data: [], error };
  }

  return { data, error: null };
}

export async function getAdminMedicineById(uuid: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("medicine")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) {
    console.error("Error fetching data:", error);
    return { data: [], error };
  }

  return data;
}

export async function updateAdminMedicineById(form: AdminMedicineTable) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();
  const { uuid, name, type, price, exp_date, medicine_photo } = form;

  if (!uuid || !name || !type || !price || !exp_date) {
    return {
      data: null,
      error: { name: "Invalid input data", message: "Invalid input data" },
    };
  }

  try {
    const { data, error } = await supabase
      .from("medicine")
      .update({
        name: name,
        type: type,
        price: price,
        exp_date: exp_date,
        medicine_photo: medicine_photo,
      })
      .eq("uuid", form.uuid)
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: null, error: { name: "UpdateError", message: error } };
  }
}

export async function deleteAdminMedicine() {}
