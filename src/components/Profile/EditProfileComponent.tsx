"use client";

import { AdminUserTable } from "@/app/(pages)/admin/manage/user/table/data";
import {
  updateBasicProfileDetails,
  updateRoleProfileDetails
} from "@/app/_server-action/global/profile";
import { getClientPublicStorageURL } from "@/app/_server-action/global/storage/client";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import CustomDivider from "@/components/Axolotl/CustomDivider";
import DisabledCustomInputGroup from "@/components/Axolotl/DisabledInputFields/DisabledCustomInputGroup";
import {
  BASIC_PROFILE_DETAILS,
  CAREGIVER_PROFILE_DETAILS,
  PATIENT_PROFILE_DETAILS
} from "@/types/AxolotlMultipleTypes";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import CheckboxSmoker from "../Axolotl/Checkboxes/CheckboxSmoker";
import CustomInputGroup from "../Axolotl/InputFields/CustomInputGroup";
import CustomTimePicker from "../Axolotl/InputFields/CustomTimePicker";
import PhoneNumberBox from "../Axolotl/InputFields/PhoneNumberBox";
import SelectDropdown from "../Axolotl/SelectDropdown";
import { UpdateProfileValidation } from "./Validation/UpdateProfileValidation";
import { globalFormatDate } from "@/utils/Formatters/GlobalFormatters";

interface EditProfileComponentProps {
  user: AdminUserTable;
}

