"use client";

import {
  updateAdminCaregiverData,
  updateAdminUserData
} from "@/app/(pages)/admin/manage/user/actions";
import {
  AdminUpdateAdminDetails,
  AdminUpdateCaregiverDetails,
  AdminUserTable
} from "@/app/(pages)/admin/manage/user/table/data";
import {
  getClientPublicStorageURL,
  removeLicenses,
  uploadLicenses
} from "@/app/_server-action/storage";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import CustomDivider from "@/components/Axolotl/CustomDivider";
import DisabledCustomInputGroup from "@/components/Axolotl/DisabledInputFields/DisabledCustomInputGroup";
import DisabledPhoneNumberBox from "@/components/Axolotl/DisabledInputFields/DisabledPhoneNumberBox";
import CustomInputGroup from "@/components/Axolotl/InputFields/CustomInputGroup";
import FileInput from "@/components/Axolotl/InputFields/FileInput";
import PhoneNumberBox from "@/components/Axolotl/InputFields/PhoneNumberBox";
import SelectDropdown from "@/components/Axolotl/SelectDropdown";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { AdminUpdateUserValidation } from "./Validation/AdminUpdateUserValidation";

interface UpdateUserProps {
  user: AdminUserTable;
  totalOrder: number;
}

interface Licenses {
  cv: File | null;
  degree_certificate: File | null;
  str: File | null;
  sip: File | null;
}

