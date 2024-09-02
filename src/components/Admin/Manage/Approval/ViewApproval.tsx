import { AdminApprovalTable } from "@/app/(pages)/admin/manage/approval/table/data";
import Image from "next/image";
import React from "react";

interface ViewApprovalProps {
  caregiver: AdminApprovalTable;
}

function ViewApproval({ caregiver }: ViewApprovalProps) {
  const cg_full_name =
    caregiver.user.first_name + " " + caregiver.user.last_name;
  const formatVerifiedAtDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(caregiver.updated_at));

  return (
    <div className="mx-20 h-auto w-auto">
      {/* Title */}
      <h1 className="mb-5 text-heading-1 font-bold">User Profile</h1>
      {/* Container */}
      <div className="flex w-full flex-col justify-between gap-5">
        {/* Profile Section */}
        <div className="flex w-full flex-col items-center gap-10 lg:flex-row">
          <div className="h-40 w-40 overflow-hidden rounded-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_photo/${encodeURIComponent(caregiver.profile_photo)}`}
              alt="Caregiver Profile Photo"
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mb-4 flex flex-col items-center justify-center gap-2 lg:items-start">
            <h1 className="text-xl font-bold">{cg_full_name}</h1>
            <div className="flex gap-2 lg:flex-col">
              <div className="flex">
                {caregiver.user.role === "Nurse" ? (
                  <div className="rounded-md border border-yellow bg-yellow-light p-2">
                    <p className="font-bold text-yellow">
                      {caregiver.user.role}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border border-red bg-red-light p-2">
                    <p className="font-bold text-red">{caregiver.user.role}</p>
                  </div>
                )}
              </div>
              <div className="flex">
                {caregiver.status === "Unverified" ? (
                  <div className="rounded-md border border-blue bg-blue-light p-2">
                    <p className="font-bold text-blue">
                      Awaiting for verification
                    </p>
                  </div>
                ) : caregiver.status === "Verified" ? (
                  <div className="rounded-md border border-primary bg-kalbe-ultraLight p-2">
                    <p className="font-bold text-primary">
                      Verified on:{" "}
                      <span className="font-medium">
                        {" "}
                        {formatVerifiedAtDate}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border border-red bg-red-light p-2">
                    <p className="font-bold text-red">Rejected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="flex w-full flex-col gap-5 lg:flex-row lg:justify-between">
          {/* First Column */}
          <div className="flex w-full flex-col">
            <h1 className="text-heading-6 font-bold text-primary">
              User Personal Data
            </h1>
          </div>

          {/* Center Divider */}
          <div className="hidden lg:flex lg:items-center">
            <div className="h-full border-l border-primary"></div>
          </div>

          {/* Second Column */}
          <div className="flex w-full flex-col">
            <h1 className="text-heading-6 font-bold text-primary">
              User Working Experiences
            </h1>
            <h1 className="text-heading-6 font-bold text-primary">
              User Licences
            </h1>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex w-full items-center justify-end">
          <div className="flex w-1/4 items-center justify-end gap-5">
            {caregiver.status === "Unverified" ? (
              <div className="flex items-center justify-center gap-2 w-full">
                <button className="w-full rounded-md border border-red p-2 font-bold text-red hover:bg-red-hover">
                  Reject
                </button>
                <button className="w-full hover:bg-kalbe-ultraLight rounded-md border border-primary bg-primary p-2 font-bold text-white hover:text-primary">Approve
                </button>
              </div>
            ) : (
              <button className="w-1/2 rounded-md border border-gray-cancel bg-gray-cancel p-2 font-bold text-white hover:bg-gray-cancel-hover hover:text-gray-cancel">
                Go back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewApproval;
