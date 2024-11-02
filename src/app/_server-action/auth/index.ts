"use server";

import {
  CaregiverPersonalInformation,
  PatientPersonalInformation,
  UserPersonalInformation
} from "@/app/(pages)/registration/personal-information/type";
import createSupabaseServerClient, { getUserFromSession } from "@/lib/server";
import { USER } from "@/types/AxolotlMainType";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import { adminDeleteUser } from "../admin";
import { getGlobalCaregiverDataByCaregiverOrUserId } from "../global";
import { removeExistingLicenses } from "../storage/client";

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

  const validationError = validateRequiredFields({ email, password });

  if (validationError) {
    console.error("Validation error:", validationError);

    return { success: false, message: validationError.message };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
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

  const validationError = validateRequiredFields({
    email,
    password,
    first_name,
    last_name,
    phone_number,
    role
  });

  if (validationError) {
    console.error("Validation error:", validationError);

    return { success: false, message: validationError.message };
  }

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

      case "Admin":
        return {
          success: true,
          is_complete: true,
          message: "Admin User data is complete"
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
 * * Helper function to update user personal information in users table
 * @param form
 * @param userId
 * @returns
 */
async function saveUserPersonalInformation(
  form: UserPersonalInformation,
  userId: string
) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  // Form Validation
  const { address, gender, birthdate } = form;
  const validationError = validateRequiredFields({
    address,
    gender,
    birthdate
  });

  if (validationError) {
    console.error("Validation error:", validationError);

    return { success: false, message: validationError.message };
  }

  try {
    const { error } = await supabase
      .from("users")
      .update({ ...form, updated_at: new Date() })
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error updating user data:", error);

      return { success: false, message: "Failed to update user data" };
    }

    return { success: true, message: "User data updated successfully" };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { success: false, message: "Unexpected error occurred" };
  }
}

/**
 * * Helper function to save patient personal information in patient table
 * @param form
 * @param userId
 * @param action
 * @returns
 */
async function savePatientPersonalInformation(
  form: PatientPersonalInformation,
  userId: string,
  action: "update" | "create"
) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  // Form Validation
  const {
    blood_type,
    height,
    weight,
    is_smoking,
    allergies,
    current_medication,
    med_freq_times,
    med_freq_day,
    illness_history
  } = form;

  const validationError = validateRequiredFields({
    blood_type,
    height,
    weight,
    is_smoking,
    allergies,
    current_medication,
    med_freq_times,
    med_freq_day,
    illness_history
  });

  if (validationError) {
    console.error("Validation error:", validationError);

    return { success: false, message: validationError.message };
  }

  try {
    switch (action) {
      case "create": {
        const { error } = await supabase.from("patient").insert({
          ...form,
          patient_id: userId
        });

        if (error) {
          console.error("Error saving patient data:", error);

          return { success: false, message: "Failed to save patient data" };
        }

        return { success: true, message: "Patient data saved successfully" };
      }
      case "update": {
        const { error } = await supabase
          .from("patient")
          .update({
            ...form,
            updated_at: new Date()
          })
          .eq("patient_id", userId)
          .single();

        if (error) {
          console.error("Error updating patient data:", error);

          return { success: false, message: "Failed to update patient data" };
        }

        return { success: true, message: "Patient data updated successfully" };
      }
      default:
        return { success: false, message: "Something went wrong" };
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { success: false, message: "Unexpected error occurred" };
  }
}

/**
 * * Helper function to save caregiver personal information in caregiver table
 * @param form
 * @param userId
 * @param action
 * @returns
 */
async function saveCaregiverPersonalInformation(
  form: CaregiverPersonalInformation,
  userId: string,
  action: "update" | "create"
) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  // Form Validation
  const {
    profile_photo,
    employment_type,
    work_experiences,
    workplace,
    cv,
    degree_certificate,
    str,
    sip
  } = form;

  const validationError = validateRequiredFields({
    profile_photo,
    employment_type,
    work_experiences,
    workplace,
    cv,
    degree_certificate,
    str,
    sip
  });

  if (validationError) {
    console.error("Validation error:", validationError);

    return { success: false, message: validationError.message };
  }

  try {
    switch (action) {
      case "create": {
        const { error } = await supabase.from("caregiver").insert({
          ...form,
          caregiver_id: userId
        });

        if (error) {
          console.error("Error saving caregiver data:", error);

          return { success: false, message: "Failed to save caregiver data" };
        }

        return { success: true, message: "Caregiver data saved successfully" };
      }
      case "update": {
        const { data: caregiverData, error: caregiverError } =
          await getGlobalCaregiverDataByCaregiverOrUserId("caregiver", userId);

        if (caregiverError || !caregiverData) {
          console.error(
            "Error fetching current caregiver data:",
            caregiverError
          );

          return {
            success: false,
            message: "Failed to fetch current caregiver data"
          };
        }

        const existingLicenses = {
          cv: caregiverData.cv,
          degree_certificate: caregiverData.degree_certificate,
          str: caregiverData.str,
          sip: caregiverData.sip
        };

        const { error } = await supabase
          .from("caregiver")
          .update({
            ...form,
            updated_at: new Date()
          })
          .eq("caregiver_id", userId)
          .single();

        if (error) {
          console.error("Error updating caregiver data:", error);

          return { success: false, message: "Failed to update caregiver data" };
        }

        await removeExistingLicenses(existingLicenses);

        return {
          success: true,
          message: "Caregiver data updated successfully"
        };
      }
      default:
        return { success: false, message: "Something went wrong" };
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { success: false, message: "Unexpected error occurred" };
  }
}

/**
 * * Save personal information
 * @param form
 * @returns
 */
export async function savePersonalInformation(
  form:
    | UserPersonalInformation
    | PatientPersonalInformation
    | CaregiverPersonalInformation
) {
  unstable_noStore();

  try {
    const { data: currentUserData, error: currentUserError } =
      await getUserFromSession();

    if (currentUserError || !currentUserData) {
      toast.error("Something went wrong. Please try again.", {
        position: "bottom-right"
      });
    }

    if (currentUserData) {
      const userId = currentUserData.id;
      const userRole = currentUserData.role;

      const {
        is_complete: isPersonalDataCompleted,
        success: fetchSuccess,
        message: fetchMessage
      } = await getIncompleteUserPersonalInformation(
        currentUserData.id,
        currentUserData.role
      );

      if (!fetchSuccess) {
        return {
          success: false,
          message: "Failed to fetch user data"
        };
      }

      console.log(form);

      if (
        fetchMessage === "User data is incomplete" &&
        !isPersonalDataCompleted
      ) {
        return await saveUserPersonalInformation(
          form as UserPersonalInformation,
          userId
        );
      }

      switch (userRole) {
        case "Patient": {
          if (!isPersonalDataCompleted) {
            return await savePatientPersonalInformation(
              form as PatientPersonalInformation,
              userId,
              "create"
            );
          }

          return await savePatientPersonalInformation(
            form as PatientPersonalInformation,
            userId,
            "update"
          );
        }

        case "Caregiver":
        case "Nurse":
        case "Midwife": {
          if (!isPersonalDataCompleted) {
            return await saveCaregiverPersonalInformation(
              form as CaregiverPersonalInformation,
              userId,
              "create"
            );
          }

          return await saveCaregiverPersonalInformation(
            form as CaregiverPersonalInformation,
            userId,
            "update"
          );
        }

        default:
          break;
      }
    }

    return {
      success: false,
      message: "Something went wrong"
    };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { success: false, message: "Unexpected error occurred" };
  }
}
