"use server";

import createSupabaseServerClient from "@/lib/server";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import { adminDeleteUser } from "../admin";
import { USER } from "../../../types/AxolotlMainType";

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
 * @param first_name
 * @param last_name
 * @param phone_number
 * @param role
 * @returns
 */
export async function registerWithEmailAndPassword(userData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
}): Promise<
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

  const { email, password, first_name, last_name, phone_number, role } =
    userData;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError || !authData.user) {
      console.error("Error while registering user: ", authError);

      if (
        authError?.status === 422 ||
        authError?.code === "user_already_exists"
      ) {
        return {
          success: false,
          message:
            "You again? Looks like you've already got an account. Don't be shy, just sign in 🙃"
        };
      }

      return { success: false, message: "Failed to register user" };
    }

    const userId = authData.user?.id;

    const newUserData = {
      first_name,
      last_name,
      phone_number,
      role: role,
      user_id: userId
    };

    const { error: userError } = await supabase
      .from("users")
      .insert(newUserData);

    if (userError) {
      console.error("Error while registering user: ", userError);

      await adminDeleteUser(userId);

      return { success: false, message: "Failed to register user" };
    }

    return { success: true, data: { userId: userId } };
  } catch (error) {
    console.error("An unexpected error occurred: ", error);

    return { success: false, message: "Unexpected error occurred" };
  }
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
 * * Helper function to check User Personal Information Data based on their Roles
 * @param userId
 * @param userRole
 * @returns
 */
async function checkUserRoleData(userId: string, userRole: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    switch (userRole) {
      case "Patient":
        const { data: patientData } = await supabase
          .from("patient")
          .select("*")
          .eq("patient_id", userId)
          .or(
            "and(blood_type.is.null, height.is.null, weight.is.null, is_smoking.is.null, med_freq_times.is.null, med_freq_day.is.null, illness_history.is.null)"
          )
          .single();

        if (patientData) {
          console.error("Patient data is incomplete:", patientData);

          return {
            success: true,
            is_complete: false,
            message: "Patient data is incomplete"
          };
        }

        return {
          success: true,
          is_complete: true,
          message: "Patient User data is complete"
        };

      case "Nurse":
      case "Midwife":
        const { data: caregiverData } = await supabase
          .from("caregiver")
          .select("*")
          .eq("caregiver_id", userId)
          .or(
            "profile_photo.is.null,employment_type.is.null,workplace.is.null,work_experiences.is.null,cv.is.null,degree_certificate.is.null,str.is.null,sip.is.null,status.eq.Unverified"
          )
          .single();

        if (caregiverData) {
          console.error("Caregiver data is incomplete:", caregiverData);

          return {
            success: true,
            is_complete: false,
            message: "Caregiver data is incomplete"
          };
        }

        return {
          success: true,
          is_complete: true,
          message: "Caregiver User data is complete"
        };

      default:
        return {
          success: false,
          is_complete: false,
          message: "Something went wrong"
        };
    }
  } catch (error) {
    console.error(error);

    return {
      success: false,
      is_complete: false,
      message: "Unexpected error occurred"
    };
  }
}

/**
 * * Get incomplete user personal information
 * @param userId
 * @returns
 */
export async function getIncompleteUserPersonalInformation(
  userId: string,
  userRole: string
) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .or("address.is.null, gender.is.null, birthdate.is.null")
      .single();

    const userData = data as unknown as USER;

    if (userData) {
      return {
        success: true,
        is_complete: false,
        message: "User data is incomplete"
      };
    }

    const checkUserRoleInformationData = await checkUserRoleData(
      userId,
      userRole
    );

    if (
      checkUserRoleInformationData?.success &&
      !checkUserRoleInformationData?.is_complete
    ) {
      return {
        success: true,
        is_complete: false,
        message: checkUserRoleInformationData?.message
      };
    }

    return {
      success: true,
      is_complete: true,
      message: "User data and Personal Information data is completed"
    };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return {
      success: false,
      is_complete: false,
      message: "Unexpected error occurred"
    };
  }
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
