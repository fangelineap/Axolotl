import { AdminUserTable } from "@/app/(pages)/admin/manage/user/table/data";
import DisabledCustomInputGroup from "@/components/Axolotl/DisabledInputFields/DisabledCustomInputGroup";
import DownloadLicenses from "@/components/Axolotl/Buttons/DownloadLicenses";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DisabledPhoneNumberBox from "@/components/Axolotl/DisabledInputFields/DisabledPhoneNumberBox";

interface ViewUserProps {
  user: AdminUserTable;
}

async function ViewUser({ user }: ViewUserProps) {
  const user_full_name = user.first_name + " " + user.last_name;

  /**
   * Create reusable date formatters
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

  const formatDate = (date: Date, formatter: Intl.DateTimeFormat) =>
    formatter.format(new Date(date));

  /**
   * Format the date & time values
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

  return (
    <>
      {/* Title */}
      <h1 className="mb-5 text-heading-1 font-bold">User Profile</h1>
      {/* Container */}
      <div className={`flex w-full flex-col justify-between gap-5`}>
        {/* Profile with Profile Picture Section */}
        {["Nurse", "Midwife", "Patient"].includes(user.role) ? (
          <>
            {/* Top Section */}
            <div className="flex w-full flex-col items-center justify-start gap-5 md:flex-row">
              <div className="h-40 w-40 overflow-hidden rounded-full border">
                {user.role === "Nurse" || user.role === "Midwife" ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_photo/${encodeURIComponent(user.caregiver.profile_photo)}`}
                    alt="User Profile Photo"
                    width={200}
                    height={200}
                    priority
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user.role === "Patient" && (
                    <Image
                      src="/images/user/patient.png"
                      alt="Default Patient Profile Photo"
                      width={200}
                      height={200}
                      priority
                      className="h-full w-full object-cover"
                    />
                  )
                )}
              </div>
              {/* User Basic Data */}
              <div className="mb-4 flex flex-col items-center justify-center gap-2 lg:mb-0 lg:items-start">
                {/* User Full Name */}
                <h1 className="text-xl font-bold">{user_full_name}</h1>
                {/* User Role */}
                <div className="flex flex-col gap-2">
                  {(user.role === "Nurse" || user.role === "Midwife") && (
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

                  {/* If User is Patient, then display role */}
                  {user.role === "Patient" && (
                    <div className="bg-primary-ultraLight flex items-center justify-center rounded-md border border-primary p-2">
                      <p className="font-bold text-primary">{user.role}</p>
                    </div>
                  )}
                </div>
                <button className="rounded-md border border-primary bg-primary px-3 py-2 text-lg font-semibold text-white hover:bg-kalbe-ultraLight hover:text-primary">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Bottom Section */}
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
                {(user.role === "Nurse" || user.role === "Midwife") && (
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
                {(user.role === "Nurse" || user.role === "Midwife") && (
                  <>
                    {/* CAREGIVER - Rating */}
                    <div className="flex w-full flex-col">
                      <h1 className="mb-3 text-heading-6 font-bold text-primary">
                        User Rating
                      </h1>
                      <div className="flex w-full flex-col md:flex-row md:gap-5">
                        <DisabledCustomInputGroup
                          label="Total Order"
                          placeholder="Total Order"
                          horizontal={false}
                          type="text"
                        />
                        <DisabledCustomInputGroup
                          label="Rating"
                          type="text"
                          horizontal={false}
                          isRating
                          value="4.5+"
                        />
                      </div>
                    </div>

                    {/* CAREGIVER Working Experiences */}
                    <div className="flex w-full flex-col">
                      <h1 className="mb-3 text-heading-6 font-bold text-primary">
                        User Working Experiences
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
                        User Licenses
                      </h1>
                      <div className="grid grid-cols-2 gap-5">
                        <DownloadLicenses
                          licenseTitle="Curriculum Vitae"
                          fileLink={user.caregiver.cv}
                          cv
                        />
                        <DownloadLicenses
                          licenseTitle="Degree Certificate"
                          fileLink={user.caregiver.degree_certificate}
                          degree_certificate
                        />
                        <DownloadLicenses
                          licenseTitle="Surat Tanda Registrasi"
                          fileLink={user.caregiver.str}
                          str
                        />
                        <DownloadLicenses
                          licenseTitle="Surat Izin Praktik"
                          fileLink={user.caregiver.sip}
                          sip
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
          </>
        ) : (
          user.role === "Admin" && (
            <div className="flex h-full w-full flex-col items-start justify-between gap-5 md:flex-row">
              {/* Left Section */}
              {/* Profile with Profile Picture Section */}
              <div className="flex h-full w-full flex-row items-center justify-center gap-10 rounded-md border border-primary py-4 md:max-w-[25%] md:flex-col md:gap-2">
                <div className="h-25 w-25 overflow-hidden rounded-full border">
                  <Image
                    src="/images/user/Default Admin Photo.png"
                    alt="Default Admin Profile Photo"
                    width={200}
                    height={200}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* User Basic Data */}
                <div className="flex flex-col items-start justify-start gap-2 md:items-center md:justify-center">
                  <h1 className="text-xl font-bold">{user_full_name}</h1>
                  <div className="flex items-center justify-center rounded-md border border-red bg-red-light p-2">
                    <p className="font-bold text-red">{user.role}</p>
                  </div>
                  <button className="rounded-md border border-primary bg-primary px-3 py-2 text-lg font-semibold text-white hover:bg-kalbe-ultraLight hover:text-primary">
                    Edit Profile
                  </button>
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

        {/* Button Group */}
        <div className="flex w-full items-center justify-end">
          <div className="flex w-1/2 items-center justify-end gap-5 md:w-1/4">
            <div className="w-3/4 md:w-[75%] md:min-w-[50%]">
              <Link href={"/admin/manage/user"}>
                <button className="w-full rounded-md border border-gray-cancel bg-gray-cancel p-2 px-3 font-bold text-white hover:bg-gray-cancel-hover hover:text-gray-cancel">
                  Go back
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewUser;
