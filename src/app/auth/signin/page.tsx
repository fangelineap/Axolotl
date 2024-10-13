import SignInComponent from "@/components/Auth/Signin/SignInComponent";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getUserFromSession } from "@/lib/server";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = getGuestMetadata("sign in");

const SignIn = async () => {
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

    redirect(redirectPath);
  };

  if (user) {
    console.log("user", user);
    handleRedirectByRole(user.role);
  }

  return (
    <DefaultLayout>
      <SignInComponent />
    </DefaultLayout>
  );
};

export default SignIn;
