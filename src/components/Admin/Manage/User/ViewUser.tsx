import { AdminUserTable } from "@/app/(pages)/admin/manage/user/table/data";
import DisabledLabel from "@/components/Axolotl/DisabledLabel";
import PhoneNumberBox from "@/components/Axolotl/PhoneNumberBox";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ViewUserProps {
  user: AdminUserTable;
}

async function ViewUser({ user }: ViewUserProps) {
  const cg_full_name = user.first_name + " " + user.last_name;

  const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formatDate = (date: Date, formatter: Intl.DateTimeFormat) =>
    formatter.format(new Date(date));

  let formattedReviewDate = "";

  if (user.caregiver) {
    formattedReviewDate = formatDate(
      user.caregiver?.reviewed_at,
      dateTimeFormatter,
    );
  }

  const formattedBirthDate = formatDate(user.birthdate, dateFormatter);

  return (
    <div className="mx-20 h-auto w-auto">
      {/* Title */}
      <h1 className="mb-5 text-heading-1 font-bold">User Profile</h1>
      {/* Container */}
      <div className="flex w-full flex-col justify-between gap-5">
        {/* Profile Section */}
        <div className="flex w-full flex-col items-center justify-start gap-10 lg:flex-row">
          <div className="h-40 w-40 overflow-hidden rounded-full">
            {user.role === "Nurse" || user.role === "Midwife" ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_photo/${encodeURIComponent(user.caregiver.profile_photo)}`}
                alt="User Profile Photo"
                width={200}
                height={200}
                priority
                className="h-full w-full object-cover"
              />
            ) : user.role === "Patient" ? (
              <Image
                src="/images/user/patient.png"
                alt="Default Patient Profile Photo"
                width={200}
                height={200}
                priority
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src="/images/user/Default Admin Photo.png"
                alt="Admin Profile Photo"
                width={200}
                height={200}
                priority
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="mb-4 flex flex-col items-center justify-center gap-2 lg:mb-0 lg:items-start">
            <h1 className="text-xl font-bold">{cg_full_name}</h1>
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

              {user.role === "Patient" && (
                <div className="bg-primary-ultraLight flex items-center justify-center rounded-md border border-primary p-2">
                  <p className="font-bold text-primary">{user.role}</p>
                </div>
              )}

              {user.role === "Admin" && (
                <div className="flex items-center justify-center rounded-md border border-red bg-red-light p-2">
                  <p className="font-bold text-red">{user.role}</p>
                </div>
              )}
            </div>
            <button className="rounded-md border border-primary bg-primary px-3 py-2 text-lg font-semibold text-white hover:bg-kalbe-ultraLight hover:text-primary">
              Edit Profile
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="flex w-full flex-col gap-5 lg:flex-row lg:justify-between">
          {/* First Column */}
          <div className="flex w-full flex-col gap-2">
            <h1 className="mb-3 text-heading-6 font-bold text-primary">
              User Personal Data
            </h1>
            <div className="flex w-full gap-5">
              <DisabledLabel
                label="First Name"
                value={user.first_name}
                horizontal={false}
                type="text"
              />
              <DisabledLabel
                label="Last Name"
                value={user.last_name}
                horizontal={false}
                type="text"
              />
            </div>
            <div className="flex w-full gap-5">
              <DisabledLabel
                label="Email"
                value={user?.email}
                horizontal={false}
                type="text"
              />
              <PhoneNumberBox
                placeholder="081XXXXXXXX"
                value={Number(user.phone_number)}
              />
            </div>
            <DisabledLabel
              label="Birthdate"
              value={formattedBirthDate}
              horizontal={false}
              type="text"
            />
            <DisabledLabel
              label="Address"
              value={user.address}
              horizontal={false}
              type="text"
            />
          </div>
        </div>

        {/* Button Group */}
        <div className="mt-5 flex w-full items-center justify-end">
          <div className="flex w-1/4 items-center justify-end gap-5">
            <Link href={"/admin/manage/user"}>
              <button className="w-full rounded-md border border-gray-cancel bg-gray-cancel p-2 px-3 font-bold text-white hover:bg-gray-cancel-hover hover:text-gray-cancel">
                Go back
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUser;
