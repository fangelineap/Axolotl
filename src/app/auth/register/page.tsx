import { getUserFromSession } from "@/lib/server";
import RegisterComponent from "@/components/Auth/Register/Register";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = getGuestMetadata("register");

const RegisterInit = async () => {
  /**
   * * Get user from session
   */
  const { data: user } = await getUserFromSession();

  /**
   * * Redirect User after Sign In based on role
   * @param role
   */
  const handleRedirectByRole = (role: string) => {
    const roleBasedRedirects: Record<string, string> = {
      Patient: "/patient",
      Nurse: "/caregiver",
      Midwife: "/caregiver",
      Admin: "/admin"
    };

    const redirectPath = roleBasedRedirects[role];
    if (redirectPath) {
      redirect(redirectPath);
    }
  };

  if (user) {
    handleRedirectByRole(user.role);
  }

  return (
    <DefaultLayout>
      <RegisterComponent />
    </DefaultLayout>
  );
};

export default RegisterInit;