function EditProfileComponent({ user }: EditProfileComponentProps) {
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
    email: user.email,
    phone_number: user.phone_number,
    address: user.address,

    // Patient Specific
    weight: user.patient?.weight,
    height: user.patient?.height,
    is_smoking: user.patient?.is_smoking,
    allergies: user.patient?.allergies,
    current_medication: user.patient?.current_medication,
    med_freq_times: user.patient?.med_freq_times,
    med_freq_day: user.patient?.med_freq_day,
    illness_history: user.patient?.illness_history,

    // Caregiver Specific
    start_day: user.caregiver?.schedule_start_day,
    end_day: user.caregiver?.schedule_end_day,
    start_time: user.caregiver?.schedule_start_time,
    end_time: user.caregiver?.schedule_end_time
  });

  /**
   * * Formatted Dates
   */
  const formattedReviewDate = user.caregiver?.reviewed_at
    ? globalFormatDate(user.caregiver?.reviewed_at, "dateTime")
    : "-";

  const formattedBirthDate = globalFormatDate(user.birthdate, "longDate");

  /**
   * * Handle Image Load
   */
  const handleImageLoad = () => setImageLoaded(true);

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
   * * Save Profile
   * @param form
   * @returns
   */
  const saveProfile = async (form: FormData) => {
    // ! VALIDATION
    if (!UpdateProfileValidation(form, "Basic")) return;

    if (user.role === "Patient" && !UpdateProfileValidation(form, "Patient"))
      return;

    if (
      ["Nurse", "Midwife"].includes(user.role) &&
      !UpdateProfileValidation(form, "Caregiver")
    )
      return;

    // ! UPDATE BASIC PROFILE
    const basicProfileDetails: BASIC_PROFILE_DETAILS = {
      email: form.get("email")?.toString() || "",
      phone_number: form.get("phone_number")?.toString() || "",
      address: form.get("address")?.toString() || ""
    };

    const { success: isBasicProfileUpdated } =
      await updateBasicProfileDetails(basicProfileDetails);

    if (!isBasicProfileUpdated) {
      toast.error("Error saving basic profile. Please try again.", {
        position: "bottom-right"
      });

      return;
    }

    if (user.role === "Admin") {
      toast.success("Admin profile updated successfully.", {
        position: "bottom-right"
      });

      setTimeout(() => {
        router.refresh();
        router.replace(`/profile?user=${user.user_id}&role=${user.role}`);
        router.refresh();
      }, 250);

      return;
    }

    toast.info("Basic profile updated successfully.", {
      position: "bottom-right"
    });

    // ! UPDATE PATIENT
    if (user.role === "Patient") {
      const patientProfileDetails: PATIENT_PROFILE_DETAILS = {
        height: form.get("height") as unknown as number,
        weight: form.get("weight") as unknown as number,
        is_smoking: form.get("is_smoking") === "Yes" ? true : false,
        allergies: form.get("allergies")?.toString() || null,
        current_medication: form.get("current_medication")?.toString() || null,
        med_freq_times: form.get("med_freq_times")
          ? (form.get("med_freq_times") as unknown as number)
          : null,
        med_freq_day: form.get("med_freq_day")
          ? (form.get("med_freq_day") as unknown as number)
          : null,
        illness_history: form.get("illness_history")?.toString() || ""
      };

      const { success } = await updateRoleProfileDetails(patientProfileDetails);

      if (!success) {
        toast.error("Error saving patient profile. Please try again.", {
          position: "bottom-right"
        });

        return;
      }

      toast.success("Patient profile updated successfully.", {
        position: "bottom-right"
      });

      setTimeout(() => {
        router.refresh();
        router.replace(`/profile?user=${user.user_id}&role=${user.role}`);
        router.refresh();
      }, 250);
    }

    // ! UPDATE CAREGIVER
    if (["Nurse", "Midwife"].includes(user.role)) {
      const caregiverProfileDetails: CAREGIVER_PROFILE_DETAILS = {
        start_day: form.get("start_day")?.toString() as
          | "Monday"
          | "Tuesday"
          | "Wednesday"
          | "Thursday"
          | "Friday"
          | "Saturday"
          | "Sunday",
        end_day: form.get("end_day")?.toString() as
          | "Monday"
          | "Tuesday"
          | "Wednesday"
          | "Thursday"
          | "Friday"
          | "Saturday"
          | "Sunday",
        start_time: form.get("start_time")?.toString() || "",
        end_time: form.get("end_time")?.toString() || ""
      };

      const { success } = await updateRoleProfileDetails(
        caregiverProfileDetails
      );

      if (!success) {
        toast.error("Error saving caregiver profile. Please try again.", {
          position: "bottom-right"
        });

        return;
      }

      toast.success("Caregiver profile updated successfully.", {
        position: "bottom-right"
      });

      setTimeout(() => {
        router.refresh();
        router.replace(`/profile?user=${user.user_id}&role=${user.role}`);
        router.refresh();
      }, 250);
    }
  };

  return (
    <form action={saveProfile}>
      {/* Title */}
      <h1 className="mb-5 text-heading-1 font-bold">Editing Your Profile...</h1>

      {/* Container */}
      <div className={`flex w-full flex-col justify-between gap-5`}>
        {/* ROLE BASED RENDERING */}
        {["Nurse", "Midwife", "Patient"].includes(user.role) ? (
          <>
            {/* Top Section */}
            {/* Profile with Profile Picture Section */}
            <div className="flex w-full flex-col items-center justify-start gap-5 lg:flex-row">
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
                            <p className="font-bold text-yellow">{user.role}</p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center rounded-md border border-blue bg-blue-light p-2">
                            <p className="font-bold text-blue">{user.role}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex">
                        <div className="rounded-md border border-primary bg-kalbe-ultraLight p-2">
                          <p className="font-bold text-primary">
                            Verified on:{" "}
                            <span className="font-medium">
                              {" "}
                              {formattedReviewDate}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Patient Role */}
                  {user.role === "Patient" && (
                    <div className="flex items-center justify-center rounded-md border border-primary bg-kalbe-ultraLight p-2">
                      <p className="font-bold text-primary">{user.role}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex w-full flex-col gap-5 lg:flex-row lg:justify-between">
              {/* First Column */}
              <div className="flex w-full flex-col gap-4">
                {/* User Personal Data */}
                <div className="flex w-full flex-col">
                  <h1 className="mb-3 text-heading-6 font-bold text-primary">
                    About You
                  </h1>
                  <div className="flex w-full flex-col md:flex-row md:gap-5">
                    <DisabledCustomInputGroup
                      label="First Name"
                      value={user.first_name}
                      type="text"
                    />
                    <DisabledCustomInputGroup
                      label="Last Name"
                      value={user.last_name}
                      type="text"
                    />
                  </div>
                  <div className="flex w-full flex-col md:flex-row md:gap-5">
                    <CustomInputGroup
                      label="Email"
                      type="email"
                      name="email"
                      placeholder="Enter Admin Email"
                      value={formData.email}
                      required
                      onChange={handleInputChange}
                    />
                    <PhoneNumberBox
                      placeholder="081XXXXXXXX"
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
                      type="text"
                    />
                    <DisabledCustomInputGroup
                      label="Gender"
                      value={user.gender ? user.gender : "-"}
                      type="text"
                    />
                  </div>
                  <div className="flex w-full flex-col md:flex-row md:gap-5">
                    <CustomInputGroup
                      label="Address"
                      type="text"
                      name="address"
                      placeholder="Enter Admin Address"
                      value={formData.address}
                      required
                      onChange={handleInputChange}
                    />
                    {user.role === "Patient" && (
                      <DisabledCustomInputGroup
                        label="Blood Type"
                        value={
                          user.patient.blood_type
                            ? user.patient.blood_type
                            : "-"
                        }
                        type="text"
                      />
                    )}
                  </div>
                  {user.role === "Patient" && (
                    <div className="flex w-full flex-col md:flex-row md:gap-5">
                      <CustomInputGroup
                        label="Height & Weight"
                        name="height"
                        secondName="weight"
                        isMultipleUnit
                        unit="cm"
                        secondUnit="kg"
                        value={formData.height}
                        secondValue={formData.weight}
                        required
                        type="number"
                        placeholder="50"
                        onChange={handleInputChange}
                      />
                      <CheckboxSmoker
                        isSmoking={formData.is_smoking ? "Yes" : "No"}
                        setIsSmoking={setFormData.bind(null, {
                          ...formData,
                          is_smoking: !formData.is_smoking
                        })}
                      />
                    </div>
                  )}
                </div>
              </div>

              <CustomDivider />

              {/* Second Column */}
              <div className="flex w-full flex-col gap-4">
                {/* CAREGIVER */}
                {["Nurse", "Midwife"].includes(user.role) && (
                  <>
                    {/* CAREGIVER - Working Schedule */}
                    {["Nurse", "Midwife"].includes(user.role) && (
                      <div className="flex w-full flex-col">
                        <h1 className="mb-3 text-heading-6 font-bold text-primary">
                          Your Working Schedule
                        </h1>
                        <div className="flex w-full flex-col md:flex-row md:gap-5">
                          <SelectDropdown
                            label="Start Day"
                            name="start_day"
                            value={formData.start_day as string}
                            required
                            placeholder="Select Start Day"
                            content={[
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday"
                            ]}
                          />
                          <SelectDropdown
                            label="End Day"
                            name="end_day"
                            value={formData.end_day as string}
                            required
                            placeholder="Select End Day"
                            content={[
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday"
                            ]}
                          />
                        </div>
                        <div className="flex w-full flex-col md:flex-row md:gap-5">
                          <CustomTimePicker
                            placeholder="00:00"
                            label="Start Time"
                            name="start_time"
                            required
                            value={formData.start_time}
                          />
                          <CustomTimePicker
                            placeholder="00:00"
                            label="End Time"
                            name="end_time"
                            required
                            value={formData.end_time}
                          />
                        </div>
                      </div>
                    )}

                    {/* CAREGIVER Working Experiences */}
                    <div className="flex w-full flex-col">
                      <h1 className="mb-3 text-heading-6 font-bold text-primary">
                        Your Working Experiences
                      </h1>
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <DisabledCustomInputGroup
                          label="Employment Type"
                          value={user.caregiver.employment_type}
                          type="text"
                        />
                        <DisabledCustomInputGroup
                          label="Work Experiences"
                          value={user.caregiver.work_experiences.toString()}
                          type="text"
                          isUnit={true}
                          unit="year"
                        />
                      </div>
                      <DisabledCustomInputGroup
                        label="Workplace"
                        value={user.caregiver.workplace}
                        type="text"
                      />
                    </div>
                  </>
                )}

                {/* PATIENT */}
                {user.role === "Patient" && (
                  <div className="flex w-full flex-col">
                    <h1 className="mb-3 text-heading-6 font-bold text-primary">
                      Your Past Medical History
                    </h1>
                    <CustomInputGroup
                      name="allergies"
                      label="Allergies (if any)"
                      type="text"
                      placeholder="Enter your allergies"
                      required={false}
                      value={formData.allergies}
                      onChange={handleInputChange}
                    />
                    <div className="flex w-full flex-col md:flex-row md:gap-5">
                      <CustomInputGroup
                        name="current_medication"
                        label="Current Medication (if any)"
                        type="text"
                        placeholder="Enter your current medication"
                        required={false}
                        value={formData.current_medication}
                        onChange={handleInputChange}
                      />
                      <CustomInputGroup
                        label="Medication Frequency (if any)"
                        name="med_freq_times"
                        secondName="med_freq_day"
                        isMultipleUnit
                        unit="qty"
                        secondUnit="/day"
                        value={formData.med_freq_times}
                        secondValue={formData.med_freq_day}
                        required={false}
                        type="number"
                        placeholder="50"
                        onChange={handleInputChange}
                      />
                    </div>
                    <CustomInputGroup
                      isTextArea
                      name="illness_history"
                      label="Illness History"
                      type="text"
                      required
                      placeholder="e.g. In 1995, I had chickenpox, and in 2002, I suffered a fractured left arm from a fall. I underwent an appendectomy in 2010. I was diagnosed with hypertension in 2018 and have been on Lisinopril 10mg daily since then"
                      value={formData.illness_history}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>
            </div>
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
                    src="/images/user/Default Admin Photo.jpeg"
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
                      About You
                    </h1>
                    <CustomDivider horizontal />
                  </div>

                  {/* Content */}
                  <div className="flex w-full flex-col">
                    <div className="flex w-full flex-col md:flex-row md:gap-5">
                      <DisabledCustomInputGroup
                        label="First Name"
                        value={user.first_name}
                        type="text"
                      />
                      <DisabledCustomInputGroup
                        label="Last Name"
                        value={user.last_name}
                        type="text"
                      />
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:gap-5">
                      <CustomInputGroup
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Enter Admin Email"
                        value={formData.email}
                        required
                        onChange={handleInputChange}
                      />
                      <PhoneNumberBox
                        placeholder="081XXXXXXXX"
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
                        type="text"
                      />
                      <DisabledCustomInputGroup
                        label="Gender"
                        value={user.gender ? user.gender : "-"}
                        type="text"
                      />
                    </div>
                    <CustomInputGroup
                      label="Address"
                      type="text"
                      name="address"
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

      {/* CAREGIVER - Rejection Notes */}
      {user.caregiver?.status === "Rejected" && (
        <div className="mt-3 flex w-full flex-col justify-center gap-2">
          <h1 className="mb-3 text-heading-6 font-bold text-red">
            Rejection Notes
          </h1>
          <textarea
            title="Rejection Notes"
            value={user.caregiver.notes}
            disabled
            className="h-20 max-h-40 min-h-fit w-full rounded-md border border-red bg-red-light px-3 py-2 font-normal text-red outline-none transition"
          />
        </div>
      )}

      {/* Button Group */}
      <div className="mt-5 flex w-full items-center justify-end">
        <div className="flex w-full flex-col items-center justify-center gap-2 md:w-1/4 md:flex-row md:justify-end md:gap-5">
          <AxolotlButton
            type="button"
            label="Cancel"
            variant="dangerOutlined"
            fontThickness="bold"
            customClasses="text-lg"
            onClick={() =>
              router.replace(`/profile?user=${user.user_id}&role=${user.role}`)
            }
          />
          <AxolotlButton
            isSubmit
            label="Save Changes"
            variant="primary"
            fontThickness="bold"
            customClasses="text-lg"
          />
        </div>
      </div>
    </form>
  );
}

export default EditProfileComponent;
