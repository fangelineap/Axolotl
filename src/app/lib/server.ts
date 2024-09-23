"use server";

import { createServerClient } from "@supabase/ssr";
import { unstable_noStore } from "next/cache";
import { cookies } from "next/headers";
import { getUserAuthSchema } from "../server-action/admin/SupaAdmin";
import { USER_DETAILS_AUTH_SCHEMA } from "@/types/axolotl";
import { redirect } from "next/navigation";

export default async function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        }
      }
    }
  );
}

export async function getUserFromSession() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();
  const { data: sessionData, error } = await supabase.auth.getUser();

  // Return early if there's no session or an error
  if (error || !sessionData?.user) {
    return { data: null, error: error || new Error("No session found") };
  }

  const userId = sessionData.user.id;

  // Fetch the user from the database
  const { data: user, error: userError } = await supabase
    .from("users")
    .select()
    .eq("user_id", userId)
    .single();

  return {
    data: user ? user : null,
    error: userError || null
  };
}

export async function getUserDataFromSession() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();
  const { data: sessionData, error } = await supabase.auth.getUser();

  if (error || !sessionData?.user) {
    return { data: null, error: error || new Error("No session found") };
  }

  const userId = sessionData.user.id;

  const { data: user, error: userError } = await supabase
    .from("users")
    .select()
    .eq("user_id", userId)
    .single();

  if (userError) {
    console.error("Error fetching data:", userError.message);
    return null;
  }

  const authSchema = await getUserAuthSchema(userId);

  if (user.role === "Patient") {
    const { data: patient, error: patientError } = await supabase
      .from("users")
      .select("*, patient(*)")
      .eq("user_id", userId)
      .single();

    if (patientError) {
      console.error("Error fetching data:", patientError.message);
      return null;
    }

    const patientData: USER_DETAILS_AUTH_SCHEMA = {
      ...patient,
      email: authSchema?.email,
      patient: patient?.patient.length === 0 ? null : patient?.patient[0]
    };

    return patientData;
  }

  if (user.role === "Nurse" || user.role === "Midwife") {
    const { data: caregiver, error: caregiverError } = await supabase
      .from("users")
      .select("*, caregiver(*)")
      .eq("user_id", userId)
      .single();

    if (caregiverError) {
      console.error("Error fetching data:", caregiverError.message);
      return null;
    }

    const caregiverData: USER_DETAILS_AUTH_SCHEMA = {
      ...caregiver,
      email: authSchema?.email,
      caregiver:
        caregiver?.caregiver.length === 0 ? null : caregiver?.caregiver[0]
    };

    return caregiverData;
  }

  if (user.role === "Admin") {
    const adminData: USER_DETAILS_AUTH_SCHEMA = {
      ...user,
      email: authSchema?.email
    };

    return adminData;
  }
}

export async function logout() {
  unstable_noStore();

  // Sign out locally (One Device)
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut({ scope: "local" });

  // Clear session cookies server-side
  await supabase.auth.setSession({
    access_token: "",
    refresh_token: ""
  });

  redirect("/auth/signin");
}

export async function getCaregiverById(id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("users")
    .select("*, caregiver(*)")
    .eq("user_id", id);

  if (error) {
    return null;
  }

  return data;
}
