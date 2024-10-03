"use client";

import { createAdminNewAdmin } from "@/app/(pages)/admin/manage/user/actions";
import EditLabel from "@/components/Axolotl/EditLabel";
import PhoneNumberBox from "@/components/Axolotl/PhoneNumberBox";
import SelectDropdown from "@/components/Axolotl/SelectDropdown";
import CustomDatePicker from "@/components/FormElements/DatePicker/CustomDatePicker";
import { NEW_ADMIN_AUTH_SCHEMA } from "@/types/axolotl";
import { IconAlertTriangle } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminUserValidation } from "./Validation/AdminUserValidation";
import PasswordInput from "@/components/Axolotl/PasswordInput";

function AddAdmin() {
  const router = useRouter();
  const [formData, setFormData] = useState<NEW_ADMIN_AUTH_SCHEMA>({
    id: "",
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    birthdate: new Date(),
    gender: "",
    address: "",
    created_at: new Date(),
    updated_at: new Date(),
    role: "Admin",
    password: ""
  });

  const formatDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(formData.birthdate));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const createAdmin = async (form: FormData) => {
    if (AdminUserValidation(form) == false) return;

    const userData: NEW_ADMIN_AUTH_SCHEMA = {
      id: "",
      user_id: "",
      email: form.get("email")!.toString(),
      password: form.get("password")!.toString(),
      first_name: form.get("first_name")!.toString(),
      last_name: form.get("last_name")!.toString(),
      phone_number: form.get("phone_number")!.toString(),
      address: form.get("address")!.toString(),
      gender: form.get("gender")!.toString(),
      birthdate: new Date(form.get("birthdate")!.toString()),
      created_at: new Date(),
      updated_at: new Date(),
      role: "Admin"
    };

    const { error } = await createAdminNewAdmin(userData);

    if (error !== null && error !== undefined) {
      toast.error("Failed to create admin. Please try again.", {
        position: "bottom-right"
      });

      return;
    }

    toast.success("Admin created successfully.", {
      position: "bottom-right"
    });

    setTimeout(() => {
      router.refresh();
      router.replace("/admin/manage/user");
      router.refresh();
    }, 1500);
  };

  return (
    <>
      <ToastContainer />
      <form action={createAdmin}>
        {/* Title */}
        <h1 className="mb-5 text-heading-3 font-bold md:text-heading-1">
          Add an Admin
        </h1>

        <div className="flex w-full flex-col items-center justify-center gap-5">
          <div className="flex h-full w-full flex-col justify-between gap-5 lg:flex-row">
            {/* Left Section */}
            {/* Profile with Profile Picture Section */}
            <div className="flex w-full flex-col items-center justify-center gap-5 lg:max-w-[25%] lg:flex-col">
              {/* Profile Picture */}
              <div className="flex h-[40%] w-full flex-row items-center justify-center gap-10 rounded-lg border border-primary py-4 md:flex-col md:gap-2">
                <div className="max-h-25 max-w-25 overflow-hidden rounded-full border">
                  <Image
                    src="/images/user/Default Admin Photo.png"
                    alt="Default Admin Profile Photo"
                    width={200}
                    height={200}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-center rounded-md border border-red bg-red-light p-2">
                  <p className="font-bold text-red">Admin</p>
                </div>
              </div>

              {/* Alert */}
              <div className="flex h-[60%] w-full flex-col items-center justify-center gap-2 rounded-lg border border-yellow bg-yellow-light pt-4 text-yellow">
                <IconAlertTriangle size={50} />
                <div className="flex w-full flex-col items-center justify-start gap-2 p-4 pt-0">
                  <h1 className="text-xl font-bold md:text-heading-6">
                    !! WARNING !!
                  </h1>
                  <p>
                    This action should be performed with caution. This is only
                    performed by professionals. Do not try at home
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-primary p-4 lg:max-w-[75%]">
              <div className="flex w-full flex-col">
                {/* Header */}
                <div className="mb-5 flex w-full flex-col gap-3">
                  <h1 className="text-heading-6 font-bold text-primary">
                    Admin Personal Data
                  </h1>
                  <div className="hidden lg:flex lg:items-center">
                    <div className="w-full border-t border-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex w-full flex-col">
                  <div className="flex w-full flex-col md:flex-row md:gap-5">
                    <EditLabel
                      label="First Name"
                      type="text"
                      name="first_name"
                      horizontal={false}
                      placeholder="Enter Admin First Name"
                      required
                      onChange={handleInputChange}
                    />
                    <EditLabel
                      label="Last Name"
                      type="text"
                      name="last_name"
                      horizontal={false}
                      placeholder="Enter Admin Last Name"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex w-full flex-col md:flex-row md:gap-5">
                    <EditLabel
                      label="Email"
                      type="email"
                      name="email"
                      horizontal={false}
                      placeholder="Enter Admin Email"
                      required
                      onChange={handleInputChange}
                    />
                    <PhoneNumberBox
                      placeholder="081XXXXXXXX"
                      disabled={false}
                      name="phone_number"
                      required
                      value={
                        typeof formData.phone_number === "string"
                          ? formData.phone_number
                          : ""
                      }
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        setFormData({
                          ...formData,
                          phone_number: inputValue
                        });
                      }}
                    />
                  </div>
                  <div className="flex w-full flex-col md:flex-row md:gap-5">
                    <CustomDatePicker
                      label="Birthdate"
                      placeholder={formatDate}
                      name="birthdate"
                      required
                      horizontal={false}
                    />
                    <SelectDropdown
                      label="Gender"
                      name="gender"
                      placeholder="Select Gender"
                      required
                      horizontal={false}
                      content={["Male", "Female"]}
                    />
                  </div>
                  <EditLabel
                    label="Address"
                    type="text"
                    name="address"
                    horizontal={false}
                    placeholder="Enter Admin Address"
                    required
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Confidential Zone */}
          <div className="flex w-full flex-col items-center justify-center rounded-lg border border-red bg-red-light p-4">
            {/* Header */}
            <div className="mb-5 flex w-full flex-col gap-3">
              <h1 className="text-heading-6 font-bold text-red">
                Confidential Zone
              </h1>
              <div className="hidden lg:flex lg:items-center">
                <div className="w-full border-t border-red" />
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-5 md:flex-row md:gap-2">
              <PasswordInput
                name="password"
                placeholder="Enter Admin Password"
                label="Password"
                required
              />
              <PasswordInput
                name="confirm_password"
                placeholder="Confirm Admin Password"
                label="Confirm Password"
                required
              />
            </div>
          </div>

          {/* Buttons Group */}
          <div className="mt-5 flex w-full items-center justify-end">
            <div className="flex w-full flex-col items-center justify-center gap-2 md:w-1/4 md:flex-row md:justify-end md:gap-5">
              <button
                className="w-full rounded-md border border-primary bg-primary p-2 font-bold text-white hover:bg-kalbe-ultraLight hover:text-primary"
                type="submit"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default AddAdmin;
