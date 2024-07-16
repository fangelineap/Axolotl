import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import PasswordInput from "../component/PasswordInput";
import { resetPassword } from "@/app/server-action/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ResetPassword = ({ searchParams }: any) => {
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
      <Breadcrumb pageName="Reset Password Form" />
      <div className="flex justify-center pb-9 pt-3">
        <div className="w-full min-w-[350px] rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:w-4/5 md:w-2/3 lg:w-5/12">
          <div className="rounded-t-[10px] border-b border-stroke bg-kalbe-light px-6.5 py-4 dark:border-dark-3 ">
            <h3 className="text-center text-xl font-semibold text-white">
              Reset Password
            </h3>
          </div>
          <form action={handleReset}>
            <div className="p-6.5">
              <div className="flex flex-col items-center justify-center pb-6">
                <h1 className="text-xl font-bold">Enter your new password</h1>
                <h3>Enter your new password below to change the old one</h3>
              </div>

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
                <div className="visible mb-4.5 rounded-md bg-red-400 p-3">
                  <p className="ml-3 text-sm font-medium text-white">
                    Password does not match
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                <button className="flex w-1/3 justify-center rounded-[7px] bg-primary p-[8px] font-medium text-white hover:bg-opacity-90">
                  Reset Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ResetPassword;
