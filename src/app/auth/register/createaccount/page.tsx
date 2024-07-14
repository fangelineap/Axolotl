import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import React from "react";
import PasswordInput from "../../component/PasswordInput";
import { registerWithEmailAndPassword } from "@/app/server-action/auth";
import { redirect } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const CreateAccount = ({ searchParams }: any) => {
  console.log("Role ", searchParams.role);

  const toPersonalInformation = async (form: FormData) => {
    "use server"
    if (form.get("password") === form.get("confirmPassword")) {
      const {data, error} = await registerWithEmailAndPassword(
        form.get("email")!.toString(),
        form.get("password")!.toString(),
        form.get("phoneNumber")!.toString(),
        form.get("firstName")!.toString(),
        form.get("lastName")!.toString(),
        searchParams.role
      );

      if(error) {
        console.log('Errorrrrrrrrrrrrrrrrrrrr ', error);
      }
      else {
        redirect(`/auth/register/createaccount/personalinformation?role=${searchParams.role}`);
      }
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create Account Form" />
      {/* Stepper */}
      <div className="mb-3.5 flex items-center justify-center">
        <div className="grid min-w-[350px] grid-cols-2 gap-4 gap-x-10 lg:flex lg:gap-7">
          <div className="flex items-center justify-start gap-1">
            <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
              1
            </h2>
            <h2>Choose Role</h2>
          </div>
          <div className="flex items-center justify-start gap-1">
            <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
              2
            </h2>
            <h2>Create Account</h2>
          </div>
          <div className="flex items-center justify-start gap-1">
            <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-gray-secondary font-medium text-white">
              3
            </h2>
            <h2>Personal Infomation</h2>
          </div>
          {searchParams.role === "Caregiver" && (
            <div className="flex items-center justify-start gap-1">
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-gray-secondary font-medium text-white">
                4
              </h2>
              <h2>Review</h2>
            </div>
          )}
          <div className="flex items-center justify-start gap-1">
            <h2
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-gray-secondary font-medium text-white`}
              // ${searchParams.role === "Caregiver" && window.screen.width > 1000 && "ml-2"}
            >
              {searchParams.role === "Caregiver" ? 5 : 4}
            </h2>
            <h2>Finish</h2>
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-9 pt-3">
        {/* Create Account Form*/}
        <div className="w-full min-w-[350px] rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:w-4/5 md:w-2/3 lg:w-5/12">
          <div className="rounded-t-[10px] border-b border-stroke bg-kalbe-light px-6.5 py-4 dark:border-dark-3 ">
            <h3 className="text-center text-xl font-semibold text-white">
              Create Your Account
            </h3>
          </div>
          <form action={toPersonalInformation}>
            <div className="p-6.5">
              <div className="flex flex-col items-center justify-center pb-6">
                <h1 className="text-xl font-bold">Please enter your details</h1>
                <h3>Fill this form below to create your account</h3>
              </div>

              <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                <InputGroup
                  name="firstName"
                  label="First name"
                  type="text"
                  placeholder="Enter your first name"
                  customClasses="w-full xl:w-1/2"
                  required
                />

                <InputGroup
                  name="lastName"
                  label="Last name"
                  type="text"
                  placeholder="Enter your last name"
                  customClasses="w-full xl:w-1/2"
                  required
                />
              </div>

              <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                <InputGroup
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  customClasses="w-full xl:w-1/2"
                  required
                />

                <div className="w-full xl:w-1/2">
                  <label
                    className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                    htmlFor="phoneNumber"
                  >
                    Phone Number<span className="ml-1 text-red">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute rounded-bl-[7px] rounded-tl-[7px] bg-slate-300 p-[12.5px]">
                      +62
                    </span>
                    <input
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent py-3 pl-16 pr-4.5 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="8XXXXXXXXXX"
                    />
                  </div>
                </div>
              </div>

              <PasswordInput name="password" label="Password" />
              <PasswordInput name="confirmPassword" label="Confirm Password" />

              <div className="mt-5.5 flex justify-center gap-3">
                <button className="w-1/4 rounded-[7px] bg-kalbe-gray-secondary p-[8px] font-medium text-white hover:bg-opacity-90">
                  Back
                </button>
                <button
                  type="submit"
                  className="w-1/4 rounded-[7px] bg-primary p-[8px] font-medium text-white hover:bg-opacity-90"
                >
                  Next
                </button>
              </div>

              <p className="mt-3 text-center text-body-sm">
                Already have an account?{" "}
                <span>
                  <Link href="signup" className="text-primary hover:underline">
                    Sign in instead
                  </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateAccount;
