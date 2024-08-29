"use server";

import createSupabaseServerClient from "@/app/lib/server";
import { revalidatePath, unstable_noStore } from "next/cache";
import { AdminMedicineTable } from '../table/data';
import { createBrowserClient } from "@supabase/ssr";

export async function addAdminMedicine(form: AdminMedicineTable) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();
  const { name, type, price, exp_date, medicine_photo } = form;

  if (!name || !type || !price || !exp_date) {
    return {
      data: null,
      error: { name: "Invalid input data", message: "Invalid input data" },
    };
  }

  try {
    const { data, error } = await supabase.from("medicine").insert({
      name: name,
      type: type,
      price: price,
      exp_date: exp_date,
      medicine_photo: medicine_photo,
    });

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        name: "InsertError",
        message: "Failed to insert data into the database.",
      },
    };
  }
}

export async function getAdminMedicine() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.from("medicine").select("*");

    if (error) {
      console.error("Error fetching medicine data:", error.message);
      return [];
    }

    return data as AdminMedicineTable[];
  } catch (error) {
    return [];
  }
}

export async function getAdminMedicineById(uuid: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("medicine")
      .select("*")
      .eq("uuid", uuid)
      .single();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);

    return { data: [], error };
  }
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

export async function deleteAdminMedicine(uuid: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("medicine")
      .delete()
      .eq("uuid", uuid)
      .single();

    revalidatePath("/admin/manage/medicine");

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching data:", error);

    return { data: null, error: { name: "DeleteError", message: error } };
  }
}
