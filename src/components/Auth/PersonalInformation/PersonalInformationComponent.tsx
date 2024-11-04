"use client";

import {
  CaregiverPersonalInformation,
  PatientPersonalInformation,
  UserPersonalInformation
} from "@/app/(pages)/registration/personal-information/type";
import { adminDeleteUser } from "@/app/_server-action/admin";
import {
  saveRolePersonalInformation,
  saveUserPersonalInformation
} from "@/app/_server-action/auth";
import {
  prepareFileBeforeUpload,
  removeLicenses,
  removeUploadedFileFromStorage,
  uploadLicenses
} from "@/app/_server-action/global/storage/client";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
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

  const savePersonalInfo = async (form: FormData) => {
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
      birthdate: new Date(form.get("birthdate")?.toString() || ""),
      role:
        (form.get("caregiver_role")?.toString() as "Nurse" | "Midwife") ||
        "Patient"
    };

    const { success: userPersonalInformationSuccess } =
      await saveUserPersonalInformation(userPersonalData);

    if (!userPersonalInformationSuccess) {
      toast.error("Error saving user personal information. Please try again.", {
        position: "bottom-right"
      });

      return;
    }

    if (userPersonalInformationSuccess) {
      toast.info(
        `User personal information saved successfully. Updating ${paramsRole} personal information...`,
        {
          position: "bottom-right"
        }
      );

      // ! CAREGIVER PERSONAL INFORMATION
      if (paramsRole === "Caregiver") {
        const profilePhotoPath = await prepareFileBeforeUpload(
          "profile_photo",
          profilePhoto as File
        );

        if (!profilePhotoPath) {
          toast.error("Error uploading profile photo. Please try again.", {
            position: "bottom-right"
          });

          return;
        }

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

        if (!paths) {
          toast.error("Error uploading licenses. Please try again.", {
            position: "bottom-right"
          });

          return;
        }

        if (profilePhotoPath && paths) {
          toast.info(
            "Your profile photo and licenses has been uploaded successfully. Please wait...",
            {
              position: "bottom-right"
            }
          );
        }

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

        const { success } = await saveRolePersonalInformation(
          caregiverPersonalData
        );

        if (!success) {
          const revertRoles: UserPersonalInformation = {
            address: null,
            birthdate: null,
            gender: null,
            role: "Caregiver"
          };

          await saveUserPersonalInformation(revertRoles, true);

          await removeLicenses(
            Object.values(paths)
              .filter((path) => path !== undefined)
              .map((path) => ({ storage: path!, fileValue: path }))
          );

          await removeUploadedFileFromStorage(
            "profile_photo",
            profilePhotoPath
          );

          toast.error(
            "Error saving caregiver personal information. Please try again.",
            {
              position: "bottom-right"
            }
          );

          return;
        }

        toast.success("Caregiver personal information saved successfully.", {
          position: "bottom-right"
        });

        setTimeout(() => {
          router.refresh();
          router.push("/caregiver/review");
          router.refresh();
        }, 250);
      }

      // ! PATIENT PERSONAL INFORMATION
      if (paramsRole === "Patient") {
        const patientPersonalData: PatientPersonalInformation = {
          blood_type: form.get("blood_type") as "A" | "B" | "AB" | "O",
          height: form.get("height") as unknown as number,
          weight: form.get("weight") as unknown as number,
          is_smoking: form.get("is_smoking") === "Yes" ? true : false,
          allergies: form.get("allergies")?.toString() || null,
          current_medication:
            form.get("current_medication")?.toString() || null,
          med_freq_times: form.get("med_freq_times")
            ? (form.get("med_freq_times") as unknown as number)
            : null,
          med_freq_day: form.get("med_freq_day")
            ? (form.get("med_freq_day") as unknown as number)
            : null,
          illness_history: form.get("illness_history")?.toString() || ""
        };

        const { success } =
          await saveRolePersonalInformation(patientPersonalData);

        if (!success) {
          toast.error(
            "Error saving patient personal information. Please try again.",
            {
              position: "bottom-right"
            }
          );

          return;
        }

        toast.success("Patient personal information saved successfully.", {
          position: "bottom-right"
        });

        setTimeout(() => {
          router.refresh();
          router.push("/patient");
          router.refresh();
        }, 250);
      }
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
            <form action={savePersonalInfo}>
              <div className="p-6.5">
                {paramsRole === "Patient" && (
                  // ! PATIENT'S FORM
                  <div className="flex flex-col justify-center gap-3">
                    <div className="flex flex-col justify-center gap-x-10 lg:flex-row lg:gap-y-5">
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
                            name="caregiver_role"
                            label="I'm a"
                            content={["Nurse", "Midwife"]}
                            required
                            placeholder="Select your role"
                          />
                          <SelectDropdown
                            name="employment_type"
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
                            name="work_experiences"
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
    </>
  );
}

export default PersonalInformationComponent;
