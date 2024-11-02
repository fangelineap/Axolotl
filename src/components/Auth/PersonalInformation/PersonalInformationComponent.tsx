"use client";

import {
  CaregiverPersonalInformation,
  PatientPersonalInformation,
  UserPersonalInformation
} from "@/app/(pages)/registration/personal-information/type";
import { adminDeleteUser } from "@/app/_server-action/admin";
import {
  prepareFileBeforeUpload,
  uploadLicenses
} from "@/app/_server-action/storage/client";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import CheckboxBlood from "@/components/Axolotl/Checkboxes/CheckboxBlood";
import CheckboxSmoker from "@/components/Axolotl/Checkboxes/CheckboxSmoker";
import CustomDivider from "@/components/Axolotl/CustomDivider";
import CustomDatePicker from "@/components/Axolotl/InputFields/CustomDatePicker";
import CustomInputGroup from "@/components/Axolotl/InputFields/CustomInputGroup";
import FileInput from "@/components/Axolotl/InputFields/FileInput";
import AxolotlModal from "@/components/Axolotl/Modal/AxolotlModal";
import SelectDropdown from "@/components/Axolotl/SelectDropdown";
import { createSupabaseClient } from "@/lib/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthStepper from "../AuthStepper";
import { PersonalInformationValidation } from "./Validation/PersonalInformationValidation";

interface PersonalInformationComponentProps {
  paramsRole: string;
}

interface Licenses {
  cv: File | null;
  degree_certificate: File | null;
  str: File | null;
  sip: File | null;
}

