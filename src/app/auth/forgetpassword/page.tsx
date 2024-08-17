import { forgetPassword } from "@/app/server-action/auth";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { redirect } from "next/navigation";
import React from "react";

const ForgetPassword = ({ searchParams }: any) => {
  const handleRedirect = async (form: FormData) => {
    "use server";

    const { data, error } = await forgetPassword(form.get("email")!.toString());
    if (error != null) {
      redirect("/auth/forgetpassword/?success=false");
    } else {
      redirect("/auth/forgetpassword/?success=true");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Forget Password Form" />
      <div className="flex justify-center pb-9 pt-3">
        <div className="w-full min-w-[350px] rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:w-4/5 md:w-2/3 lg:w-5/12">
          <div className="rounded-t-[10px] border-b border-stroke bg-kalbe-light px-6.5 py-4 dark:border-dark-3 ">
            <h3 className="text-center text-xl font-semibold text-white">
              Forget Password
            </h3>
          </div>
          <form action={handleRedirect}>
            <div className="p-6.5">
              <div className="flex flex-col items-center justify-center pb-6">
                <h1 className="text-xl font-bold">Confirm your email!</h1>
                <h3>We will send an email to reset your password</h3>
              </div>

              <InputGroup
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email address"
                customClasses="mb-4.5"
                required
              />

              {searchParams.success != null && (
                <div
                  className={`hidden ${searchParams.success == "true" ? "visible bg-kalbe-veryLight" : "visible bg-red-400"} mb-4.5 rounded-md p-3`}
                >
                  <p className="ml-3 text-sm font-medium text-white">
                    {searchParams.success == "true"
                      ? "Check your email"
                      : "Enter a valid email address"}
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="flex w-1/3 justify-center rounded-[7px] bg-primary p-[8px] font-medium text-white hover:bg-opacity-90"
                >
                  Confirm Email
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ForgetPassword;
