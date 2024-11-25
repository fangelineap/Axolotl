"use client";

import { resetPassword } from "@/app/_server-action/auth";
import React, { useState } from "react";
import PasswordInput from "../Axolotl/InputFields/PasswordInput";

const ResetPassword = ({ code }: { code: string }) => {
  const [isSame, setIsSame] = useState<{ error: boolean; message?: string }>();

  const handleReset = async (form: FormData) => {
    if (form.get("password")?.toString()) {
      const passLength = form.get("password")?.toString().length || 0;
      if (passLength < 6) {
        setIsSame({
          error: false,
          message: "Password must be at least 6 characters"
        });
      } else if (
        form.get("password")?.toString() ===
        form.get("confirmPassword")?.toString()
      ) {
        setIsSame({ error: true });
        const error = await resetPassword(
          form.get("password")!.toString(),
          code
        );

        if (error) {
          setIsSame({
            error: false,
            message: error
          });
        }
      } else {
        setIsSame({ error: false, message: "Password does not match" });
      }
    } else {
      setIsSame({ error: false, message: "Password is required" });
    }
  };

  return (
    <div className="w-full lg:max-w-[50%]">
      <div className="rounded-t-xl border border-primary bg-primary py-3">
        <h1 className="text-center text-xl font-semibold text-white md:text-heading-5">
          Reset Password
        </h1>
      </div>
      <div className="rounded-b-xl border border-primary">
        <form action={handleReset}>
          <div className="flex flex-col gap-4 p-5">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-xl font-bold md:text-heading-6">
                Enter your new password
              </h1>
              <p>Enter your new password below to change the old one</p>
            </div>

            <div className="flex w-full flex-col gap-3">
              <PasswordInput
                name="password"
                label="Password"
                placeholder="Enter your password"
                required
              />
              <PasswordInput
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                required
              />

              {isSame?.error != null && (
                <div className="visible rounded-md bg-red p-3">
                  <p className="text-sm font-medium text-white">
                    {isSame.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full rounded-md border border-primary bg-primary px-3 py-2 text-lg font-semibold text-white hover:bg-kalbe-ultraLight hover:text-primary md:w-1/2"
              >
                Reset Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
