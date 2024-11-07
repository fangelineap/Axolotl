"use client";

import { AdminUserTable } from "@/app/(pages)/admin/manage/user/table/data";
import { getClientPublicStorageURL } from "@/app/_server-action/global/storage/client";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import ClientDownloadLicenses from "@/components/Axolotl/Buttons/ClientDownloadLicenses";
import CustomDivider from "@/components/Axolotl/CustomDivider";
import DisabledCustomInputGroup from "@/components/Axolotl/DisabledInputFields/DisabledCustomInputGroup";
import DisabledPhoneNumberBox from "@/components/Axolotl/DisabledInputFields/DisabledPhoneNumberBox";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ViewProfileComponentProps {
  user: AdminUserTable;
  totalOrder: number;
}

function ViewProfileComponent({ user, totalOrder }: ViewProfileComponentProps) {
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

  /**
   * * Date Formatters
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

  /**
   * * Working Schedule Variables
   */
  const startDaySchedule = user.caregiver?.schedule_start_day
    ? user.caregiver?.schedule_start_day
    : "-";

  const endDaySchedule = user.caregiver?.schedule_end_day
    ? user.caregiver?.schedule_end_day
    : "-";

  const startTimeSchedule = user.caregiver?.schedule_start_time
    ? user.caregiver?.schedule_start_time
    : "-";

  const endTimeSchedule = user.caregiver?.schedule_end_time
    ? user.caregiver?.schedule_end_time
    : "-";

  /**
   * * Handle Image Load
   */
  const handleImageLoad = () => setImageLoaded(true);

  /**
   * * Handle Edit Profile
   */
  const handleEditProfileButton = () =>
    router.push(`/profile/edit?user=${user.user_id}&role=${user.role}`);

  return (
    <>
      {/* Title */}
      <h1 className="mb-5 text-heading-1 font-bold">Your Profile</h1>

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
                    <div className="bg-primary-ultraLight flex items-center justify-center rounded-md border border-primary p-2">
                      <p className="font-bold text-primary">{user.role}</p>
                    </div>
                  )}
                </div>

                <AxolotlButton
                  label="Edit Profile"
                  variant="primary"
                  fontThickness="bold"
                  customWidth
                  customClasses="text-lg w-fit"
                  onClick={handleEditProfileButton}
                />
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

                {/* CAREGIVER - Working Schedule */}
                {["Nurse", "Midwife"].includes(user.role) && (
                  <div className="flex w-full flex-col">
                    <h1 className="mb-3 text-heading-6 font-bold text-primary">
                      Your Working Schedule
                    </h1>
                    <div className="flex w-full flex-col md:flex-row md:gap-5">
                      <DisabledCustomInputGroup
                        label="Start Day"
                        value={startDaySchedule}
                        horizontal={false}
                        type="text"
                      />
                      <DisabledCustomInputGroup
                        label="End Day"
                        value={endDaySchedule}
                        horizontal={false}
                        type="text"
                      />
                    </div>
                    <div className="flex w-full flex-col md:flex-row md:gap-5">
                      <DisabledCustomInputGroup
                        label="Start Time"
                        value={startTimeSchedule}
                        horizontal={false}
                        type="text"
                      />
                      <DisabledCustomInputGroup
                        label="End Time"
                        value={endTimeSchedule}
                        horizontal={false}
                        type="text"
                      />
                    </div>
                  </div>
                )}
              </div>

              <CustomDivider />

              {/* Second Column */}
              <div className="flex w-full flex-col gap-4">
                {/* CAREGIVER */}
                {["Nurse", "Midwife"].includes(user.role) && (
                  <>
                    {/* CAREGIVER - Rating */}
                    <div className="flex w-full flex-col">
                      <h1 className="mb-3 text-heading-6 font-bold text-primary">
                        Your Rating
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
                          value={
                            user.caregiver.rate
                              ? String(user.caregiver.rate)
                              : "-"
                          }
                        />
                      </div>
                    </div>

                    {/* CAREGIVER Working Experiences */}
                    <div className="flex w-full flex-col">
                      <h1 className="mb-3 text-heading-6 font-bold text-primary">
                        Your Working Experiences
                      </h1>
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <DisabledCustomInputGroup
                          label="Employment Type"
                          value={user.caregiver.employment_type}
                          horizontal={false}
                          type="text"
                        />
                        <DisabledCustomInputGroup
                          label="Work Experiences"
                          value={user.caregiver.work_experiences.toString()}
                          horizontal={false}
                          type="text"
                          isUnit={true}
                          unit="year"
                        />
                      </div>
                      <DisabledCustomInputGroup
                        label="Workplace"
                        value={user.caregiver.workplace}
                        horizontal={false}
                        type="text"
                      />
                    </div>

                    {/* CAREGIVER Licenses */}
                    <div className="flex w-full flex-col">
                      <h1 className="mb-3 text-heading-6 font-bold text-primary">
                        Your Licenses
                      </h1>
                      <div className="grid grid-cols-2 gap-5">
                        <ClientDownloadLicenses
                          licenseTitle="Curriculum Vitae"
                          fileLink={user.caregiver.cv ?? ""}
                          licenseType="CV"
                        />
                        <ClientDownloadLicenses
                          licenseTitle="Degree Certificate"
                          fileLink={user.caregiver.degree_certificate ?? ""}
                          licenseType="Degree Certificate"
                        />
                        <ClientDownloadLicenses
                          licenseTitle="Surat Tanda Registrasi"
                          fileLink={user.caregiver.str ?? ""}
                          licenseType="STR"
                        />
                        <ClientDownloadLicenses
                          licenseTitle="Surat Izin Praktik"
                          fileLink={user.caregiver.sip ?? ""}
                          licenseType="SIP"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* PATIENT */}
                {user.role === "Patient" && (
                  <div className="flex w-full flex-col">
                    <h1 className="mb-3 text-heading-6 font-bold text-primary">
                      Your Past Medical History
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
                  <AxolotlButton
                    label="Edit Profile"
                    variant="primary"
                    fontThickness="bold"
                    customWidth
                    customClasses="text-lg w-fit"
                    onClick={handleEditProfileButton}
                  />
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
                    <DisabledCustomInputGroup
                      label="Address"
                      value={user.address ? user.address : "-"}
                      horizontal={false}
                      type="text"
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
            label="Go back"
            variant="secondary"
            fontThickness="bold"
            customClasses="text-lg"
            onClick={() =>
              router.replace(
                `/${["Nurse", "Midwife"].includes(user.role) ? "caregiver" : user.role.toLowerCase()}`
              )
            }
          />
        </div>
      </div>
    </>
  );
}

export default ViewProfileComponent;
