import { AdminApprovalTable } from "@/app/(pages)/admin/manage/approval/table/data";
import { adminGetUserAuthSchema } from "@/app/_server-action/admin";
import ApprovalButtons from "@/components/Axolotl/Buttons/ApprovalButtons";
import DownloadLicenses from "@/components/Axolotl/Buttons/DownloadLicenses";
import CustomDivider from "@/components/Axolotl/CustomDivider";
import DisabledCustomInputGroup from "@/components/Axolotl/DisabledInputFields/DisabledCustomInputGroup";
import DisabledPhoneNumberBox from "@/components/Axolotl/DisabledInputFields/DisabledPhoneNumberBox";
import { USER_AUTH_SCHEMA } from "@/types/AxolotlMultipleTypes";
import Image from "next/image";

interface ViewApprovalProps {
  caregiver: AdminApprovalTable;
}

async function getUserData(caregiver_id: string) {
  const response = await adminGetUserAuthSchema(caregiver_id);
  if (!response) {
    return null;
  }

  return response as unknown as USER_AUTH_SCHEMA;
}

async function ViewApproval({ caregiver }: ViewApprovalProps) {
  /**
   * * Initial Variables
   */
  const cg_user_data = await getUserData(caregiver.users.user_id);

  const cg_full_name =
    caregiver.users.first_name + " " + caregiver.users.last_name;

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
  const formattedReviewDate = formatDate(
    caregiver.reviewed_at,
    dateTimeFormatter
  );

  const formattedBirthDate = formatDate(
    caregiver.users.birthdate,
    dateFormatter
  );

  return (
    <>
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
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mb-4 flex flex-col items-center justify-center gap-2 lg:items-start">
            <h1 className="text-xl font-bold">{cg_full_name}</h1>
            <div className="flex gap-2 lg:flex-col">
              <div className="flex">
                {caregiver.users.role === "Nurse" ? (
                  <div className="rounded-md border border-yellow bg-yellow-light p-2">
                    <p className="font-bold text-yellow">
                      {caregiver.users.role}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border border-blue bg-blue-light p-2">
                    <p className="font-bold text-blue">
                      {caregiver.users.role}
                    </p>
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
          </div>
        </div>

        {/* User Profile Section */}
        <div className="flex w-full flex-col gap-5 lg:flex-row lg:justify-between">
          {/* First Column */}
          <div className="flex w-full flex-col">
            <h1 className="mb-3 text-heading-6 font-bold text-primary">
              User Personal Data
            </h1>
            <div className="flex w-full flex-col md:flex-row md:gap-5">
              <DisabledCustomInputGroup
                label="First Name"
                value={caregiver.users.first_name}
                horizontal={false}
                type="text"
              />
              <DisabledCustomInputGroup
                label="Last Name"
                value={caregiver.users.last_name}
                horizontal={false}
                type="text"
              />
            </div>
            <div className="flex w-full flex-col md:flex-row md:gap-5">
              <DisabledCustomInputGroup
                label="Email"
                value={cg_user_data?.email}
                horizontal={false}
                type="text"
              />
              <DisabledPhoneNumberBox
                placeholder="081XXXXXXXX"
                value={Number(caregiver.users.phone_number)}
              />
            </div>
            <DisabledCustomInputGroup
              label="Birthdate"
              value={formattedBirthDate}
              horizontal={false}
              type="text"
            />
            <DisabledCustomInputGroup
              label="Address"
              value={caregiver.users.address}
              horizontal={false}
              type="text"
            />
          </div>

          <CustomDivider />

          {/* Second Column */}
          <div className="flex w-full flex-col gap-4">
            {/* User Working Experiences */}
            <div className="flex w-full flex-col">
              <h1 className="mb-3 text-heading-6 font-bold text-primary">
                User Working Experiences
              </h1>
              <div className="flex w-full flex-col md:flex-row md:gap-5">
                <DisabledCustomInputGroup
                  label="Employment Type"
                  value={caregiver.employment_type}
                  horizontal={false}
                  type="text"
                />
                <DisabledCustomInputGroup
                  label="Work Experiences"
                  value={caregiver.work_experiences.toString()}
                  horizontal={false}
                  type="text"
                  isUnit={true}
                  unit="year"
                />
              </div>
              <DisabledCustomInputGroup
                label="Workplace"
                value={caregiver.workplace}
                horizontal={false}
                type="text"
              />
            </div>

            {/* User Licenses */}
            <div className="flex w-full flex-col">
              <h1 className="mb-3 text-heading-6 font-bold text-primary">
                User Licenses
              </h1>
              <div className="grid grid-cols-2 gap-5">
                <DownloadLicenses
                  licenseTitle="Curriculum Vitae"
                  fileLink={caregiver.cv}
                  licenseType="CV"
                />
                <DownloadLicenses
                  licenseTitle="Degree Certificate"
                  fileLink={caregiver.degree_certificate}
                  licenseType="Degree Cretificate"
                />
                <DownloadLicenses
                  licenseTitle="Surat Tanda Registrasi"
                  fileLink={caregiver.str}
                  licenseType="STR"
                />
                <DownloadLicenses
                  licenseTitle="Surat Izin Praktik"
                  fileLink={caregiver.sip}
                  licenseType="SIP"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Notes */}
      {caregiver.status === "Rejected" && (
        <div className="mt-3 flex w-full flex-col justify-center gap-2">
          <h1 className="mb-3 text-heading-6 font-bold text-red">
            Rejection Notes
          </h1>
          <textarea
            title="Rejection Notes"
            value={caregiver.notes}
            disabled
            className="h-20 max-h-40 min-h-fit w-full rounded-md border border-red bg-red-light px-3 py-2 font-normal text-red outline-none transition"
          />
        </div>
      )}

      {/* Button Group */}
      <div className="mt-5 flex w-full items-center justify-end">
        <div className="flex w-full flex-col items-center justify-center gap-2 md:w-1/4 md:flex-row md:justify-end md:gap-5">
          <h1
            className={`visible mb-3 text-center text-heading-6 font-bold text-primary md:hidden ${caregiver.status === "Rejected" ? "hidden" : ""}`}
          >
            Reject/Approve
          </h1>
          <ApprovalButtons status={caregiver.status} caregiver={caregiver} />
        </div>
      </div>
    </>
  );
}

export default ViewApproval;