function PersonalInformationComponent({
  paramsRole
}: PersonalInformationComponentProps) {
  /**
   * * States & Initial Variables
   */
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<string | File | null>(null);

  const [licenses, setLicenses] = useState<Licenses>({
    cv: null,
    degree_certificate: null,
    str: null,
    sip: null
  });

  const [blood, setBlood] = useState<"A" | "B" | "AB" | "O" | "">("");
  const [isSmoking, setIsSmoking] = useState<"Yes" | "No" | "">("");

  const [openCancelModal, setOpenCancelModal] = useState<boolean>(false);

  /**
   * * Handle the cancel modal
   */
  const handleOpenModal = () => setOpenCancelModal(true);
  const handleCloseModal = () => setOpenCancelModal(false);

  /**
   * * Handle Cancel Registration
   */
  const confirmCancelRegistration = async () => {
    const supabase = createSupabaseClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) return;

    await adminDeleteUser(userData?.user.id);

    router.replace("/auth/signin");
  };

  /**
   * * Save User Personal Information
   * @param form
   * @returns
   */

  const addPersonalInfo = async (form: FormData) => {
    // ! VALIDATION
    if (
      paramsRole === "Caregiver" &&
      !PersonalInformationValidation(form, "Caregiver", profilePhoto, licenses)
    )
      return;

    if (
      paramsRole === "Patient" &&
      !PersonalInformationValidation(form, "Patient")
    )
      return;

    // ! USER PERSONAL INFORMATION
    const userPersonalData: UserPersonalInformation = {
      address: form.get("address")?.toString() || "",
      gender: form.get("gender")?.toString() || "",
      birthdate: new Date(form.get("birthdate")?.toString() || "")
    };

    console.log({ userPersonalData });

    // ! CAREGIVER PERSONAL INFORMATION
    if (paramsRole === "Caregiver") {
      const profilePhotoPath = await prepareFileBeforeUpload(
        "profile_photo",
        profilePhoto as File
      );

      if (!profilePhotoPath) return;

      const licenseFiles = [
        {
          key: "cv",
          fileValue: licenses.cv as File,
          pathName: "pathCV",
          errorMsg: "CV"
        },
        {
          key: "degree_certificate",
          fileValue: licenses.degree_certificate as File,
          pathName: "pathDegreeCertificate",
          errorMsg: "Degree Certificate"
        },
        {
          key: "str",
          fileValue: licenses.str as File,
          pathName: "pathSTR",
          errorMsg: "STR"
        },
        {
          key: "sip",
          fileValue: licenses.sip as File,
          pathName: "pathSIP",
          errorMsg: "SIP"
        }
      ];

      const paths = await uploadLicenses(licenseFiles);

      if (!paths) return;

      const { pathCV, pathDegreeCertificate, pathSTR, pathSIP } = paths;

      const caregiverPersonalData: CaregiverPersonalInformation = {
        profile_photo: profilePhotoPath,
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

      console.log({ caregiverPersonalData });
    }

    // ! PATIENT PERSONAL INFORMATION
    if (paramsRole === "Patient") {
      const patientPersonalData: PatientPersonalInformation = {
        blood_type: form.get("blood_type") as "A" | "B" | "AB" | "O",
        height: form.get("height") as unknown as number,
        weight: form.get("weight") as unknown as number,
        is_smoking: form.get("is_smoking") === "Yes" ? true : false,
        allergies: form.get("allergies")?.toString() || "",
        current_medication: form.get("current_medication")?.toString() || "",
        med_freq_times: form.get("med_freq_times") as unknown as number,
        med_freq_day: form.get("med_freq_day") as unknown as number,
        illness_history: form.get("illness_history")?.toString() || ""
      };

      console.log({ patientPersonalData });
    }
  };

  return (
    <>
      <AuthStepper currentStep={3} role={paramsRole} />

      <div className="flex justify-center pb-9 pt-3">
        {/* Personal Information Form */}
        <div className="w-full min-w-[350px] shadow-1 sm:w-4/5 md:w-2/3 lg:w-11/12">
          {/* Header */}
          <div className="rounded-t-xl border border-primary bg-primary py-3">
            <h1 className="text-center text-xl font-semibold text-white md:text-heading-5">
              Fill Your Personal Information
            </h1>
          </div>

          {/* Content */}
          <div className="rounded-b-xl border border-primary">
            <form action={addPersonalInfo}>
              <div className="p-6.5">
                {paramsRole === "Patient" && (
                  // ! PATIENT'S FORM
                  <div className="flex flex-col justify-center gap-3">
                    <div className="flex flex-col justify-center gap-x-10 gap-y-5 lg:flex-row">
                      {/* First Column */}
                      <div className="w-full">
                        <h1 className="mb-3 text-xl font-bold text-kalbe-light">
                          About You
                        </h1>
                        <div className="mb-3 flex flex-col gap-5 lg:flex-row">
                          <CustomDatePicker
                            label="Birthdate"
                            name="birthdate"
                            required
                            placeholder="Select your birthdate"
                          />
                          <SelectDropdown
                            name="gender"
                            label="Gender"
                            content={["Female", "Male"]}
                            required
                            placeholder="Select your gender"
                          />
                        </div>
                        <div className="mb-3 flex flex-col gap-5 lg:flex-row">
                          <CustomInputGroup
                            name="address"
                            label="Address"
                            type="text"
                            placeholder="Street, Subdistrict, District/City, Province"
                            required
                          />
                          <CheckboxBlood blood={blood} setBlood={setBlood} />
                        </div>
                        <div className="mb-3 flex flex-col gap-5 lg:flex-row">
                          <CustomInputGroup
                            label="Height & Weight"
                            name="height"
                            secondName="weight"
                            isMultipleUnit
                            unit="cm"
                            secondUnit="kg"
                            required
                            type="number"
                            placeholder="50"
                          />
                          <div className="mb-3 flex w-full flex-col gap-2">
                            <CheckboxSmoker
                              isSmoking={isSmoking}
                              setIsSmoking={setIsSmoking}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Divider */}
                      <CustomDivider />
                      {/* Second Column */}
                      <div className="w-full">
                        <h1 className="mb-3 text-xl font-bold text-kalbe-light">
                          Current Health Condition
                        </h1>
                        <div className="flex flex-col gap-3">
                          <CustomInputGroup
                            name="allergies"
                            label="Allergies"
                            type="text"
                            placeholder="Enter your allergies"
                            required={false}
                          />
                          <div className="flex flex-col gap-5 lg:flex-row">
                            <CustomInputGroup
                              name="current_medication"
                              label="Medication"
                              type="text"
                              placeholder="e.g. Divask"
                              required={false}
                            />
                            <CustomInputGroup
                              label="Medication Frequency"
                              name="med_freq_times"
                              secondName="med_freq_day"
                              isMultipleUnit
                              unit="qty"
                              secondUnit="/day"
                              required={false}
                              type="number"
                              placeholder="50"
                            />
                          </div>
                          <CustomInputGroup
                            isTextArea
                            name="illness_history"
                            label="Illness History"
                            type="text"
                            required
                            placeholder="e.g. In 1995, I had chickenpox, and in 2002, I suffered a fractured left arm from a fall. I underwent an appendectomy in 2010. I was diagnosed with hypertension in 2018 and have been on Lisinopril 10mg daily since then"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {paramsRole === "Caregiver" && (
                  // ! CAREGIVER'S FORM
                  <div className="flex flex-col justify-center gap-5">
                    {/* Top Section */}
                    <div className="flex flex-col justify-center gap-x-10 gap-y-5 lg:flex-row">
                      {/* First Column */}
                      <div className="w-full">
                        <h1 className="mb-3 text-xl font-bold text-kalbe-light">
                          About You
                        </h1>
                        <FileInput
                          name="profile_photo"
                          label="Recent Profile Photo"
                          onFileSelect={(file) => setProfilePhoto(file)}
                          isDropzone
                          accept={["image/png", "image/jpg", "image/jpeg"]}
                          required
                        />
                        <div className="mt-3 flex flex-col gap-3 lg:flex-row">
                          <CustomDatePicker
                            name="birthdate"
                            placeholder="Select your birthdate"
                            label="Birthdate"
                            required
                          />
                          <SelectDropdown
                            name="gender"
                            label="Gender"
                            content={["Female", "Male"]}
                            required
                            placeholder="Select your gender"
                          />
                        </div>
                        <CustomInputGroup
                          name="address"
                          label="Current Location"
                          type="text"
                          placeholder="Street, Subdistrict, District/City, Province"
                          required
                        />
                      </div>
                      {/* Divider */}
                      <CustomDivider />
                      {/* Second Column */}
                      <div className="w-full">
                        <h1 className="mb-3 text-xl font-bold text-kalbe-light">
                          Working Experiences
                        </h1>
                        <div className="flex flex-col gap-5 lg:flex-row">
                          <SelectDropdown
                            name="role"
                            label="I'm a"
                            content={["Nurse", "Midwife"]}
                            required
                            placeholder="Select your role"
                          />
                          <SelectDropdown
                            name="employmentType"
                            label="Employment Type"
                            content={["Full-time", "Part-time"]}
                            required
                            placeholder="Employment type"
                          />
                        </div>
                        <div className="flex flex-col gap-5 lg:flex-row">
                          <CustomInputGroup
                            name="workplace"
                            label="Workplace"
                            type="text"
                            placeholder="Enter your workplace"
                            required
                          />
                          <CustomInputGroup
                            name="workExperiences"
                            label="Work Experiences"
                            type="number"
                            placeholder="500"
                            required
                            isUnit
                            unit="year"
                          />
                        </div>
                        <FileInput
                          name="cv"
                          label="Submit Your CV"
                          onFileSelect={(file) =>
                            setLicenses({ ...licenses, cv: file })
                          }
                          isDropzone
                          accept={[
                            "image/png",
                            "image/jpg",
                            "image/jpeg",
                            "application/pdf"
                          ]}
                          required
                        />
                      </div>
                    </div>
                    {/* Bottom Section */}
                    <div className="mt-5 flex w-full flex-col gap-3 lg:mt-0">
                      <h1 className="text-heading-6 font-bold text-kalbe-light">
                        Your Licenses
                      </h1>
                      <div className="flex flex-col justify-between gap-x-10 gap-y-5 lg:flex-row">
                        <div className="w-full">
                          <FileInput
                            onFileSelect={(file) =>
                              setLicenses({
                                ...licenses,
                                degree_certificate: file
                              })
                            }
                            name="degree_certificate"
                            label="Degree Sertificate"
                            isDropzone
                            accept={[
                              "image/png",
                              "image/jpg",
                              "image/jpeg",
                              "application/pdf"
                            ]}
                            required
                          />
                        </div>
                        <div className="w-full">
                          <FileInput
                            onFileSelect={(file) =>
                              setLicenses({ ...licenses, sip: file })
                            }
                            name="sip"
                            label="SIP"
                            isDropzone
                            accept={[
                              "image/png",
                              "image/jpg",
                              "image/jpeg",
                              "application/pdf"
                            ]}
                            required
                          />
                        </div>
                        <div className="w-full">
                          <FileInput
                            onFileSelect={(file) =>
                              setLicenses({ ...licenses, str: file })
                            }
                            name="str"
                            label="STR"
                            isDropzone
                            accept={[
                              "image/png",
                              "image/jpg",
                              "image/jpeg",
                              "application/pdf"
                            ]}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Third div for finish button */}
                <div className="mt-5 flex items-center justify-center gap-3 lg:mx-80">
                  <AxolotlButton
                    label="Cancel Registration"
                    onClick={handleOpenModal}
                    variant="secondary"
                    fontThickness="bold"
                  />
                  <AxolotlButton
                    label="Finish Registration"
                    variant="primary"
                    isSubmit
                    fontThickness="bold"
                  />
                </div>
                <p className="mt-3 text-center text-body-sm">
                  Already have an account?{" "}
                  <span>
                    <Link
                      href="signup"
                      className="text-primary hover:underline"
                    >
                      Sign in instead
                    </Link>
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AxolotlModal
        isOpen={openCancelModal}
        onClose={handleCloseModal}
        onConfirm={confirmCancelRegistration}
        title="Cancel Registration"
        question={`Are you sure you want to cancel your registration? Your account will be deleted and you must re-register to Axolotl.`}
        action="cancel"
      />

      {/* {paramsRole != null && finished && (
        <>
          <div
            className={`pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 ${finished ? "opacity-100" : "opacity-0"} backdrop-blur-sm transition-opacity duration-300`}
          >
            <div
              data-dialog="dialog-xs"
              className="font-sans text-blue-gray-500 min-w-1/4 lg:max-w-1/4 relative m-4 w-3/4 rounded-lg bg-white p-3 text-base font-light leading-relaxed antialiased shadow-2xl md:max-w-[50%] lg:w-1/4"
            >
              <div className="flex flex-col items-center justify-center pt-[30px]">
                <svg
                  width="150"
                  height="150"
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
                <div className="flex flex-col items-center justify-center">
                  <label className="text-2xl font-bold">Success!</label>
                  <label>Congratulations!</label>
                  <label>Let&apos;s visit your homepage</label>
                </div>
              </div>
              <div className="text-blue-gray-500 mb-6 mt-2 flex shrink-0 flex-wrap items-center justify-center p-4">
                <button
                  type="button"
                  className="w-1/3 cursor-pointer rounded-sm bg-kalbe-light p-1 font-semibold text-white hover:bg-kalbe-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    setFinished(false);
                    if (paramsRole === "Patient") {
                      router.push("/patient");
                    }
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )} */}
    </>
  );
}

export default PersonalInformationComponent;
