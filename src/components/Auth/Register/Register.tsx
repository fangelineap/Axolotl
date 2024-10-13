"use client";

import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import { Checkbox } from "@mui/material";
import { IconSquare } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const RegisterComponent = () => {
  const [role, setRole] = useState<"Caregiver" | "Patient" | "">("");

  return (
    <div className="mx-4 my-12 flex h-full w-auto justify-center md:mx-20 md:my-15">
      <ToastContainer />
      {/* <!-- Account Registration Form --> */}
      <div className="w-full lg:max-w-[50%]">
        <div className="rounded-t-xl border border-primary bg-primary py-3">
          <h1 className="text-center text-xl font-semibold text-white md:text-heading-5">
            Choose Your Role
          </h1>
        </div>
        <div className="rounded-b-xl border border-primary">
          <form action="#">
            <div className="flex flex-col gap-5 p-5">
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold md:text-heading-6">
                  I&apos;m signing up as a
                </h1>
              </div>

              <div className="flex w-full flex-col items-center justify-center gap-3">
                {/* Caregiver */}
                <div
                  onClick={() => {
                    if (role !== "Caregiver") setRole("Caregiver");
                    else setRole("");
                  }}
                  className={`flex w-full items-center justify-between rounded-md border p-4 outline-none transition focus:border-primary ${role === "Caregiver" ? "border-kalbe-light bg-kalbe-ultraLight" : "bg-white"} cursor-pointer disabled:cursor-default`}
                >
                  <div className="flex items-center justify-start gap-4">
                    <Image
                      src="/images/user/caregiver.png"
                      className={`max-h-12 max-w-12 rounded-full border md:max-h-18 md:max-w-18 ${role === "Caregiver" ? "bg-kalbe-veryLight" : ""}`}
                      alt="Caregiver"
                      width={200}
                      height={200}
                    />
                    <div className="flex flex-col">
                      <h2 className="font-medium md:text-xl">Caregiver</h2>
                      <p className="text-sm text-dark-secondary md:text-lg">
                        Be a home care assistant
                      </p>
                    </div>
                  </div>
                  {role === "Caregiver" && (
                    <Image
                      src="/images/icon/icon-done.svg"
                      className="max-h-8 max-w-8 rounded-full border bg-kalbe-veryLight md:max-h-10 md:max-w-10"
                      alt="Checked Logo"
                      width={200}
                      height={200}
                    />
                  )}
                </div>

                {/* Patient */}
                <div
                  onClick={() => {
                    if (role !== "Patient") setRole("Patient");
                    else setRole("");
                  }}
                  className={`flex w-full items-center justify-between rounded-md border p-4 outline-none transition focus:border-primary ${role === "Patient" ? "border-kalbe-light bg-kalbe-ultraLight" : "bg-white"} cursor-pointer disabled:cursor-default`}
                >
                  <div className="flex items-center justify-start gap-4">
                    <Image
                      src="/images/user/patient.png"
                      className={`max-h-12 max-w-12 rounded-full border md:max-h-18 md:max-w-18 ${role === "Patient" ? "bg-kalbe-veryLight" : ""}`}
                      alt="Patient"
                      height={200}
                      width={200}
                    />
                    <div className="flex flex-col">
                      <h2 className="font-medium md:text-xl">Patient</h2>
                      <p className="text-sm text-dark-secondary md:text-lg">
                        Book appointments
                      </p>
                    </div>
                  </div>
                  {role === "Patient" && (
                    <Image
                      src="/images/icon/icon-done.svg"
                      className="max-h-8 max-w-8 rounded-full border bg-kalbe-veryLight md:max-h-10 md:max-w-10"
                      alt="Checked Logo"
                      width={200}
                      height={200}
                    />
                  )}
                </div>
              </div>

              <div className="flex w-3/4 items-center justify-start gap-2">
                <Checkbox
                  id="formCheckbox"
                  required
                  disableRipple
                  className="hover:bg-transparent"
                  icon={<IconSquare stroke={1} />}
                  sx={{
                    color: "#BABABA", // This changes the border color
                    "&.Mui-checked": {
                      color: "#1CBF90" // This changes the checkmark color when checked
                    },
                    padding: 0,
                    borderWidth: "1px !important"
                  }}
                />
                <p className="text-sm md:text-base">
                  I agree to{" "}
                  <span className="text-kalbe-light">
                    privacy policy & terms
                  </span>
                </p>
              </div>

              <Link
                href={{
                  pathname: "/auth/register/createaccount",
                  query: { role: role }
                }}
                className="flex justify-center"
              >
                <AxolotlButton
                  label="Next"
                  variant="primary"
                  type="button"
                  onClick={(e) => {
                    const cbox = document.getElementById(
                      "formCheckbox"
                    ) as HTMLInputElement;

                    if (role == "") {
                      e.preventDefault();
                      toast.warning("Please select a role", {
                        position: "bottom-right"
                      });
                    } else if (!cbox?.checked) {
                      e.preventDefault();
                      toast.warning(
                        "Please accept our terms and conditions before accessing out application",
                        {
                          position: "bottom-right"
                        }
                      );
                    }
                  }}
                  customClasses="md:w-1/2"
                  fontThickness="medium"
                >
                  Next
                </AxolotlButton>
              </Link>
              <p className="text-center text-body-sm">
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
  );
};

export default RegisterComponent;
