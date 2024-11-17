"use client";

import { registerWithEmailAndPassword } from "@/app/_server-action/auth";
import AuthStepper from "@/components/Auth/AuthStepper";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import CustomInputGroup from "@/components/Axolotl/InputFields/CustomInputGroup";
import PasswordInput from "@/components/Axolotl/InputFields/PasswordInput";
import PhoneNumberBox from "@/components/Axolotl/InputFields/PhoneNumberBox";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateAccountValidation } from "./Validation/CreateAccountValidation";

export const metadata: Metadata = getGuestMetadata("create account");

const CreateAccountComponent = ({ searchParams }: any) => {
  const router = useRouter();
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const createUser = async (form: FormData) => {
    if (CreateAccountValidation(form, searchParams.role) === false) return;

    const userData = {
      email: form.get("email")!.toString(),
      password: form.get("password")!.toString(),
      first_name: form.get("first_name")!.toString(),
      last_name: form.get("last_name")!.toString(),
      phone_number: form.get("phone_number")!.toString(),
      role: searchParams.role
    };

    const { success, message } = await registerWithEmailAndPassword(userData);

    if (!success && message) {
      setShowError(true);
      setErrorMessage(message);

      setTimeout(() => {
        setShowError(false);
        setErrorMessage("");
      }, 15000);

      return;
    }

    router.push(
      `/registration/personal-information?role=${searchParams.role}&signed-in=${success}`
    );
  };

  return (
    <>
      <AuthStepper currentStep={2} role={searchParams.role} />

      <div className="flex justify-center pb-9 pt-3">
        {/* Create Account Form*/}
        <div className="w-full min-w-[350px] shadow-1 sm:w-4/5 md:w-2/3 lg:w-5/12">
          {/* Header */}
          <div className="rounded-t-[10px] bg-kalbe-light px-6.5 py-4 dark:border-dark-3 ">
            <h3 className="text-center text-xl font-semibold text-white lg:text-heading-5">
              Create Your Account
            </h3>
          </div>

          {/* Content */}
          <div className="rounded-b-xl border border-primary">
            <form action={createUser}>
              <div className="p-6.5">
                <div className="mb-5 w-full text-center">
                  <h1 className="text-xl font-bold lg:text-heading-6">
                    Please enter your details
                  </h1>
                  <h3>Fill this form below to create your account</h3>
                </div>
                <div className="flex flex-col xl:flex-row xl:gap-3">
                  <CustomInputGroup
                    placeholder="Enter your first name"
                    label="First Name"
                    name="first_name"
                    type="text"
                    horizontal={false}
                    required
                  />
                  <CustomInputGroup
                    placeholder="Enter your last name"
                    label="Last Name"
                    name="last_name"
                    type="text"
                    horizontal={false}
                    required
                  />
                </div>
                <div className="flex flex-col xl:flex-row xl:gap-3">
                  <CustomInputGroup
                    placeholder="Enter your email"
                    label="Email"
                    type="email"
                    name="email"
                    horizontal={false}
                    required
                  />
                  <PhoneNumberBox
                    placeholder="8XXXXXXXXX"
                    name="phone_number"
                    required
                  />
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                  <PasswordInput
                    name="password"
                    placeholder="Enter your password"
                    label="Password"
                    required
                  />
                  <PasswordInput
                    name="confirm_password"
                    placeholder="Confirm your password"
                    label="Confirm Password"
                    required
                  />
                </div>
                <div className="mt-5 flex flex-col justify-center gap-3">
                  {showError && (
                    <div className="visible rounded-md bg-red p-3">
                      <p className="ml-3 text-sm font-medium text-white">
                        {errorMessage}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-center gap-3">
                    <Link href="/auth/register" className="w-full">
                      <AxolotlButton
                        variant="secondary"
                        label="Go Back"
                        fontThickness="bold"
                      />
                    </Link>
                    <AxolotlButton
                      variant="primary"
                      label="Next"
                      isSubmit
                      fontThickness="bold"
                    />
                  </div>
                </div>
                <p className="mt-3 text-center text-body-sm">
                  Already have an account?{" "}
                  <span>
                    <Link
                      href="/auth/signin"
                      className="text-primary hover:underline"
                    >
                      Sign in instead
                    </Link>
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAccountComponent;
