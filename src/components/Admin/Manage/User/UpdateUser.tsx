"use client";

import { AdminUserTable } from "@/app/(pages)/admin/manage/user/table/data";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import DisabledCustomInputGroup from "@/components/Axolotl/DisabledInputFields/DisabledCustomInputGroup";
import DisabledPhoneNumberBox from "@/components/Axolotl/DisabledInputFields/DisabledPhoneNumberBox";
import CustomInputGroup from "@/components/Axolotl/InputFields/CustomInputGroup";
import FileInput from "@/components/Axolotl/InputFields/FileInput";
import { createClient } from "@/lib/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { uuidv7 } from "uuidv7";
import { AdminUpdateUserValidation } from "./Validation/AdminUpdateUserValidation";
import { Skeleton } from "@mui/material";
import PhoneNumberBox from "@/components/Axolotl/InputFields/PhoneNumberBox";
import CustomDatePicker from "@/components/Axolotl/InputFields/CustomDatePicker";
import SelectDropdown from "@/components/Axolotl/SelectDropdown";

interface UpdateUserProps {
  user: AdminUserTable;
  totalOrder: number;
}

function UpdateUser({ user, totalOrder }: UpdateUserProps) {
  /**
   * * States & Initial Variables
   */
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const user_full_name = user.first_name + " " + user.last_name;

  const [formData, setFormData] = useState({
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
    address: user.address,
    gender: user.gender,
    birthdate: user.birthdate,
    caregiver: {
      employment_type: user.caregiver?.employment_type,
      work_experiences: user.caregiver?.work_experiences,
      workplace: user.caregiver?.workplace,
      cv: user.caregiver?.cv,
      degree_certificate: user.caregiver?.degree_certificate,
      str: user.caregiver?.str,
      sip: user.caregiver?.sip
    },
    patient: {
      blood_type: user.patient?.blood_type,
      height: user.patient?.height,
      weight: user.patient?.weight,
      is_smoking: user.patient?.is_smoking
    }
  });

  const [caregiverLicenses, setCaregiverLicenses] = useState({
    cv: user.caregiver?.cv,
    degree_certificate: user.caregiver?.degree_certificate,
    str: user.caregiver?.str,
    sip: user.caregiver?.sip
  });

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
  const { cv, degree_certificate, str, sip } = caregiverLicenses;

  /**
   * * Handle Caregiver Licenses Change
   * @param patial
   * @returns
   */
  const setCaregiverLicensesHandler = (
    patial: Partial<typeof caregiverLicenses>
  ) => setCaregiverLicenses((prev) => ({ ...prev, ...patial }));

  /**
   * * Upload File to Supabase
   * @param storage
   * @param fileName
   * @param file
   * @returns
   */
  async function uploadAdminToStorage(
    storage: string,
    fileName: string,
    file: string
  ) {
    const supabase = createClient();

    const { data: userData } = await supabase.auth.getSession();

    if (userData.session?.user) {
      const { data, error } = await supabase.storage
        .from(storage)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (error) {
        return undefined;
      }

      return data?.path;
    }
  }

  /**
   * * Cancel Upload by Removing Uploaded File from Supabase
   * @param path
   * @returns
   */
  async function cancelUploadAdminToStorage(path: string) {
    try {
      const supabase = createClient();

      const { error } = await supabase.storage.from("medicine").remove([path]);

      if (error) {
        return error;
      }

      return true;
    } catch (error) {
      return error;
    }
  }

  /**
   * * Handle File Upload
   * @param medicinePhoto
   * @returns
   */
  const handleFileUpload = async (medicinePhoto: File) => {
    try {
      const name = uuidv7();
      const extension = medicinePhoto.name.split(".")[1];
      const fileName = `${name}_${Date.now()}.${extension}`;

      await uploadAdminToStorage(
        "medicine",
        fileName,
        medicinePhoto as unknown as string
      );

      return fileName;
    } catch (error) {
      toast.error("Error uploading file: " + error, {
        position: "bottom-right"
      });

      return undefined;
    }
  };

  const saveUpdatedUser = async (form: FormData) => {
    if (
      user.role === "Admin" &&
      AdminUpdateUserValidation(form, "Admin") === false
    )
      return;

    if (
      ["Nurse", "Midwife"].includes(user.role) &&
      AdminUpdateUserValidation(form, "Caregiver") === false
    )
      return;
  };

  return (
    <>
      <ToastContainer />
      {/* Title */}
      <h1 className="mb-5 text-heading-1 font-bold">User Profile</h1>

      {/* Container */}
      <div className={`flex w-full flex-col justify-between gap-5`}>
        {/* Profile with Profile Picture Section */}
        {["Nurse", "Midwife", "Patient"].includes(user.role) ? (
          <>
            {/* Top Section */}
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
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_photo/${encodeURIComponent(user.caregiver.profile_photo)}`}
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
                      src="/images/user/patient.png"
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
                            <p className="font-bold text-yellow">{user.role}</p>
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
                      {user.role === "Patient" && (
                        <DisabledCustomInputGroup
                          label="Blood Type"
                          value={
                            user.patient.blood_type
                              ? user.patient.blood_type
                              : "-"
                          }
                          horizontal={false}
                          type="text"
                        />
                      )}
                    </div>
                    {user.role === "Patient" && (
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <DisabledCustomInputGroup
                          label="Height and Weight"
                          horizontal={false}
                          type="text"
                          isMultipleUnit
                          unit="cm"
                          value={
                            user.patient.height
                              ? String(user.patient.height)
                              : "-"
                          }
                          secondUnit="kg"
                          secondValue={
                            user.patient.weight
                              ? String(user.patient.weight)
                              : "-"
                          }
                        />
                        <DisabledCustomInputGroup
                          label="Smoker Status"
                          value={user.patient.is_smoking ? "Yes" : "No"}
                          horizontal={false}
                          type="text"
                        />
                      </div>
                    )}
                  </div>

                  {/* CAREGIVER - Working Preferences */}
                  {["Nurse", "Midwife"].includes(user.role) && (
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
                  )}
                </div>

                {/* Center Divider */}
                <div className="hidden lg:flex lg:items-center">
                  <div className="h-full border-l border-primary"></div>
                </div>

                {/* Second Column */}
                <div className="flex w-full flex-col gap-4">
                  {/* CAREGIVER */}
                  {["Nurse", "Midwife"].includes(user.role) && (
                    <>
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

                      {/* CAREGIVER Working Experiences */}
                      <div className="flex w-full flex-col">
                        <h1 className="mb-3 text-heading-6 font-bold text-primary">
                          User Working Experiences
                        </h1>
                        <div className="flex w-full flex-col md:flex-row md:gap-5">
                          <CustomInputGroup
                            label="Employment Type"
                            value={user.caregiver.employment_type}
                            horizontal={false}
                            type="text"
                            name="employment_type"
                            placeholder="Employment Type"
                            required
                            onChange={handleInputChange}
                          />
                          <CustomInputGroup
                            label="Work Experiences"
                            value={user.caregiver.work_experiences.toString()}
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
                          value={user.caregiver.workplace}
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
                        <div className="grid grid-cols-2 gap-x-5">
                          <FileInput
                            label="CV"
                            onFileSelect={() => {}}
                            name="cv"
                          />
                          <FileInput
                            label="Degree Certificate"
                            onFileSelect={() => {}}
                            name="degree_certificate"
                          />
                          <FileInput
                            label="STR"
                            onFileSelect={() => {}}
                            name="str"
                          />
                          <FileInput
                            label="SIP"
                            onFileSelect={() => {}}
                            name="sip"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* PATIENT */}
                  {user.role === "Patient" && (
                    <div className="flex w-full flex-col">
                      <h1 className="mb-3 text-heading-6 font-bold text-primary">
                        User Past Medical History
                      </h1>

                      <DisabledCustomInputGroup
                        label="Allergies"
                        value={
                          user.patient.allergies ? user.patient.allergies : "-"
                        }
                        horizontal={false}
                        type="text"
                      />
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <DisabledCustomInputGroup
                          label="Current Medication"
                          value={
                            user.patient.current_medication
                              ? user.patient.current_medication
                              : "-"
                          }
                          horizontal={false}
                          type="text"
                        />
                        <DisabledCustomInputGroup
                          label="Medication Frequency"
                          horizontal={false}
                          type="text"
                          isMultipleUnit
                          unit="qty"
                          value={
                            user.patient.med_freq_times
                              ? String(user.patient.med_freq_times)
                              : "-"
                          }
                          secondUnit="/day"
                          secondValue={
                            user.patient.med_freq_day
                              ? String(user.patient.med_freq_day)
                              : "-"
                          }
                        />
                      </div>
                      <DisabledCustomInputGroup
                        label="Illness History"
                        horizontal={false}
                        type="text"
                        isTextArea
                        value={user.patient.illness_history}
                      />
                    </div>
                  )}
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
                    <div className="hidden lg:flex lg:items-center">
                      <div className="w-full border-t border-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex w-full flex-col">
                    <div className="flex w-full flex-col md:flex-row md:gap-5">
                      <CustomInputGroup
                        label="First Name"
                        type="text"
                        name="first_name"
                        horizontal={false}
                        placeholder="Enter Admin First Name"
                        required
                        onChange={handleInputChange}
                      />
                      <CustomInputGroup
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
                      <CustomInputGroup
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
                        placeholder={formattedBirthDate}
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
                    <CustomInputGroup
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
          )
        )}
      </div>

      {/* Button Group */}
      {!isRestrictedUser && (
        <div className="mt-5 flex w-full items-center justify-end">
          <div className="flex w-full items-center justify-end gap-5 md:w-1/2">
            <div className="flex w-full flex-col items-center justify-center gap-5 md:flex-row md:justify-end">
              <AxolotlButton
                label="Cancel"
                variant="dangerOutlined"
                fontThickness="bold"
                customClasses="text-lg w-full md:w-fit"
                customWidth
                onClick={() => router.back()}
              />
              <AxolotlButton
                label="Save Changes"
                variant="primary"
                fontThickness="bold"
                customClasses="text-lg w-full md:w-fit"
                customWidth
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UpdateUser;
