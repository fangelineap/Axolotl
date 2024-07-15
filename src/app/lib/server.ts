'use server'

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

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
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}

export async function getUserFromSession() {
  const supabase = await createSupabaseServerClient();
  const {data, error} = await supabase.auth.getSession();
  return await supabase.from('users').select().eq('user_id', data.session?.user.id);
}

export async function getCaregiver() {
  const supabase = await createSupabaseServerClient();
  const {data, error} = await supabase.auth.getSession();
  const {data: caregiverData, error: caregiverError} = await supabase.from('caregiver').select().eq('caregiver_id', data.session?.user.id);

  console.log('caregiver data:', caregiverData);
}