"use client";

import { forgetPassword } from "@/app/_server-action/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomInputGroup from "../../Axolotl/InputFields/CustomInputGroup";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";

const ForgetPasswordComponent = () => {
  const [success, setSuccess] = useState<boolean>();

  const router = useRouter();

  const handleRedirect = async (form: FormData) => {
    const { error } = await forgetPassword(form.get("email")!.toString());

    if (error != null) {
      setSuccess(false);
    } else {
      setSuccess(true);
      router.push("/auth/forgetpassword");
    }
  };

  return (
    <div className="w-full lg:max-w-[50%]">
      <div className="rounded-t-xl border border-primary bg-primary py-3">
        <h1 className="text-center text-xl font-semibold text-white md:text-heading-5">
          Forget Password
        </h1>
      </div>
      <div className="rounded-b-xl border border-primary">
        <form action={handleRedirect}>
          <div className="flex flex-col gap-4 p-5">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-xl font-bold md:text-heading-6">
                Confirm your email!
              </h1>
              <p>We will send an email to reset your password</p>
            </div>

            <div className="flex w-full flex-col gap-3">
              <CustomInputGroup
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email address"
                required
              />

              {success != null && (
                <div
                  className={`${success ? "visible border-primary bg-kalbe-ultraLight" : "visible border-red bg-red-light"} rounded-md border p-3`}
                >
                  <p
                    className={`font-medium ${success ? "text-primary" : "text-red"}`}
                  >
                    {success
                      ? "An email has been sent to your email address. Please check your inbox"
                      : "Your email is not registered, please create an account"}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              {!success && (
                <AxolotlButton
                  isSubmit
                  label="Confirm Email"
                  variant="primary"
                  fontThickness="bold"
                />
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPasswordComponent;
