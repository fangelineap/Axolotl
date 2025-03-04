"use client";

import { signInWithEmailAndPassword } from "@/app/_server-action/auth";
import { getGlobalUserRole } from "@/app/_server-action/global";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import CustomInputGroup from "@/components/Axolotl/InputFields/CustomInputGroup";
import PasswordInput from "@/components/Axolotl/InputFields/PasswordInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignInValidation } from "./Validation/SignInValidation";

function SignInComponent() {
  const router = useRouter();
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  /**
   * * Handle client-side redirect by user role
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
    router.replace(redirectPath);
  };

  /**
   * * Redirect User after Sign In
   * @param form
   */
  const signIn = async (form: FormData) => {
    if (SignInValidation(form) == false) return;

    const email = form.get("email")!.toString();
    const password = form.get("password")!.toString();

    const response = await signInWithEmailAndPassword(email, password);

    if (!response.success) {
      setShowError(true);
      setErrorMessage(
        "Invalid credentials! Did your cat walk over the keyboard again? 🐾💻"
      );

      setTimeout(() => {
        setShowError(false);
        setErrorMessage("");
      }, 15000);

      return;
    }

    const userRole = await getGlobalUserRole(response.data?.userId!);

    if (!userRole) {
      setShowError(true);
      setErrorMessage(
        "Uh-oh! 👀 Looks like someone's trying to break the Axolotl... but not on my watch! 👮🏻‍♂️"
      );

      return;
    }

    setShowError(false);
    setErrorMessage("");

    handleRedirectByRole(userRole);
  };

  return (
    <div className="mx-4 my-15 flex h-full w-auto justify-center md:m-20">
      {/* <!-- Sign In Form --> */}
      <div className="w-full lg:max-w-[50%]">
        <div className="rounded-t-xl border border-primary bg-primary py-3">
          <h1 className="text-center text-xl font-semibold text-white md:text-heading-5">
            Sign In
          </h1>
        </div>
        <div className="rounded-b-xl border border-primary">
          <form action={signIn}>
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold md:text-heading-6">
                  Welcome back!
                </h1>
                <p>Sign in to your account below</p>
              </div>

              <div className="flex w-full flex-col gap-3">
                <CustomInputGroup
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  name="password"
                  required
                />

                {showError && (
                  <div className="visible rounded-md bg-red p-3">
                    <p className="text-sm font-medium text-white">
                      {errorMessage}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex w-full justify-end">
                <Link
                  href="/auth/forgetpassword"
                  className="text-body-sm text-primary hover:underline md:text-dark-secondary md:hover:text-primary"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="flex justify-center">
                <AxolotlButton
                  isSubmit
                  label="Sign In"
                  variant="primary"
                  roundType="medium"
                  fontThickness="medium"
                  customClasses="text-lg md:w-1/2"
                />
              </div>

              <p className="text-center text-body-sm">
                Don&apos;t have an account?{" "}
                <span>
                  <Link
                    href="/auth/register"
                    className="text-primary hover:underline"
                  >
                    Sign Up Here
                  </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInComponent;
