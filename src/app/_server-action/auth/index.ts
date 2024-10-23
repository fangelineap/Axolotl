/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import createSupabaseServerClient from "@/lib/server";
import { revalidatePath, unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

/**
 * * Sign in with email and password
 * @param email
 * @param password
 * @returns
 */
export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<
  | {
      success: boolean;
      message: string;
      data?: undefined;
    }
  | {
      success: boolean;
      data: {
        userId: string;
      };
      message?: undefined;
    }
> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error("Error while signing in user: ", error);

      return { success: false, message: "Invalid credentials" };
    }

    return { success: true, data: { userId: data.user.id } };
  } catch (error) {
    console.error("An unexpected error occurred: ", error);

    return { success: false, message: "Unexpected error occurred" };
  }
}

/**
 * * Register with email and password
 * @param email
 * @param password
 * @param phoneNumber
 * @param firstName
 * @param lastName
 * @param role
 * @returns
 */
export async function registerWithEmailAndPassword(
  email: string,
  password: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  role: string
) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    console.log("Error while registering user: ", error);

    revalidatePath("/auth/signin?success=false");

    return { data: null, error };
  }

  const userId = data.user?.id;

  if (!userId) {
    throw new Error("User ID not found");
  }

  const userInsertData = {
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
    role: role === "Caregiver" ? undefined : role,
    user_id: userId
  };

  return await supabase.from("users").insert(userInsertData);
}

/**
 * * Forget password
 * @param email
 * @returns
 */
export async function forgetPassword(email: string) {
  const supabase = await createSupabaseServerClient();

  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/auth/resetpassword"
  });
}

/**
 * * Reset password
 * @param password
 * @param code
 */
export async function resetPassword(password: string, code: string) {
  const supabase = await createSupabaseServerClient();

  const { error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (sessionError) {
    console.error("Error exchanging code for session:", sessionError);

    return;
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    console.error("Erorr. Please try again.");

    return;
  }

  redirect("/auth/signin");
}

/**
 * * Handle user logout
 */
export async function logout() {
  unstable_noStore();

  console.log("Logging out...");

  // Sign out locally (One Device)
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut({ scope: "local" });

  console.log("Local signout successful. Redirecting to /auth/signin...");

  redirect("/auth/signin");
}

/**
 * * Get caregiver verification status
 * @param caregiver_id
 * @returns
 */
export async function getCaregiverVerificationStatus(caregiver_id: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data: caregiverData, error: caregiverError } = await supabase
      .from("caregiver")
      .select("*")
      .eq("caregiver_id", caregiver_id)
      .single();

    if (caregiverError) {
      console.error("Error fetching data:", caregiverError.message);

      return null;
    }

    const statusMap: Record<string, string> = {
      Verified: "Verified",
      Rejected: "Rejected",
      Unverified: "Unverified"
    };

    const verificationStatus = statusMap[caregiverData?.status];

    return verificationStatus as "Verified" | "Rejected" | "Unverified";
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return null;
  }
}
