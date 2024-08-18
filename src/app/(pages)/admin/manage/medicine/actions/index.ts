"use server";

import createSupabaseServerClient from "@/app/lib/server";
import { unstable_noStore } from "next/cache";

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

export async function updateAdminMedicine() {}

export async function deleteAdminMedicine() {}
