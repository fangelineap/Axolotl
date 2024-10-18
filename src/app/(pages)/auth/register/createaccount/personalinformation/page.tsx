/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { adminDeleteUser } from "@/app/_server-action/admin";
import AxolotlModal from "@/components/Axolotl/Modal/AxolotlModal";
import CheckboxBlood from "@/components/Axolotl/Checkboxes/CheckboxBlood";
import CheckboxSmoker from "@/components/Axolotl/Checkboxes/CheckboxSmoker";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import InputGroup from "@/components/FormElements/InputGroup";
import SelectGroupTwo from "@/components/FormElements/SelectGroup/SelectGroupTwo";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { createClient } from "@/lib/client";

const PersonalInformation = ({ searchParams }: any) => {
  const router = useRouter();

  const [profilePhoto, setProfilePhoto] = useState<any>(null);
  const [cv, setCv] = useState<any>(null);
  const [certificate, setCertificate] = useState<any>(null);
  const [str, setStr] = useState<any>(null);
  const [sip, setSip] = useState<any>(null);

  const [blood, setBlood] = useState<"A" | "B" | "AB" | "O" | "">("");
  const [isSmoking, setIsSmoking] = useState<"Yes" | "No" | "">("");

  const [loading, setLoading] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);

  const [openCancelModal, setOpenCancelModal] = useState<boolean>(false);

  /**
   * Check if the user is logged in
   */
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (!sessionData.session || sessionError) {
        // If the user is not logged in, redirect to the sign-in page
        router.push("/auth/signin");
      }
    };

    // Run the session check
    checkSession();

    // Logic to handle browser back button and close window
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      setOpenCancelModal(true); // Open cancel modal when user tries to leave
    };

    const handlePopState = () => {
      setOpenCancelModal(true);
    };

    // Listen for browser close/refresh
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Listen for browser back button
    window.addEventListener("popstate", handlePopState);

    // Cleanup event listeners when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  /**
   * Handle the cancel modal
   */
  const handleOpenModal = () => setOpenCancelModal(true);
  const handleCloseModal = () => setOpenCancelModal(false);

  /**
   * Clear User
   */
  const confirmCancelRegistration = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: userData, error: userError } =
      await supabase.auth.getSession();

    if (userError) {
      console.error("Error fetching user data:", userError);

      return;
    }

    await adminDeleteUser(userData.session?.user.id!);

    router.replace("/auth/signin");
  };

  /**
   * Handle User Registration
   */
  let session: any;

  const uploadToStorage = async (storage: string, file: string) => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: userData, error } = await supabase.auth.getSession();

    session = userData.session?.user.id;

    if (userData.session?.user) {
      const { data, error } = await supabase.storage
        .from(storage)
        .upload(`${userData.session.user.id}-${Date.now()}`, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (error) {
        return error;
      }

      console.log(`Data path for ${storage}: `, data?.path);

      return data?.path;
    }

    return error;
  };

  const addPersonalInfo = async (form: FormData) => {
    // form validation
    if (form.get("birthdate")?.toString() == "") {
      toast.warning("Please fill the birthdate field", {
        position: "bottom-right"
      });

      return;
    }

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    setLoading(true);

    if (searchParams.role == "Caregiver") {
      const { data: updateData, error: updateError } = await supabase
        .from("users")
        .update({
          address: form.get("currentLocation"),
          gender: form.get("gender"),
          birthdate: form.get("birthdate")?.toString(),
          role: form.get("role")
        })
        .eq("user_id", sessionData.session?.user.id);

      const pathProfile = await uploadToStorage("profile_photo", profilePhoto);
      const pathCv = await uploadToStorage("cv", cv);
      const pathCertificate = await uploadToStorage(
        "degree_certificate",
        certificate
      );
      const pathSip = await uploadToStorage("sip", sip);
      const pathStr = await uploadToStorage("str", str);

      if (pathProfile && pathCv && pathCertificate && pathSip && pathStr) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select()
          .eq("user_id", sessionData.session?.user.id);

        console.log("user data", userData);
        if (userData) {
          const { data: insertData, error: insertError } = await supabase
            .from("caregiver")
            .update({
              profile_photo: pathProfile,
              employment_type: form.get("employmentType"),
              workplace: form.get("workplace"),
              work_experiences: form.get("workExperiences"),
              cv: pathCv,
              degree_certificate: pathCertificate,
              sip: pathSip,
              str: pathStr,
              rate: 0
            })
            .eq("caregiver_id", userData[0].id);

          if (insertError) {
            setLoading(false);
            toast.error("An error occured while uploading your data", {
              position: "bottom-right"
            });

            return;
          }

          setLoading(false);
          router.replace(`/caregiver/review`);
        }
      }
    } else if (searchParams.role == "Patient") {
      // form validation
      if (blood == "" || isSmoking == "") {
        toast.warning("Please fill all fields", { position: "bottom-right" });
        setLoading(false);

        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select()
        .eq("user_id", sessionData.session?.user.id);

      if (userData) {
        const { data, error } = await supabase.from("patient").insert({
          blood_type: blood,
          height: form.get("height"),
          weight: form.get("weight"),
          is_smoking: isSmoking,
          allergies: form.get("allergies"),
          current_medication: form.get("medication"),
          med_freq_times: form.get("medicineQuantity"),
          med_freq_day: form.get("medicineFrequency"),
          illness_history: form.get("illnessHistory"),
          patient_id: userData[0].id
        });

        if (error) {
          return;
        }

        console.log("created");
        setLoading(false);
        setFinished(true);
      }
    }
  };

  return (
    <DefaultLayout>
      <ToastContainer />
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
          {searchParams.role === "Caregiver" && (
            <div className="flex items-center justify-start gap-1">
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-cancel font-medium text-white">
                4
              </h2>
              <h2>Review</h2>
            </div>
          )}
          <div className="flex items-center justify-start gap-1">
            <h2
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-gray-cancel font-medium text-white ${searchParams.role === "Caregiver" && "lg:ml-2"}`}
            >
              {searchParams.role === "Caregiver" ? 5 : 4}
            </h2>
            <h2>Finish</h2>
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-9 pt-3">
        {/* <!-- Sign In Form --> */}
        <div className="w-full min-w-[350px] rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:w-4/5 md:w-2/3 lg:w-11/12">
          {/* Header */}
          <div className="rounded-t-[10px] border-b border-stroke bg-kalbe-light px-6.5 py-4 dark:border-dark-3 ">
            <h3 className="text-center text-xl font-semibold text-white">
              Fill Your Personal Information
            </h3>
          </div>

          {/* Content */}
          <form action={addPersonalInfo}>
            {/* <form action={update}> */}
            <div className="p-6.5">
              {searchParams.role === "Patient" ? (
                // PATIENT'S FORM
                <div className="flex flex-col justify-center lg:flex-row">
                  {/* First and second div */}
                  <div className="flex flex-col justify-center gap-x-10 xl:flex-row">
                    <div className="w-full xl:max-w-[600px]">
                      <h1 className="mb-4.5 text-xl font-bold text-kalbe-light">
                        About You
                      </h1>
                      <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <DatePickerOne
                          customClasses="w-full xl:w-1/2"
                          label="Birthdate"
                          name="birthdate"
                          required
                        />
                        <SelectGroupTwo
                          name="gender"
                          label="Gender"
                          content={["Female", "Male"]}
                          customClasses="w-full xl:w-1/2"
                          required
                        />
                      </div>

                      <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                          name="address"
                          label="Address"
                          type="text"
                          placeholder="Street, Subdistrict, District/City, Province"
                          customClasses="w-full xl:w-1/2"
                          required
                        />

                        <div>
                          <label
                            className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                            htmlFor="bloodType"
                          >
                            Blood Type
                            <span className="ml-1 text-red">*</span>
                          </label>
                          <CheckboxBlood blood={blood} setBlood={setBlood} />
                        </div>
                      </div>

                      <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                          <label
                            className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                            htmlFor="phoneNumber"
                          >
                            Height & Weight
                            <span className="ml-1 text-red">*</span>
                          </label>
                          <div className="flex flex-row gap-3">
                            <div className="w-[240px]">
                              <div className="flex w-full items-center">
                                <input
                                  className="w-full rounded-l-md border border-gray-1 bg-white p-2 font-normal text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                  type="number"
                                  name="height"
                                  id="height"
                                  placeholder="Height"
                                  required
                                />
                                <span className="border-gray-r rounded-r-md border border-l-0 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
                                  cm
                                </span>
                              </div>
                            </div>
                            <div className="w-[240px]">
                              <div className="mb-3 flex w-full">
                                <input
                                  className="w-full rounded-l-md border border-gray-1 bg-white p-2 font-normal text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                  type="number"
                                  name="weight"
                                  id="weight"
                                  placeholder="Weight"
                                  required
                                />
                                <span className="border-gray-r rounded-r-md border border-l-0 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
                                  kg
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                            className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                            htmlFor="bloodType"
                          >
                            Are you a smoker?
                            <span className="ml-1 text-red">*</span>
                          </label>
                          <CheckboxSmoker
                            name="isSmoking"
                            isSmoking={isSmoking}
                            setIsSmoking={setIsSmoking}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vertical line */}
                    <div className="hidden h-[390px] w-[0.5px] bg-kalbe-light xl:block"></div>

                    <div className="w-full xl:max-w-[600px]">
                      <h1 className="mb-4.5 text-xl font-bold text-kalbe-light">
                        Your Health
                      </h1>
                      <InputGroup
                        name="allergies"
                        label="Allergies"
                        type="text"
                        placeholder="Enter your allergies"
                        customClasses="w-full mb-4.5"
                      />

                      <div>
                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                          {/* Current medication */}
                          <InputGroup
                            name="medication"
                            label="Medication"
                            type="text"
                            placeholder="E.g. Divask"
                            customClasses="w-full"
                          />

                          {/* Medication frequency */}
                          <div className="w-full xl:w-1/2">
                            <label
                              className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                              htmlFor="phoneNumber"
                            >
                              Medication Frequency
                              <span className="ml-1 text-red">*</span>
                            </label>
                            <div className="flex flex-row gap-3">
                              <div className="w-[240px] xl:w-[170px]">
                                <div className="flex w-full items-center">
                                  <input
                                    className="w-full rounded-l-md border border-gray-1 bg-white p-2 font-normal text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                    type="number"
                                    name="medicineQuantity"
                                    id="medicineQuantity"
                                    placeholder="0"
                                  />
                                  <span className="border-gray-r rounded-r-md border border-l-0 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
                                    qty
                                  </span>
                                </div>
                              </div>
                              <div className="w-[240px] xl:w-[170px]">
                                <div className="flex w-full items-center">
                                  <input
                                    className="w-full rounded-l-md border border-gray-1 bg-white p-2 font-normal text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                    type="number"
                                    name="medicineFrequency"
                                    id="medicineFrequency"
                                    placeholder="0"
                                  />
                                  <span className="border-gray-r rounded-r-md border border-l-0 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
                                    /day
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-6">
                          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Illness History{" "}
                            <span className="ml-1 text-red">*</span>
                          </label>
                          <textarea
                            name="illnessHistory"
                            rows={3}
                            required
                            placeholder="E.g. In 1995, I had chickenpox, and in 2002, I suffered a fractured left arm from a fall. I underwent an appendectomy in 2010. I was diagnosed with hypertension in 2018 and have been on Lisinopril 10mg daily since then"
                            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // CAREGIVER'S FORM
                <div className="flex flex-col justify-center">
                  {/* First and second div */}
                  <div className="flex flex-col justify-center gap-x-10 xl:flex-row">
                    <div className="w-full xl:max-w-[600px]">
                      <h1 className="mb-4.5 text-xl font-bold text-kalbe-light">
                        About You
                      </h1>
                      <div>
                        <label
                          className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                          htmlFor="profilePhoto"
                        >
                          Recent Profile Photo{" "}
                          <span className="ml-1 text-red">*</span>
                        </label>
                        <div
                          id="FileUpload"
                          className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray px-4 py-4 hover:border-kalbe-light hover:bg-kalbe-proLight dark:border-dark-3 dark:bg-dark-2 dark:hover:border-kalbe-light sm:py-7.5"
                        >
                          <input
                            type="file"
                            name="profilePhoto"
                            id="profilePhoto"
                            accept="image/png, image/jpg, image/jpeg"
                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                            onChange={(e) => {
                              e.preventDefault();
                              const profilePhotoFile = e.target.files![0];
                              setProfilePhoto(profilePhotoFile);
                            }}
                            required
                          />
                          <div className="flex flex-col items-center justify-center">
                            {profilePhoto ? (
                              <div className="flex items-center gap-5">
                                <Image
                                  src={URL.createObjectURL(profilePhoto)}
                                  alt={profilePhoto.name}
                                  className="h-[105px]"
                                  width={105}
                                  height={105}
                                />
                                <span className="mt-1 text-sm">
                                  {profilePhoto.name}
                                </span>
                              </div>
                            ) : (
                              <>
                                <span className="flex h-13.5 w-13.5 items-center justify-center rounded-full border border-kalbe-veryLight bg-white dark:border-kalbe-light dark:bg-gray-dark">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M10.4613 2.07827C10.3429 1.94876 10.1755 1.875 10 1.875C9.82453 1.875 9.65714 1.94876 9.53873 2.07827L6.2054 5.7241C5.97248 5.97885 5.99019 6.37419 6.24494 6.6071C6.49969 6.84002 6.89502 6.82232 7.12794 6.56756L9.375 4.10984V13.3333C9.375 13.6785 9.65482 13.9583 10 13.9583C10.3452 13.9583 10.625 13.6785 10.625 13.3333V4.10984L12.8721 6.56756C13.105 6.82232 13.5003 6.84002 13.7551 6.6071C14.0098 6.37419 14.0275 5.97885 13.7946 5.7241L10.4613 2.07827Z"
                                      fill="#1CBF90"
                                    />
                                    <path
                                      d="M3.125 12.5C3.125 12.1548 2.84518 11.875 2.5 11.875C2.15482 11.875 1.875 12.1548 1.875 12.5V12.5457C1.87498 13.6854 1.87497 14.604 1.9721 15.3265C2.07295 16.0765 2.2887 16.7081 2.79029 17.2097C3.29189 17.7113 3.92345 17.9271 4.67354 18.0279C5.39602 18.125 6.31462 18.125 7.45428 18.125H12.5457C13.6854 18.125 14.604 18.125 15.3265 18.0279C16.0766 17.9271 16.7081 17.7113 17.2097 17.2097C17.7113 16.7081 17.9271 16.0765 18.0279 15.3265C18.125 14.604 18.125 13.6854 18.125 12.5457V12.5C18.125 12.1548 17.8452 11.875 17.5 11.875C17.1548 11.875 16.875 12.1548 16.875 12.5C16.875 13.6962 16.8737 14.5304 16.789 15.1599C16.7068 15.7714 16.5565 16.0952 16.3258 16.3258C16.0952 16.5565 15.7714 16.7068 15.1599 16.789C14.5304 16.8737 13.6962 16.875 12.5 16.875H7.5C6.30382 16.875 5.46956 16.8737 4.8401 16.789C4.22862 16.7068 3.90481 16.5565 3.67418 16.3258C3.44354 16.0952 3.29317 15.7714 3.21096 15.1599C3.12633 14.5304 3.125 13.6962 3.125 12.5Z"
                                      fill="#1CBF90"
                                    />
                                  </svg>
                                </span>
                                <p className="mt-2.5 text-body-sm font-medium text-primary">
                                  Click or drag and drop here to upload file
                                </p>
                                <p className="mt-1 text-body-xs">JPG or PNG</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <DatePickerOne
                          name="birthdate"
                          customClasses="w-full xl:w-1/2"
                          label="Birthdate"
                          required
                        />
                        <SelectGroupTwo
                          name="gender"
                          label="Gender"
                          content={["Female", "Male"]}
                          customClasses="w-full xl:w-1/2"
                          required
                        />
                      </div>

                      <InputGroup
                        name="currentLocation"
                        label="Current Location"
                        type="text"
                        placeholder="Street, Subdistrict, District/City, Province"
                        customClasses="mb-4.5"
                        required
                      />
                    </div>

                    {/* Vertical line */}
                    <div className="h-120 hidden w-[0.5px] bg-kalbe-light xl:block"></div>

                    {/* Right Side */}
                    <div className="w-full xl:max-w-[600px]">
                      <h1 className="mb-4.5 text-xl font-bold text-kalbe-light">
                        Working Experiences
                      </h1>

                      <div className="mb-5.5 flex flex-col gap-4.5 xl:flex-row">
                        <SelectGroupTwo
                          name="role"
                          label="I'm a"
                          content={["Nurse", "Midwife"]}
                          customClasses="w-full xl:w-1/2"
                          required
                        />
                        <SelectGroupTwo
                          name="employmentType"
                          label="Employment Type"
                          content={["Full-time", "Part-time"]}
                          customClasses="w-full xl:w-1/2"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                          name="workplace"
                          label="Workplace"
                          type="text"
                          placeholder="Enter your workplace"
                          customClasses="w-full xl:w-1/2"
                          required
                        />
                        <div className="w-full xl:w-1/2">
                          <label
                            className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                            htmlFor="workExperiences"
                          >
                            Work Experiences
                            <span className="ml-1 text-red">*</span>
                          </label>
                          <div className="flex w-full items-center">
                            <input
                              className="w-full rounded-l-[7px] border-[1.5px] border-stroke bg-transparent px-3 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                              type="number"
                              name="workExperiences"
                              id="workExperiences"
                              placeholder="0"
                              required
                            />
                            <label className="rounded-r-md border border-l-0 border-gray-1 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
                              year
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5.5">
                        <label
                          className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                          htmlFor="CVDocument"
                        >
                          Submit Your CV{" "}
                          <span className="ml-1 text-red">*</span>
                        </label>
                        <div
                          id="FileUpload"
                          className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray px-4 py-4 hover:border-kalbe-light hover:bg-kalbe-proLight dark:border-dark-3 dark:bg-dark-2 dark:hover:border-kalbe-light sm:py-7.5"
                        >
                          <input
                            type="file"
                            name="CVDocument"
                            id="CVDocument"
                            accept="image/png, image/jpg, image/jpeg, application/pdf"
                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                            onChange={(e) => {
                              e.preventDefault();
                              const cvDocumentFile = e.target.files![0];
                              setCv(cvDocumentFile);
                            }}
                            required
                          />
                          {cv ? (
                            <div className="flex h-[105px] items-center justify-center ">
                              <span>{cv.name}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              <span className="flex h-13.5 w-13.5 items-center justify-center rounded-full border border-kalbe-veryLight bg-white dark:border-kalbe-light dark:bg-gray-dark">
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M10.4613 2.07827C10.3429 1.94876 10.1755 1.875 10 1.875C9.82453 1.875 9.65714 1.94876 9.53873 2.07827L6.2054 5.7241C5.97248 5.97885 5.99019 6.37419 6.24494 6.6071C6.49969 6.84002 6.89502 6.82232 7.12794 6.56756L9.375 4.10984V13.3333C9.375 13.6785 9.65482 13.9583 10 13.9583C10.3452 13.9583 10.625 13.6785 10.625 13.3333V4.10984L12.8721 6.56756C13.105 6.82232 13.5003 6.84002 13.7551 6.6071C14.0098 6.37419 14.0275 5.97885 13.7946 5.7241L10.4613 2.07827Z"
                                    fill="#1CBF90"
                                  />
                                  <path
                                    d="M3.125 12.5C3.125 12.1548 2.84518 11.875 2.5 11.875C2.15482 11.875 1.875 12.1548 1.875 12.5V12.5457C1.87498 13.6854 1.87497 14.604 1.9721 15.3265C2.07295 16.0765 2.2887 16.7081 2.79029 17.2097C3.29189 17.7113 3.92345 17.9271 4.67354 18.0279C5.39602 18.125 6.31462 18.125 7.45428 18.125H12.5457C13.6854 18.125 14.604 18.125 15.3265 18.0279C16.0766 17.9271 16.7081 17.7113 17.2097 17.2097C17.7113 16.7081 17.9271 16.0765 18.0279 15.3265C18.125 14.604 18.125 13.6854 18.125 12.5457V12.5C18.125 12.1548 17.8452 11.875 17.5 11.875C17.1548 11.875 16.875 12.1548 16.875 12.5C16.875 13.6962 16.8737 14.5304 16.789 15.1599C16.7068 15.7714 16.5565 16.0952 16.3258 16.3258C16.0952 16.5565 15.7714 16.7068 15.1599 16.789C14.5304 16.8737 13.6962 16.875 12.5 16.875H7.5C6.30382 16.875 5.46956 16.8737 4.8401 16.789C4.22862 16.7068 3.90481 16.5565 3.67418 16.3258C3.44354 16.0952 3.29317 15.7714 3.21096 15.1599C3.12633 14.5304 3.125 13.6962 3.125 12.5Z"
                                    fill="#1CBF90"
                                  />
                                </svg>
                              </span>
                              <p className="mt-2.5 text-body-sm font-medium text-primary">
                                {/* <span className="text-primary">
                                Click here to upload
                              </span>{" "} */}
                                Click or drag and drop here to upload file
                                {/* or drag and drop */}
                              </p>
                              <p className="mt-1 text-body-xs">
                                JPG, PNG, or PDF
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h1 className="mb-4.5 text-xl font-bold text-kalbe-light">
                    About You
                  </h1>
                  <div className="flex flex-col justify-between gap-x-10 xl:flex-row">
                    <div className="w-full xl:w-1/3">
                      <label
                        className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                        htmlFor="degreeSertificate"
                      >
                        Degree Sertificate{" "}
                        <span className="ml-1 text-red">*</span>
                      </label>
                      <div
                        id="FileUpload"
                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray px-4 py-4 hover:border-kalbe-light hover:bg-kalbe-proLight dark:border-dark-3 dark:bg-dark-2 dark:hover:border-kalbe-light sm:py-7.5"
                      >
                        <input
                          type="file"
                          name="degreeSertificate"
                          id="degreeSertificate"
                          accept="image/png, image/jpg, image/jpeg, application/pdf"
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                          onChange={(e) => {
                            e.preventDefault();
                            const degreeFile = e.target.files![0];
                            setCertificate(degreeFile);
                          }}
                          required
                        />
                        {certificate ? (
                          <div className="flex h-[105px] items-center justify-center ">
                            <span>{certificate.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <span className="flex h-13.5 w-13.5 items-center justify-center rounded-full border border-kalbe-veryLight bg-white dark:border-kalbe-light dark:bg-gray-dark">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.4613 2.07827C10.3429 1.94876 10.1755 1.875 10 1.875C9.82453 1.875 9.65714 1.94876 9.53873 2.07827L6.2054 5.7241C5.97248 5.97885 5.99019 6.37419 6.24494 6.6071C6.49969 6.84002 6.89502 6.82232 7.12794 6.56756L9.375 4.10984V13.3333C9.375 13.6785 9.65482 13.9583 10 13.9583C10.3452 13.9583 10.625 13.6785 10.625 13.3333V4.10984L12.8721 6.56756C13.105 6.82232 13.5003 6.84002 13.7551 6.6071C14.0098 6.37419 14.0275 5.97885 13.7946 5.7241L10.4613 2.07827Z"
                                  fill="#1CBF90"
                                />
                                <path
                                  d="M3.125 12.5C3.125 12.1548 2.84518 11.875 2.5 11.875C2.15482 11.875 1.875 12.1548 1.875 12.5V12.5457C1.87498 13.6854 1.87497 14.604 1.9721 15.3265C2.07295 16.0765 2.2887 16.7081 2.79029 17.2097C3.29189 17.7113 3.92345 17.9271 4.67354 18.0279C5.39602 18.125 6.31462 18.125 7.45428 18.125H12.5457C13.6854 18.125 14.604 18.125 15.3265 18.0279C16.0766 17.9271 16.7081 17.7113 17.2097 17.2097C17.7113 16.7081 17.9271 16.0765 18.0279 15.3265C18.125 14.604 18.125 13.6854 18.125 12.5457V12.5C18.125 12.1548 17.8452 11.875 17.5 11.875C17.1548 11.875 16.875 12.1548 16.875 12.5C16.875 13.6962 16.8737 14.5304 16.789 15.1599C16.7068 15.7714 16.5565 16.0952 16.3258 16.3258C16.0952 16.5565 15.7714 16.7068 15.1599 16.789C14.5304 16.8737 13.6962 16.875 12.5 16.875H7.5C6.30382 16.875 5.46956 16.8737 4.8401 16.789C4.22862 16.7068 3.90481 16.5565 3.67418 16.3258C3.44354 16.0952 3.29317 15.7714 3.21096 15.1599C3.12633 14.5304 3.125 13.6962 3.125 12.5Z"
                                  fill="#1CBF90"
                                />
                              </svg>
                            </span>
                            <p className="mt-2.5 text-body-sm font-medium text-primary">
                              {/* <span className="text-primary">
                                Click here to upload
                              </span>{" "} */}
                              Click or drag and drop here to upload file
                              {/* or drag and drop */}
                            </p>
                            <p className="mt-1 text-body-xs">
                              JPG, PNG, or PDF
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full xl:w-1/3">
                      <label
                        className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                        htmlFor="STRDocument"
                      >
                        STR <span className="ml-1 text-red">*</span>
                      </label>
                      <div
                        id="FileUpload"
                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray px-4 py-4 hover:border-kalbe-light hover:bg-kalbe-proLight dark:border-dark-3 dark:bg-dark-2 dark:hover:border-kalbe-light sm:py-7.5"
                      >
                        <input
                          type="file"
                          name="STRDocument"
                          id="STRDocument"
                          accept="image/png, image/jpg, image/jpeg, application/pdf"
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                          onChange={(e) => {
                            e.preventDefault();
                            const strFile = e.target.files![0];
                            setStr(strFile);
                          }}
                          required
                        />
                        {str ? (
                          <div className="flex h-[105px] items-center justify-center ">
                            <span>{str.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <span className="flex h-13.5 w-13.5 items-center justify-center rounded-full border border-kalbe-veryLight bg-white dark:border-kalbe-light dark:bg-gray-dark">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.4613 2.07827C10.3429 1.94876 10.1755 1.875 10 1.875C9.82453 1.875 9.65714 1.94876 9.53873 2.07827L6.2054 5.7241C5.97248 5.97885 5.99019 6.37419 6.24494 6.6071C6.49969 6.84002 6.89502 6.82232 7.12794 6.56756L9.375 4.10984V13.3333C9.375 13.6785 9.65482 13.9583 10 13.9583C10.3452 13.9583 10.625 13.6785 10.625 13.3333V4.10984L12.8721 6.56756C13.105 6.82232 13.5003 6.84002 13.7551 6.6071C14.0098 6.37419 14.0275 5.97885 13.7946 5.7241L10.4613 2.07827Z"
                                  fill="#1CBF90"
                                />
                                <path
                                  d="M3.125 12.5C3.125 12.1548 2.84518 11.875 2.5 11.875C2.15482 11.875 1.875 12.1548 1.875 12.5V12.5457C1.87498 13.6854 1.87497 14.604 1.9721 15.3265C2.07295 16.0765 2.2887 16.7081 2.79029 17.2097C3.29189 17.7113 3.92345 17.9271 4.67354 18.0279C5.39602 18.125 6.31462 18.125 7.45428 18.125H12.5457C13.6854 18.125 14.604 18.125 15.3265 18.0279C16.0766 17.9271 16.7081 17.7113 17.2097 17.2097C17.7113 16.7081 17.9271 16.0765 18.0279 15.3265C18.125 14.604 18.125 13.6854 18.125 12.5457V12.5C18.125 12.1548 17.8452 11.875 17.5 11.875C17.1548 11.875 16.875 12.1548 16.875 12.5C16.875 13.6962 16.8737 14.5304 16.789 15.1599C16.7068 15.7714 16.5565 16.0952 16.3258 16.3258C16.0952 16.5565 15.7714 16.7068 15.1599 16.789C14.5304 16.8737 13.6962 16.875 12.5 16.875H7.5C6.30382 16.875 5.46956 16.8737 4.8401 16.789C4.22862 16.7068 3.90481 16.5565 3.67418 16.3258C3.44354 16.0952 3.29317 15.7714 3.21096 15.1599C3.12633 14.5304 3.125 13.6962 3.125 12.5Z"
                                  fill="#1CBF90"
                                />
                              </svg>
                            </span>
                            <p className="mt-2.5 text-body-sm font-medium text-primary">
                              {/* <span className="text-primary">
                                Click here to upload
                              </span>{" "} */}
                              Click or drag and drop here to upload file
                              {/* or drag and drop */}
                            </p>
                            <p className="mt-1 text-body-xs">
                              JPG, PNG, or PDF
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full xl:w-1/3">
                      <label
                        className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                        htmlFor="SIPDocument"
                      >
                        SIP <span className="ml-1 text-red">*</span>
                      </label>
                      <div
                        id="FileUpload"
                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray px-4 py-4 hover:border-kalbe-light hover:bg-kalbe-proLight dark:border-dark-3 dark:bg-dark-2 dark:hover:border-kalbe-light sm:py-7.5"
                      >
                        <input
                          type="file"
                          name="SIPDocument"
                          id="SIPDocument"
                          accept="image/png, image/jpg, image/jpeg, application/pdf"
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                          onChange={(e) => {
                            e.preventDefault();
                            const sipFile = e.target.files![0];
                            setSip(sipFile);
                          }}
                          required
                        />
                        {sip ? (
                          <div className="flex h-[105px] items-center justify-center ">
                            <span>{sip.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <span className="flex h-13.5 w-13.5 items-center justify-center rounded-full border border-kalbe-veryLight bg-white dark:border-kalbe-light dark:bg-gray-dark">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.4613 2.07827C10.3429 1.94876 10.1755 1.875 10 1.875C9.82453 1.875 9.65714 1.94876 9.53873 2.07827L6.2054 5.7241C5.97248 5.97885 5.99019 6.37419 6.24494 6.6071C6.49969 6.84002 6.89502 6.82232 7.12794 6.56756L9.375 4.10984V13.3333C9.375 13.6785 9.65482 13.9583 10 13.9583C10.3452 13.9583 10.625 13.6785 10.625 13.3333V4.10984L12.8721 6.56756C13.105 6.82232 13.5003 6.84002 13.7551 6.6071C14.0098 6.37419 14.0275 5.97885 13.7946 5.7241L10.4613 2.07827Z"
                                  fill="#1CBF90"
                                />
                                <path
                                  d="M3.125 12.5C3.125 12.1548 2.84518 11.875 2.5 11.875C2.15482 11.875 1.875 12.1548 1.875 12.5V12.5457C1.87498 13.6854 1.87497 14.604 1.9721 15.3265C2.07295 16.0765 2.2887 16.7081 2.79029 17.2097C3.29189 17.7113 3.92345 17.9271 4.67354 18.0279C5.39602 18.125 6.31462 18.125 7.45428 18.125H12.5457C13.6854 18.125 14.604 18.125 15.3265 18.0279C16.0766 17.9271 16.7081 17.7113 17.2097 17.2097C17.7113 16.7081 17.9271 16.0765 18.0279 15.3265C18.125 14.604 18.125 13.6854 18.125 12.5457V12.5C18.125 12.1548 17.8452 11.875 17.5 11.875C17.1548 11.875 16.875 12.1548 16.875 12.5C16.875 13.6962 16.8737 14.5304 16.789 15.1599C16.7068 15.7714 16.5565 16.0952 16.3258 16.3258C16.0952 16.5565 15.7714 16.7068 15.1599 16.789C14.5304 16.8737 13.6962 16.875 12.5 16.875H7.5C6.30382 16.875 5.46956 16.8737 4.8401 16.789C4.22862 16.7068 3.90481 16.5565 3.67418 16.3258C3.44354 16.0952 3.29317 15.7714 3.21096 15.1599C3.12633 14.5304 3.125 13.6962 3.125 12.5Z"
                                  fill="#1CBF90"
                                />
                              </svg>
                            </span>
                            <p className="mt-2.5 text-body-sm font-medium text-primary">
                              {/* <span className="text-primary">
                                Click here to upload
                              </span>{" "} */}
                              Click or drag and drop here to upload file
                              {/* or drag and drop */}
                            </p>
                            <p className="mt-1 text-body-xs">
                              JPG, PNG, or PDF
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Third div for finish button */}
              <div className="mt-5.5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="w-1/4 rounded-[7px] border border-gray-cancel bg-gray-cancel p-[8px] font-medium text-white hover:bg-gray-cancel-hover hover:text-gray-cancel lg:ml-4 lg:w-[10%]"
                >
                  Cancel
                </button>
                {loading ? (
                  <>
                    <button
                      disabled
                      type="button"
                      className="inline-flex w-1/4 items-center justify-center rounded-[7px] bg-primary py-2.5 text-center text-sm font-medium text-white hover:bg-opacity-90 focus:ring-kalbe-light lg:w-[10%]"
                    >
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline h-4 w-4 animate-spin text-white lg:me-3"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      {window.screen.width > 1000 ? "Loading..." : ""}
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="w-1/4 rounded-[7px] border border-primary bg-primary p-[8px] font-medium text-white hover:bg-kalbe-ultraLight hover:text-primary lg:w-[10%]"
                  >
                    Finish
                  </button>
                )}
              </div>

              <p className="mt-3 text-center text-body-sm">
                Already have an account?{" "}
                <span>
                  <Link href="signup" className="text-primary hover:underline">
                    Sign in instead
                  </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
      <AxolotlModal
        isOpen={openCancelModal}
        onClose={handleCloseModal}
        onConfirm={confirmCancelRegistration}
        title="Cancel Registration"
        question={`Are you sure you want to cancel your registration? This action cannot be undone.`}
        action="cancel"
      />
      {searchParams.role != null && finished && (
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
                    if (searchParams.role == "Patient") {
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
      )}
    </DefaultLayout>
  );
};

export default PersonalInformation;
