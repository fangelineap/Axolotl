"use client";

import CheckboxBlood from "@/components/Axolotl/CheckboxBlood";
import CheckboxSmoker from "@/components/Axolotl/CheckboxSmoker";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import InputGroup from "@/components/FormElements/InputGroup";
import SelectGroupTwo from "@/components/FormElements/SelectGroup/SelectGroupTwo";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import React from "react";

const PersonalInformation = ({ searchParams }: any) => {
  console.log("Roleeeee:", searchParams.role);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Personal Information Form" />
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
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-gray-secondary font-medium text-white">
                4
              </h2>
              <h2>Review</h2>
            </div>
          )}
          <div className="flex items-center justify-start gap-1">
            <h2
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-gray-secondary font-medium text-white ${searchParams.role === "Caregiver" && 'lg:ml-2'}`}
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
          <form action="#">
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
                        />
                        <SelectGroupTwo
                          label="Gender"
                          content={["Female", "Male"]}
                          customClasses="w-full xl:w-1/2"
                          required
                        />
                      </div>

                      <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
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
                            Blood Type<span className="ml-1 text-red">*</span>
                          </label>
                          <CheckboxBlood />
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
                            <div className="relative w-[240px]">
                              <span className="absolute right-[1px] top-[1px] rounded-br-[7px] rounded-tr-[7px] bg-slate-300 p-[12.2px]">
                                cm
                              </span>
                              <input
                                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent py-3 pl-5.5 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                type="number"
                                name="height"
                                id="height"
                                placeholder="Height"
                              />
                            </div>
                            <div className="relative w-[240px]">
                              <input
                                className="relative w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent py-3 pl-5.5 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                type="number"
                                name="weight"
                                id="weight"
                                placeholder="Weight"
                              />
                              <span className="absolute right-[0.5px] top-[1px] rounded-br-[7px] rounded-tr-[7px] bg-slate-300 p-[12.2px]">
                                kg
                              </span>
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
                          <CheckboxSmoker />
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
                        label="Allergies"
                        type="text"
                        placeholder="Enter your allergies"
                        customClasses="w-full mb-4.5"
                        required
                      />

                      <div>
                        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                          {/* Current medication */}
                          <InputGroup
                            label="Medication"
                            type="text"
                            placeholder="E.g. Divask"
                            customClasses="w-full"
                            required
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
                              <div className="relative w-[240px] xl:w-[170px]">
                                <span className="absolute right-[0.5px] top-[1px] rounded-br-[7px] rounded-tr-[7px] bg-slate-300 p-[12.1px]">
                                  qty
                                </span>
                                <input
                                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent py-3 pl-5.5 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                  type="number"
                                  name="medicineQuantity"
                                  id="medicineQuantity"
                                  placeholder="0"
                                />
                              </div>
                              <div className="relative w-[240px] xl:w-[170px]">
                                <input
                                  className="relative w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent py-3 pl-5.5 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                  type="number"
                                  name="medicineFrequency"
                                  id="medicineFrequency"
                                  placeholder="0"
                                />
                                <span className="absolute right-[0.5px] top-[1px] rounded-br-[7px] rounded-tr-[7px] bg-slate-300 p-[12.1px]">
                                  /day
                                </span>
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
                            rows={3}
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
                          className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-kalbe-light hover:bg-kalbe-proLight dark:border-dark-3 dark:bg-dark-2 dark:hover:border-kalbe-light sm:py-7.5"
                        >
                          <input
                            type="file"
                            name="profilePhoto"
                            id="profilePhoto"
                            accept="image/png, image/jpg, image/jpeg"
                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                          />
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
                            <p className="mt-1 text-body-xs">JPG or PNG</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <DatePickerOne
                          customClasses="w-full xl:w-1/2"
                          label="Birthdate"
                          required
                        />
                        <SelectGroupTwo
                          label="Gender"
                          content={["Female", "Male"]}
                          customClasses="w-full xl:w-1/2"
                          required
                        />
                      </div>

                      <InputGroup
                        label="Current Location"
                        type="text"
                        placeholder="Street, Subdistrict, District/City, Province"
                        customClasses="mb-4.5"
                        required
                      />
                    </div>

                    {/* Vertical line */}
                    <div className="hidden h-120 w-[0.5px] bg-kalbe-light xl:block"></div>

                    <div className="w-full xl:max-w-[600px]">
                      <h1 className="mb-4.5 text-xl font-bold text-kalbe-light">
                        Working Experiences
                      </h1>

                      <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <SelectGroupTwo
                          label="I'm a"
                          content={["Nurse", "Midwife"]}
                          customClasses="w-full xl:w-1/2"
                          required
                        />
                        <SelectGroupTwo
                          label="Employment Type"
                          content={["Full-time", "Part-time"]}
                          customClasses="w-full xl:w-1/2"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
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
                          <div className="relative w-full">
                            <span className="absolute right-[0.5px] top-[1px] rounded-br-[7px] rounded-tr-[7px] bg-slate-300 p-[12.1px]">
                              year
                            </span>
                            <input
                              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent py-3 pl-5.5 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                              type="number"
                              name="workExperiences"
                              id="workExperiences"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4.5">
                        <label
                          className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                          htmlFor="CVDocument"
                        >
                          Submit Your CV{" "}
                          <span className="ml-1 text-red">*</span>
                        </label>
                        <div
                          id="FileUpload"
                          className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-kalbe-light hover:bg-kalbe-proLight dark:border-dark-3 dark:bg-dark-2 dark:hover:border-kalbe-light sm:py-7.5"
                        >
                          <input
                            type="file"
                            name="CVDocument"
                            id="CVDocument"
                            accept="image/png, image/jpg, image/jpeg, application/pdf"
                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                          />
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
                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-kalbe-light hover:bg-kalbe-proLight dark:border-dark-3 dark:bg-dark-2 dark:hover:border-kalbe-light sm:py-7.5"
                      >
                        <input
                          type="file"
                          name="degreeSertificate"
                          id="degreeSertificate"
                          accept="image/png, image/jpg, image/jpeg, application/pdf"
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        />
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
                          <p className="mt-1 text-body-xs">JPG, PNG, or PDF</p>
                        </div>
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
                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-kalbe-light hover:bg-kalbe-proLight dark:border-dark-3 dark:bg-dark-2 dark:hover:border-kalbe-light sm:py-7.5"
                      >
                        <input
                          type="file"
                          name="STRDocument"
                          id="STRDocument"
                          accept="image/png, image/jpg, image/jpeg, application/pdf"
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        />
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
                          <p className="mt-1 text-body-xs">JPG, PNG, or PDF</p>
                        </div>
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
                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-kalbe-light hover:bg-kalbe-proLight dark:border-dark-3 dark:bg-dark-2 dark:hover:border-kalbe-light sm:py-7.5"
                      >
                        <input
                          type="file"
                          name="SIPDocument"
                          id="SIPDocument"
                          accept="image/png, image/jpg, image/jpeg, application/pdf"
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        />
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
                          <p className="mt-1 text-body-xs">JPG, PNG, or PDF</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Third div for finish button */}
              <div className="mt-5.5 flex items-center justify-center gap-3">
                <button className="w-1/4 rounded-[7px] bg-kalbe-gray-secondary p-[8px] font-medium text-white hover:bg-opacity-90 lg:ml-4 lg:w-[10%]">
                  Back
                </button>
                <button className="w-1/4 rounded-[7px] bg-primary p-[8px] font-medium text-white hover:bg-opacity-90 lg:w-[10%]">
                  Finish
                </button>
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
    </DefaultLayout>
  );
};

export default PersonalInformation;