function UpdateUser({ user, totalOrder }: UpdateUserProps) {
  /**
   * * States & Initial Variables
   */
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const user_full_name = user.first_name + " " + user.last_name;

  const caregiverProfilePhoto = getClientPublicStorageURL(
    "profile_photo",
    user.caregiver?.profile_photo
  );

  const [formData, setFormData] = useState({
    user_id: user.user_id,
    email: user.email,
    phone_number: user.phone_number,
    address: user.address,
    employment_type: user.caregiver?.employment_type,
    work_experiences: user.caregiver?.work_experiences,
    workplace: user.caregiver?.workplace
  });

  const [licenses, setLicenses] = useState<Licenses>({
    cv: null,
    degree_certificate: null,
    str: null,
    sip: null
  });

  const existingLicenses = {
    cv: user.caregiver?.cv,
    degree_certificate: user.caregiver?.degree_certificate,
    str: user.caregiver?.str,
    sip: user.caregiver?.sip
  };

  /**
   * * Date & Time Formatters
   */
  const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  /**
   * * Helper function to format dates
   * @param date
   * @param formatter
   * @returns
   */
  const formatDate = (date: Date, formatter: Intl.DateTimeFormat) =>
    formatter.format(new Date(date));

  /**
   * * Formatted Dates
   */
  const formattedReviewDate = user.caregiver?.reviewed_at
    ? formatDate(user.caregiver?.reviewed_at, dateTimeFormatter)
    : "-";

  const formattedBirthDate = formatDate(user.birthdate, dateFormatter);
  const formattedStartDate = user.caregiver?.schedule_start_date
    ? formatDate(user.caregiver?.schedule_start_date, dateFormatter)
    : "-";

  const formattedEndDate = user.caregiver?.schedule_end_date
    ? formatDate(user.caregiver?.schedule_end_date, dateFormatter)
    : "-";

  const formattedStartTime = user.caregiver?.schedule_start_date
    ? formatDate(user.caregiver?.schedule_start_date, timeFormatter)
    : "-";

  const formattedEndTime = user.caregiver?.schedule_end_date
    ? formatDate(user.caregiver?.schedule_end_date, timeFormatter)
    : "-";

  /**
   * * Handle Image Load
   */
  const handleImageLoad = () => setImageLoaded(true);

  /**
   * * Rendering Permission
   */
  const isCaregiverUnverifiedOrRejected =
    ["Nurse", "Midwife"].includes(user.role) &&
    ["Unverified", "Rejected"].includes(user.caregiver?.status || "");

  const isRestrictedUser =
    isCaregiverUnverifiedOrRejected || user.role === "Patient" ? true : false;

  /**
   * * Handle Input Change
   * @param e
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  /**
   * * Extract Caregiver Licenses State
   */
  const { cv, degree_certificate, str, sip } = licenses;

  /**
   * * Helper function to remove existing licenses if all update is successful
   */
  const removeExistingLicenses = async () => {
    const licensesToBeRemoved = Object.entries(existingLicenses).map(
      ([key, value]) => ({
        storage: key,
        fileValue: value
      })
    );

    await removeLicenses(licensesToBeRemoved);
  };

  /**
   * * Save Updated User
   * @param form
   * @returns
   */
  const saveUpdatedUser = async (form: FormData) => {
    // ! VALIDATION
    if (user.role === "Patient") return;

    if (user.role === "Admin" && !AdminUpdateUserValidation(form, "Admin"))
      return;

    const allLicenses = {
      cv,
      degree_certificate,
      str,
      sip
    };

    if (
      ["Nurse", "Midwife"].includes(user.role) &&
      !AdminUpdateUserValidation(form, "Caregiver", allLicenses)
    )
      return;

    // ! UPDATE CAREGIVER
    if (["Nurse", "Midwife"].includes(user.role)) {
      const files = [
        {
          key: "cv",
          fileValue: cv as File,
          userValue: user.caregiver.cv,
          pathName: "pathCV",
          errorMsg: "CV"
        },
        {
          key: "degree_certificate",
          fileValue: degree_certificate as File,
          userValue: user.caregiver.degree_certificate,
          pathName: "pathDegreeCertificate",
          errorMsg: "Degree Certificate"
        },
        {
          key: "str",
          fileValue: str as File,
          userValue: user.caregiver.str,
          pathName: "pathSTR",
          errorMsg: "STR"
        },
        {
          key: "sip",
          fileValue: sip as File,
          userValue: user.caregiver.sip,
          pathName: "pathSIP",
          errorMsg: "SIP"
        }
      ];

      const paths = await uploadLicenses(files);
      if (!paths) return;

      const { pathCV, pathDegreeCertificate, pathSTR, pathSIP } = paths;

      if (!pathCV && !pathDegreeCertificate && !pathSTR && !pathSIP) return;

      const updatedCaregiverData: AdminUpdateCaregiverDetails = {
        user_id: user.user_id,
        employment_type: form.get("employment_type") as
          | "Full-time"
          | "Part-time",
        work_experiences: form.get("work_experiences") as unknown as number,
        workplace: form.get("workplace")?.toString() || "",
        cv: pathCV!,
        degree_certificate: pathDegreeCertificate!,
        str: pathSTR!,
        sip: pathSIP!
      };

      const { success } = await updateAdminCaregiverData(updatedCaregiverData);

      if (!success) {
        await removeLicenses(
          Object.values(paths)
            .filter((path) => path !== undefined)
            .map((path) => ({ storage: path!, fileValue: path }))
        );

        toast.error("Failed to update caregiver. Please try again.", {
          position: "bottom-right"
        });

        return;
      }

      await removeExistingLicenses();

      toast.success("Caregiver updated successfully", {
        position: "bottom-right"
      });

      setTimeout(() => {
        router.refresh();
        router.push(`/admin/manage/user/${user.user_id}`);
        router.refresh();
      }, 250);
    }

    // ! UPDATE ADMIN
    if (user.role === "Admin") {
      const updatedAdminData: AdminUpdateAdminDetails = {
        user_id: user.user_id,
        email: form.get("email")?.toString() || "",
        phone_number: form.get("phone_number")?.toString() || "",
        address: form.get("address")?.toString() || ""
      };

      const { success } = await updateAdminUserData(updatedAdminData);

      if (!success) {
        toast.error("Failed to update admin. Please try again.", {
          position: "bottom-right"
        });

        return;
      }

      toast.success("Admin updated successfully", {
        position: "bottom-right"
      });

      setTimeout(() => {
        router.refresh();
        router.push(`/admin/manage/user/${user.user_id}`);
        router.refresh();
      }, 250);
    }
  };

  return (
    <>
      <ToastContainer />
      <form action={saveUpdatedUser}>
        {/* Title */}
        <h1 className="mb-5 text-heading-1 font-bold">
          Editing User Profile...
        </h1>
        {/* Container */}
        <div className={`flex w-full flex-col justify-between gap-5`}>
          {/* ROLE BASED RENDERING */}
          {["Nurse", "Midwife", "Patient"].includes(user.role) ? (
            <>
              {/* Top Section */}
              {/* Profile with Profile Picture Section */}
              <div className="flex w-full flex-col items-center justify-start gap-5 md:flex-row">
                {!imageLoaded && (
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    width={160}
                    height={160}
                    className="rounded-full object-cover"
                  />
                )}
                <div
                  className={`h-40 w-40 overflow-hidden rounded-full border ${imageLoaded ? "" : "hidden"}`}
                >
                  {["Nurse", "Midwife"].includes(user.role) ? (
                    <Image
                      src={caregiverProfilePhoto}
                      alt="User Profile Photo"
                      width={200}
                      height={200}
                      priority
                      className={`h-full w-full object-cover ${imageLoaded ? "" : "hidden"}`}
                      onLoad={handleImageLoad}
                    />
                  ) : (
                    user.role === "Patient" && (
                      <Image
                        src="/images/user/Default Patient Photo.png"
                        alt="Default Patient Profile Photo"
                        width={200}
                        height={200}
                        priority
                        className={`h-full w-full object-cover ${imageLoaded ? "" : "hidden"}`}
                        onLoad={handleImageLoad}
                      />
                    )
                  )}
                </div>

                {/* User Basic Data */}
                <div className="mb-4 flex flex-col items-center justify-center gap-2 lg:mb-0 lg:items-start">
                  <h1 className="text-xl font-bold">{user_full_name}</h1>
                  {/* User Role */}
                  <div className="flex flex-col gap-2">
                    {/* Caregiver Role */}
                    {["Nurse", "Midwife"].includes(user.role) && (
                      <div className="flex items-center justify-center gap-2">
                        <div>
                          {user.role === "Nurse" ? (
                            <div className="flex items-center justify-center rounded-md border border-yellow bg-yellow-light p-2">
                              <p className="font-bold text-yellow">
                                {user.role}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center rounded-md border border-blue bg-blue-light p-2">
                              <p className="font-bold text-blue">{user.role}</p>
                            </div>
                          )}
                        </div>
                        {/* If User is Caregiver, then display verification status */}
                        <div>
                          {user.caregiver.status === "Unverified" ? (
                            <div className="rounded-md border border-blue bg-blue-light p-2">
                              <p className="font-bold text-blue">
                                Awaiting for verification
                              </p>
                            </div>
                          ) : user.caregiver.status === "Verified" ? (
                            <div className="rounded-md border border-primary bg-kalbe-ultraLight p-2">
                              <p className="font-bold text-primary">
                                Verified on:{" "}
                                <span className="font-medium">
                                  {" "}
                                  {formattedReviewDate}
                                </span>
                              </p>
                            </div>
                          ) : (
                            <div className="rounded-md border border-red bg-red-light p-2">
                              <p className="font-bold text-red">
                                Rejected on:{" "}
                                <span className="font-medium">
                                  {" "}
                                  {formattedReviewDate}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {/* Patient Role */}
                    {user.role === "Patient" && (
                      <div className="bg-primary-ultraLight flex items-center justify-center rounded-md border border-primary p-2">
                        <p className="font-bold text-primary">{user.role}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              {isRestrictedUser ? (
                // ! RESTRICTED
                <div className="flex w-full flex-col items-center justify-center gap-5">
                  <div className="flex w-full flex-col items-center justify-center gap-5 rounded-lg border border-red bg-red-light p-4 text-red">
                    <h1 className="text-heading-3 font-medium">
                      You can&apos;t edit this user
                    </h1>
                    <div className="flex w-full flex-col gap-2 text-lg">
                      <p>
                        An Admin does not have access to edit a user with the
                        following criteria:
                      </p>
                      <ul className="list-disc pl-5">
                        <li>
                          If the user is a{" "}
                          <span className="font-medium">
                            Rejected/Unverified Caregiver
                          </span>{" "}
                        </li>
                        <li>
                          If the user is a{" "}
                          <span className="font-medium">Patient</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2 rounded-md border border-primary bg-kalbe-ultraLight p-4 text-lg text-primary">
                    <p>
                      An Admin only has access to edit a user with the following
                      criteria and purpose:
                    </p>
                    <ul className="list-disc pl-5">
                      <li>
                        If the user is a{" "}
                        <span className="font-medium">Verified Caregiver</span>
                      </li>
                      <li>
                        If the Caregiver needs to update their{" "}
                        <span className="font-medium">
                          Working Experience Data
                        </span>{" "}
                        and <span className="font-medium">Licenses</span>
                      </li>
                    </ul>
                    <div className="flex w-full flex-col gap-2 rounded border border-yellow bg-yellow-light p-4 text-lg text-yellow">
                      <p className="font-medium">How about deleting a User?</p>
                      <p>
                        Yeah, you can delete the user, no problem. <br /> Just
                        make sure your supervisor&apos;s cool with it—unless
                        you&apos;re curious what unemployment feels like 🤣
                      </p>
                    </div>
                  </div>
                  <AxolotlButton
                    label="Go Back"
                    variant="secondary"
                    fontThickness="bold"
                    customClasses="text-lg w-full md:w-fit"
                    customWidth
                    onClick={() =>
                      router.replace(`/admin/manage/user/${user.user_id}`)
                    }
                  />
                </div>
              ) : (
                // ! ALLOWED
                <div className="flex w-full flex-col gap-5 md:flex-row lg:justify-between">
                  {/* First Column */}
                  <div className="flex w-full flex-col gap-4">
                    {/* User Personal Data */}
                    <div className="flex w-full flex-col">
                      <h1 className="mb-3 text-heading-6 font-bold text-primary">
                        User Personal Data
                      </h1>
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <DisabledCustomInputGroup
                          label="First Name"
                          value={user.first_name}
                          horizontal={false}
                          type="text"
                        />
                        <DisabledCustomInputGroup
                          label="Last Name"
                          value={user.last_name}
                          horizontal={false}
                          type="text"
                        />
                      </div>
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <DisabledCustomInputGroup
                          label="Email"
                          value={user.email}
                          horizontal={false}
                          type="text"
                        />
                        <DisabledPhoneNumberBox
                          placeholder="081XXXXXXXX"
                          value={Number(user.phone_number)}
                        />
                      </div>
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <DisabledCustomInputGroup
                          label="Birthdate"
                          value={formattedBirthDate}
                          horizontal={false}
                          type="text"
                        />
                        <DisabledCustomInputGroup
                          label="Gender"
                          value={user.gender ? user.gender : "-"}
                          horizontal={false}
                          type="text"
                        />
                      </div>
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <DisabledCustomInputGroup
                          label="Address"
                          value={user.address ? user.address : "-"}
                          horizontal={false}
                          type="text"
                        />
                      </div>
                    </div>

                    {/* CAREGIVER - Working Preferences */}
                    <div className="flex w-full flex-col">
                      <h1 className="mb-3 text-heading-6 font-bold text-primary">
                        User Working Preferences
                      </h1>
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <DisabledCustomInputGroup
                          label="Start Day"
                          value={formattedStartDate}
                          horizontal={false}
                          type="text"
                        />
                        <DisabledCustomInputGroup
                          label="End Day"
                          value={formattedEndDate}
                          horizontal={false}
                          type="text"
                        />
                      </div>
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <DisabledCustomInputGroup
                          label="Start Time"
                          value={formattedStartTime}
                          horizontal={false}
                          type="text"
                        />
                        <DisabledCustomInputGroup
                          label="End Time"
                          value={formattedEndTime}
                          horizontal={false}
                          type="text"
                        />
                      </div>
                    </div>
                  </div>

                  <CustomDivider />

                  {/* Second Column */}
                  <div className="flex w-full flex-col gap-4">
                    {/* CAREGIVER - Rating */}
                    <div className="flex w-full flex-col">
                      <h1 className="mb-3 text-heading-6 font-bold text-primary">
                        User Rating
                      </h1>
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <DisabledCustomInputGroup
                          label="Total Order"
                          horizontal={false}
                          type="text"
                          value={String(totalOrder)}
                        />
                        <DisabledCustomInputGroup
                          label="Rating"
                          type="text"
                          horizontal={false}
                          isRating
                          value={String(user.caregiver.rate) || "-"}
                        />
                      </div>
                    </div>

                    {/* CAREGIVER - Working Experiences */}
                    <div className="flex w-full flex-col">
                      <h1 className="mb-3 text-heading-6 font-bold text-primary">
                        User Working Experiences
                      </h1>
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <SelectDropdown
                          value={formData.employment_type}
                          name="employment_type"
                          placeholder="Employment Type"
                          horizontal={false}
                          content={["Full-time", "Part-time"]}
                          label="Employment Type"
                          required={true}
                        />
                        <CustomInputGroup
                          label="Work Experiences"
                          value={formData.work_experiences.toString()}
                          horizontal={false}
                          type="text"
                          isUnit={true}
                          unit="year"
                          name="work_experiences"
                          placeholder="Work Experiences"
                          required
                          onChange={handleInputChange}
                        />
                      </div>
                      <CustomInputGroup
                        label="Workplace"
                        value={formData.workplace}
                        horizontal={false}
                        type="text"
                        name="workplace"
                        placeholder="Workplace"
                        required
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* CAREGIVER Licenses */}
                    <div className="flex w-full flex-col">
                      <h1 className="mb-3 text-heading-6 font-bold text-primary">
                        User Licenses
                      </h1>
                      <div className="grid grid-cols-2 gap-5">
                        <FileInput
                          name="cv"
                          accept={[
                            "image/png",
                            "image/jpeg",
                            "image/jpg",
                            "application/pdf"
                          ]}
                          label="Curriculum Vitae"
                          onFileSelect={(file) =>
                            setLicenses((prev) => ({ ...prev, cv: file }))
                          }
                        />
                        <FileInput
                          name="degree_certificate"
                          accept={[
                            "image/png",
                            "image/jpeg",
                            "image/jpg",
                            "application/pdf"
                          ]}
                          label="Degree Certificate"
                          onFileSelect={(file) =>
                            setLicenses((prev) => ({
                              ...prev,
                              degree_certificate: file
                            }))
                          }
                        />
                        <FileInput
                          name="str"
                          accept={[
                            "image/png",
                            "image/jpeg",
                            "image/jpg",
                            "application/pdf"
                          ]}
                          label="Surat Tanda Registrasi (STR)"
                          onFileSelect={(file) =>
                            setLicenses((prev) => ({ ...prev, str: file }))
                          }
                        />
                        <FileInput
                          name="sip"
                          accept={[
                            "image/png",
                            "image/jpeg",
                            "image/jpg",
                            "application/pdf"
                          ]}
                          label="Surat Izin Praktik (SIP)"
                          onFileSelect={(file) =>
                            setLicenses((prev) => ({ ...prev, sip: file }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            user.role === "Admin" && (
              <div className="flex h-full w-full flex-col items-start justify-between gap-5 md:flex-row">
                {/* Left Section */}
                {/* Profile with Profile Picture Section */}
                <div className="flex h-full w-full flex-row items-center justify-center gap-10 rounded-md border border-primary py-4 md:max-w-[25%] md:flex-col md:gap-2">
                  {!imageLoaded && (
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={160}
                      height={160}
                      className="rounded-full object-cover"
                    />
                  )}
                  <div
                    className={`h-40 w-40 overflow-hidden rounded-full border ${imageLoaded ? "" : "hidden"}`}
                  >
                    <Image
                      src="/images/user/Default Admin Photo.png"
                      alt="Default Admin Profile Photo"
                      width={200}
                      height={200}
                      priority
                      className={`h-full w-full object-cover ${imageLoaded ? "" : "hidden"}`}
                      onLoad={handleImageLoad}
                    />
                  </div>

                  {/* User Basic Data */}
                  <div className="flex flex-col items-start justify-start gap-2 md:items-center md:justify-center">
                    <h1 className="text-xl font-bold">{user_full_name}</h1>
                    <div className="flex items-center justify-center rounded-md border border-red bg-red-light p-2">
                      <p className="font-bold text-red">{user.role}</p>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-primary p-4 md:min-w-[75%]">
                  <div className="flex w-full flex-col">
                    {/* Header */}
                    <div className="mb-3 flex w-full flex-col gap-3">
                      <h1 className="text-heading-6 font-bold text-primary">
                        Admin Personal Data
                      </h1>
                      <CustomDivider horizontal />
                    </div>

                    {/* Content */}
                    <div className="flex w-full flex-col">
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <DisabledCustomInputGroup
                          label="First Name"
                          value={user.first_name}
                          horizontal={false}
                          type="text"
                        />
                        <DisabledCustomInputGroup
                          label="Last Name"
                          value={user.last_name}
                          horizontal={false}
                          type="text"
                        />
                      </div>
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <CustomInputGroup
                          label="Email"
                          type="email"
                          name="email"
                          horizontal={false}
                          placeholder="Enter Admin Email"
                          value={formData.email}
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
                        <DisabledCustomInputGroup
                          label="Birthdate"
                          value={formattedBirthDate}
                          horizontal={false}
                          type="text"
                        />
                        <DisabledCustomInputGroup
                          label="Gender"
                          value={user.gender ? user.gender : "-"}
                          horizontal={false}
                          type="text"
                        />
                      </div>
                      <CustomInputGroup
                        label="Address"
                        type="text"
                        name="address"
                        horizontal={false}
                        placeholder="Enter Admin Address"
                        value={formData.address}
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Button Group */}
        {!isRestrictedUser && (
          <div className="mt-5 flex w-full items-center justify-end">
            <div className="flex w-full items-center justify-end gap-5 md:w-1/2">
              <div className="flex w-full flex-col items-center justify-center gap-5 md:flex-row md:justify-end">
                <Link href={`/admin/manage/user/${user.user_id}`}>
                  <AxolotlButton
                    label="Cancel"
                    variant="dangerOutlined"
                    fontThickness="bold"
                    customClasses="text-lg w-full md:w-fit"
                    customWidth
                  />
                </Link>
                <AxolotlButton
                  label="Save Changes"
                  variant="primary"
                  fontThickness="bold"
                  customClasses="text-lg w-full md:w-fit"
                  customWidth
                  isSubmit
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
}

export default UpdateUser;
