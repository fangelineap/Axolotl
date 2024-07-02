"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";

const RegisterInit = () => {
  const [role, setRole] = useState<"Caregiver" | "Patient" | "">("");

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Register Form" />
      <div className="flex justify-center pb-9 pt-3">
        {/* <!-- Sign In Form --> */}
        <div className="w-full min-w-[350px] rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:w-4/5 md:w-2/3 lg:w-5/12">
          <div className="rounded-t-[10px] border-b border-stroke bg-kalbe-light px-6.5 py-4 dark:border-dark-3 ">
            <h3 className="text-center text-xl font-semibold text-white">
              Choose Your Role
            </h3>
          </div>
          <form action="#">
            <div className="p-6.5">
              <div className="flex flex-col items-center justify-center pb-6">
                <h1 className="text-xl font-semibold">I'm signing up as a</h1>
              </div>

              <div
                onClick={() => {
                  if (role !== "Caregiver") setRole("Caregiver");
                  else setRole("");
                }}
                className={`mb-5.5 mt-5 flex w-full items-center justify-between gap-7 rounded-[7px] border-[1.5px] p-4 px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary ${role === "Caregiver" ? "border-kalbe-light bg-green-100" : "border-stroke bg-transparent"} cursor-pointer disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary`}
              >
                <div className="flex items-center justify-start gap-7">
                  <img
                    src="/images/user/caregiver.png"
                    className={`h-[60px] rounded-full border ${role === "Caregiver" ? "bg-kalbe-veryLight" : ""}`}
                    alt="Caregiver"
                  />
                  <div className="flex flex-col">
                    <h2 className="font-semibold">Caregiver</h2>
                    <p className="text-kalbe-gray-secondary">
                      Be a home care assistant
                    </p>
                  </div>
                </div>
                {role === "Caregiver" ? (
                  <img
                    src="/images/icon/icon-done.svg"
                    className="rounded-full border bg-kalbe-veryLight"
                    alt="Checked Logo"
                  />
                ) : (
                  ""
                )}
              </div>

              <div
                onClick={() => {
                  if (role !== "Patient") setRole("Patient");
                  else setRole("");
                }}
                className={`mb-5.5 mt-5 flex w-full items-center justify-between gap-7 rounded-[7px] border-[1.5px] p-4 px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary ${role == "Patient" ? "border-kalbe-light bg-green-100" : "border-stroke bg-transparent"} cursor-pointer disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary`}
              >
                <div className="flex items-center justify-start gap-7">
                  <img
                    src="/images/user/patient.png"
                    className={`h-[60px] rounded-full border ${role === "Patient" ? "bg-kalbe-veryLight" : ""}`}
                    alt="Patient"
                  />
                  <div className="flex flex-col">
                    <h2 className="font-semibold">Patient</h2>
                    <p className="text-kalbe-gray-secondary">
                      Book appointments
                    </p>
                  </div>
                </div>
                {role === "Patient" ? (
                  <img
                    src="/images/icon/icon-done.svg"
                    className="rounded-full border bg-kalbe-veryLight"
                    alt="Checked Logo"
                  />
                ) : (
                  ""
                )}
              </div>

              <div className="mb-5.5 mt-5 flex items-center justify-between">
                <label
                  htmlFor="formCheckbox"
                  className="flex cursor-pointer items-center"
                >
                  <div className="relative pt-0.5">
                    <input
                      type="checkbox"
                      id="formCheckbox"
                      className="taskCheckbox sr-only"
                    />
                    <div className="box mr-3 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-dark-3">
                      <span className="text-white opacity-0">
                        <svg
                          className="fill-current"
                          width="10"
                          height="7"
                          viewBox="0 0 10 7"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51908 0.105322 9.70685 0.292804Z"
                            fill=""
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <p className="text-sm">
                    I agree to{" "}
                    <span className="text-kalbe-light">
                      privacy policy & terms
                    </span>
                  </p>
                </label>
              </div>

              <Link
                href={{ pathname: "/auth/register/createaccount", query: { role: role } }}
                className="flex justify-center"
              >
                <button className="w-1/3 rounded-[7px] bg-primary p-[8px] font-medium text-white hover:bg-opacity-90">
                  Next
                </button>
              </Link>

              <p className="mt-4.5 text-center text-body-sm">
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

export default RegisterInit;
