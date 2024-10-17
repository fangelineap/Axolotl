import { getCaregiverDataById } from "@/app/_server-action/caregiver";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getUserFromSession } from "@/lib/server";
import { CAREGIVER } from "@/types/axolotl";
import { getCaregiverMetadata } from "@/utils/Metadata/CaregiverMetadata";
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
    await getCaregiverDataById(caregiverUserData.id);

  if (caregiverError) return null;

  return caregiverData as CAREGIVER;
}

async function Review() {
  const caregiverData = await fetchCaregiverData();
  const caregiverVerificationStatus = caregiverData?.status;

  return (
    <DefaultLayout>
      {/* Stepper */}
      <div className="mb-3.5 flex items-center justify-center">
        <div className="grid min-w-[350px] grid-cols-2 gap-4 gap-x-10 lg:flex lg:gap-7">
          <div className="flex items-center justify-start gap-1">
            <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
              1
            </h2>
            <h2>Choose Role</h2>
          </div>
          <div className="flex items-center justify-start gap-1">
            <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
              2
            </h2>
            <h2>Create Account</h2>
          </div>
          <div className="flex items-center justify-start gap-1">
            <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
              3
            </h2>
            <h2>Personal Infomation</h2>
          </div>
          <div className="flex items-center justify-start gap-1">
            <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
              4
            </h2>
            <h2>Review</h2>
          </div>
          <div className="flex items-center justify-start gap-1">
            <h2
              className={`flex h-7 w-7 items-center justify-center rounded-full ${caregiverVerificationStatus === "Verified" || caregiverVerificationStatus === "Rejected" ? "bg-kalbe-light" : "bg-gray-cancel"} font-medium text-white`}
            >
              5
            </h2>
            <h2>Finish</h2>
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-9 pt-3">
        <div className="w-full min-w-[350px] rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:w-4/5 md:w-2/3 lg:w-4/12">
          <div
            className={`rounded-t-[10px] border-b border-stroke ${caregiverVerificationStatus === "Rejected" ? "bg-red" : caregiverVerificationStatus === "Verified" ? "bg-kalbe-light" : "bg-yellow-dark"} px-6.5 py-4 dark:border-dark-3`}
          >
            <h3 className="text-center text-xl font-semibold text-white">
              Caregiver Application Status
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center p-6.5">
            {caregiverVerificationStatus == "Verified" ? (
              <svg
                width="110"
                height="110"
                viewBox="0 0 221 221"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-3"
              >
                <circle cx="110.5" cy="110.5" r="110.5" fill="#D4EDD6" />
                <path
                  d="M88.9006 135.531L163.62 67.6037C165.384 66.0007 167.441 65.1992 169.792 65.1992C172.143 65.1992 174.2 66.0007 175.963 67.6037C177.727 69.2067 178.608 71.1116 178.608 73.3184C178.608 75.5252 177.727 77.4274 175.963 79.0251L95.0721 152.763C93.3088 154.366 91.2516 155.167 88.9006 155.167C86.5495 155.167 84.4923 154.366 82.729 152.763L44.8181 118.299C43.0548 116.696 42.2084 114.793 42.279 112.592C42.3495 110.39 43.2694 108.486 45.0385 106.877C46.8077 105.269 48.9031 104.467 51.3247 104.473C53.7463 104.478 55.8387 105.28 57.602 106.877L88.9006 135.531Z"
                  fill="#1CBF90"
                />
              </svg>
            ) : caregiverVerificationStatus == "Unverified" ? (
              <svg
                width="110"
                height="110"
                viewBox="0 0 182 182"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="91.002" cy="91.002" r="91.002" fill="#FFF6E1" />
                <path
                  d="M91.1299 167.369C76.0513 167.369 61.3113 162.897 48.7739 154.52C36.2365 146.143 26.4648 134.236 20.6945 120.305C14.9241 106.374 13.4144 91.0453 16.3561 76.2565C19.2977 61.4676 26.5588 47.8831 37.221 37.221C47.8831 26.5588 61.4676 19.2977 76.2565 16.3561C91.0453 13.4144 106.374 14.9241 120.305 20.6945C134.236 26.4648 146.143 36.2365 154.52 48.7739C162.897 61.3113 167.369 76.0513 167.369 91.1299C167.369 111.35 159.336 130.741 145.039 145.039C130.741 159.336 111.35 167.369 91.1299 167.369ZM91.1299 25.7824C78.2054 25.7824 65.5711 29.615 54.8248 36.7954C44.0784 43.9759 35.7027 54.1818 30.7567 66.1225C25.8107 78.0632 24.5166 91.2024 27.038 103.879C29.5595 116.555 35.7832 128.199 44.9222 137.338C54.0612 146.477 65.7051 152.7 78.3812 155.222C91.0574 157.743 104.197 156.449 116.137 151.503C128.078 146.557 138.284 138.181 145.464 127.435C152.645 116.689 156.477 104.054 156.477 91.1299C156.477 73.7987 149.593 57.1773 137.338 44.9222C125.083 32.6672 108.461 25.7824 91.1299 25.7824Z"
                  fill="#F09D30"
                />
                <path
                  d="M116.125 123.804L85.6843 93.3625V42.1191H96.5756V88.8426L123.804 116.125L116.125 123.804Z"
                  fill="#F09D30"
                />
              </svg>
            ) : (
              <svg
                width="110"
                height="110"
                viewBox="0 0 182 182"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="91.002" cy="91.002" r="91.002" fill="#FBE3E4" />
                <path
                  d="M37.2184 37.2181C39.2608 35.1763 42.0305 34.0293 44.9185 34.0293C47.8064 34.0293 50.5762 35.1763 52.6186 37.2181L91.13 75.7296L129.641 37.2181C131.696 35.2342 134.447 34.1364 137.302 34.1612C140.158 34.186 142.89 35.3315 144.909 37.3508C146.928 39.3701 148.074 42.1018 148.099 44.9574C148.123 47.8131 147.026 50.5642 145.042 52.6183L106.53 91.1298L145.042 129.641C147.026 131.695 148.123 134.447 148.099 137.302C148.074 140.158 146.928 142.889 144.909 144.909C142.89 146.928 140.158 148.074 137.302 148.098C134.447 148.123 131.696 147.025 129.641 145.041L91.13 106.53L52.6186 145.041C50.5645 147.025 47.8133 148.123 44.9577 148.098C42.102 148.074 39.3703 146.928 37.351 144.909C35.3317 142.889 34.1863 140.158 34.1615 137.302C34.1366 134.447 35.2344 131.695 37.2184 129.641L75.7298 91.1298L37.2184 52.6183C35.1766 50.5759 34.0295 47.8062 34.0295 44.9182C34.0295 42.0303 35.1766 39.2605 37.2184 37.2181Z"
                  fill="#EE4D4D"
                />
              </svg>
            )}
            <div className="flex flex-col items-center justify-center p-5">
              <h1
                className={`mb-1 text-2xl font-bold ${caregiverVerificationStatus == "Verified" ? "text-kalbe-light" : caregiverVerificationStatus == "Unverified" ? "text-yellow-dark" : "text-red"}`}
              >
                {caregiverVerificationStatus == "Verified"
                  ? "Congratulations"
                  : caregiverVerificationStatus == "Unverified"
                    ? "Awaiting for approval..."
                    : "We are sorry..."}
              </h1>
              {caregiverVerificationStatus == "Verified" ? (
                <>
                  <p>
                    Your have been accepted to be a{" "}
                    <span className="font-semibold text-kalbe-light">
                      Caregiver
                    </span>
                  </p>
                  <p>Let&apos;s visit your homepage</p>
                </>
              ) : (
                caregiverVerificationStatus == "Rejected" && (
                  <>
                    <p>
                      You are not eligible to be a{" "}
                      <span className="font-semibold text-red">Caregiver</span>
                    </p>
                    <p className="mt-3 text-dark-secondary">Notes:</p>
                    <p>{caregiverData?.notes}</p>
                  </>
                )
              )}
            </div>
          </div>
          {caregiverVerificationStatus == "Verified" && (
            <div className="text-blue-gray-500 mb-6 flex shrink-0 flex-wrap items-center justify-center">
              <Link href="/caregiver">
                <AxolotlButton label="Okay" variant="primary" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Review;
