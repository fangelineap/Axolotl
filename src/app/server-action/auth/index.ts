"use server";

import createSupabaseServerClient from "@/app/lib/server";
import { redirect } from "next/navigation";

export async function signInWithEmailAndPassword(
  email: string,
  password: string,
) {
  const supabase = await createSupabaseServerClient();

  return supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
}

export async function registerWithEmailAndPassword(
  email: string,
  password: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  role: string,
) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.log("Error while registering user: ", error);
    return { data, error };
  }

  if (role === "Caregiver") {
    return await supabase.from("users").insert({
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      user_id: data.user?.id,
    });
  }

  return await supabase.from("users").insert({
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
    role: role,
    user_id: data.user?.id,
  });
}

export async function forgetPassword(email: string) {
  const supabase = await createSupabaseServerClient();

  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/auth/resetpassword',
  });
}

export async function resetPassword(password: string, code:string) {
  const supabase = await createSupabaseServerClient();

  const {data: sessionData, error:sessionError} = await supabase.auth.exchangeCodeForSession(code);
  const {data, error} = await supabase.auth.updateUser({password: password});

  if(error) {
    alert('Erorr. Please try again.')
  }

  redirect('/auth/signin');
}

export async function getCaregiver(caregiverId: any) {
  const supabase = await createSupabaseServerClient();
  return (await supabase.from('caregiver').select('*').eq('caregiver_id', caregiverId).limit(1));
}

export async function getUser(user_id: string) {
  const supabase = await createSupabaseServerClient();
  return await supabase.from('users').select().eq('user_id', user_id);
}