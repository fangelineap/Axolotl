import { getGlobalCaregiverDataByCaregiverOrUserId } from "@/app/_server-action/global";
import AuthStepper from "@/components/Auth/AuthStepper";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getUserFromSession } from "@/lib/server";
import { CAREGIVER } from "@/types/AxolotlMainType";
import { getCaregiverMetadata } from "@/utils/Metadata/CaregiverMetadata";
import { IconCheck, IconClock, IconX } from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = getCaregiverMetadata("Review");

async function fetchCaregiverData() {
  /**
   * Get user from session
   */
  const { data: caregiverUserData } = await getUserFromSession();

  if (!caregiverUserData) return null;

  const { data: caregiverData, error: caregiverError } =
    await getGlobalCaregiverDataByCaregiverOrUserId(
      "caregiver",
      caregiverUserData.id
    );

  if (caregiverError) return null;

  return caregiverData as CAREGIVER;
}

function getStatusContent(status: string, notes?: string) {
  switch (status) {
    case "Verified":
      return {
        heading: "You're Officially Awesome! 🎉",
        subheading: "Welcome to the caregiver crew!",
        message: "Time to make the world a better place—one patient at a time.",
        icon: (
          <IconCheck
            size={180}
            className="rounded-full bg-kalbe-proLight p-4 text-primary"
          />
        ),
        button: (
          <Link href="/caregiver" className="w-full">
            <AxolotlButton
              label="Let's Get Started!"
              variant="primary"
              fontThickness="bold"
            />
          </Link>
        ),
        headingClass: "text-primary"
      };
    case "Unverified":
      return {
        heading: "Sit Tight! ⏳",
        subheading:
          "We're analyzing your awesomeness. This process can take up to 2 weeks.",
        message:
          "Currently, you don't have access to our features, such as receiving orders, chatting, etc. except for logging out from your account. In the meantime, why not perfect your victory dance?",
        icon: (
          <IconClock
            size={180}
            className="rounded-full bg-yellow-light p-4 text-yellow"
          />
        ),
        headingClass: "text-yellow"
      };
    case "Rejected":
      return {
        heading: "Well, That Didn't Go As Planned...",
        subheading: "Looks like we hit a speed bump.",
        message: notes
          ? `If you're wondering why, here's why: ${notes}`
          : "But hey, every setback is a setup for a comeback!",
        icon: (
          <IconX
            size={180}
            className="rounded-full bg-red-hover p-4 text-red"
          />
        ),
        headingClass: "text-red"
      };
    default:
      return {
        heading: "🤔 Hmm, That's Odd...",
        subheading: "",
        message: "Something went sideways. Try refreshing the page.",
        icon: null,
        headingClass: ""
      };
  }
}

async function Review() {
  const caregiverData = await fetchCaregiverData();
  const caregiverVerificationStatus = caregiverData?.status;
  const statusContent = getStatusContent(
    caregiverVerificationStatus!,
    caregiverData?.notes
  );
  const statusBgClasses = {
    Verified: "bg-primary",
    Unverified: "bg-yellow",
    Rejected: "bg-red"
  };

  const titleBgClass =
    statusBgClasses[caregiverVerificationStatus!] || "bg-blue";

  return (
    <DefaultLayout>
      {/* Stepper */}
      <AuthStepper
        role="Caregiver"
        currentStep={4}
        caregiverVerificationStatus={caregiverVerificationStatus}
      />

      <div className="mt-10 flex justify-center">
        <div className="w-full min-w-[350px] rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:w-4/5 md:w-2/3 lg:w-4/12">
          <div
            className={`rounded-t-[10px] border-b border-stroke ${titleBgClass} px-6.5 py-4 dark:border-dark-3`}
          >
            <h3 className="text-center text-xl font-semibold text-white">
              Caregiver Application Status
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center gap-5 p-6.5">
            {statusContent.icon}
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <h1
                className={`mb-1 text-2xl font-bold ${statusContent.headingClass}`}
              >
                {statusContent.heading}
              </h1>
              <div className="flex flex-col items-center justify-center">
                <p className="text-lg">{statusContent.subheading}</p>
                <p className="text-dark-secondary">{statusContent.message}</p>
              </div>
            </div>
            {statusContent.button && (
              <div className="flex w-full items-center justify-center">
                {statusContent.button}
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Review;
