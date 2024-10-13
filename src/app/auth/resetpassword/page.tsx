import { resetPassword } from "@/app/_server-action/auth";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { redirect } from "next/navigation";
import PasswordInput from "@/components/Axolotl/InputFields/PasswordInput";
import { Metadata } from "next";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";

export const metadata: Metadata = getGuestMetadata("reset");

const ResetPassword = ({ searchParams }: any) => {
  if (!searchParams.code) {
    redirect("/auth/forgetpassword");
  }

  const handleReset = async (form: FormData) => {
    "use server";

    if (
      form.get("password")?.toString() ===
      form.get("confirmPassword")?.toString()
    ) {
      await resetPassword(form.get("password")!.toString(), searchParams.code);
    }

    redirect("/auth/resetpassword?pass=false");
  };

  return (
    <DefaultLayout>
      <div className="mx-4 my-25 flex h-full w-auto justify-center md:mx-20 md:my-30">
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

                  {searchParams.pass != null && (
                    <div className="visible rounded-md bg-red p-3">
                      <p className="text-sm font-medium text-white">
                        Password does not match
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
      </div>
    </DefaultLayout>
  );
};

export default ResetPassword;
