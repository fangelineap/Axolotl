import { getUser, signInWithEmailAndPassword } from "@/app/server-action/auth";
import SignInComponent from "@/components/Auth/Signin/SignInComponent";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getUserFromSession } from "@/lib/server";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = getGuestMetadata("sign in");

const SignIn = async ({ searchParams }: any) => {
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

  /**
   * * Redirect User after Sign In
   * @param form
   */
  const signIn = async (form: FormData) => {
    "use server";

    const email = form.get("email")!.toString();
    const password = form.get("password")!.toString();

    const { data, error } = await signInWithEmailAndPassword(email, password);

    if (error) {
      redirect("/auth/signin?success=false");
    }

    if (data) {
      const { data: userData, error: userError } = await getUser(data.user.id);
      if (userError || !userData) {
        redirect("/auth/signin?success=false");
      }

      handleRedirectByRole(userData.role);
    }
  };

  return (
    <DefaultLayout>
      <SignInComponent signIn={signIn} searchParams={searchParams} />
    </DefaultLayout>
  );
};

export default SignIn;
