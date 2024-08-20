"use client";

import Accordion from "@/components/Axolotl/Accordion";
import DisabledLabel from "@/components/Axolotl/DisabledLabel";
import SelectHorizontal from "@/components/Axolotl/SelectHorizontal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  IconCircleMinus,
  IconCirclePlus,
  IconCirclePlusFilled,
  IconCircleX,
  IconCircleXFilled,
  IconX,
} from "@tabler/icons-react";
import React, { useState } from "react";

const PlacingOrder = () => {
  const [concern, setConcern] = useState<string>("");
  const [selectedAll, setSelectedAll] = useState<string[]>([]);
  const [days, setDays] = useState<number>(0);

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center">
        {/* Stepper */}
        <div className="mb-3.5 flex items-center justify-center">
          <div className="grid min-w-[350px] grid-cols-2 gap-4 gap-x-10 lg:flex lg:gap-7">
            <div className="flex items-center justify-start gap-1">
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
                1
              </h2>
              <h2>Place an Order</h2>
            </div>
            <div className="flex items-center justify-start gap-1">
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-cancel font-medium text-white">
                2
              </h2>
              <h2>Conjecture</h2>
            </div>
            <div className="flex items-center justify-start gap-1">
              <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-cancel font-medium text-white">
                3
              </h2>
              <h2>Additional</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 flex h-[100%] w-[85%] flex-col justify-between lg:flex-row">
          {/* Left Side */}
          <div className="w-[100%] p-3 lg:mr-7 lg:w-[65%]">
            <h1 className="mb-5 text-2xl font-bold">Place Your Order</h1>
            {/* Patient Information Section */}
            <>
              <h1 className="mb-2 text-lg font-semibold">
                Patient Information
              </h1>
              <div>
                <DisabledLabel
                  label="Patient Name"
                  horizontal
                  placeholder="Lemon Meringue"
                  type="text"
                  key={"patient-name"}
                />
                <DisabledLabel
                  label="Address"
                  horizontal
                  placeholder="Jl. Pundung Raya No. 1"
                  type="text"
                  key={"patient-address"}
                />
                <DisabledLabel
                  label="Phone Number"
                  horizontal
                  placeholder="0812223334445"
                  type="text"
                  key={"patient-phone-number"}
                />
                <DisabledLabel
                  label="Birthdate"
                  horizontal
                  placeholder="30/02/2003"
                  type="text"
                  key={"patient-birthdate"}
                />
              </div>
            </>

            {/* Order Details */}
            <>
              <h1 className="mb-2 mt-7 text-lg font-semibold">Order Details</h1>
              <div>
                <DisabledLabel
                  label="Service Type"
                  horizontal
                  placeholder="After Care"
                  type="text"
                  key={"service-type"}
                />
                {/* <div className="flex justify-between gap-3"> */}
                <h1 className="font-medium text-dark dark:text-white">
                  Service Description:
                </h1>
                <p className="w-[75%]">Service desc for after care</p>
                {/* </div> */}
              </div>
            </>

            {/* Medical Concerns */}
            <>
              <h1 className="mb-2 mt-7 text-lg font-semibold">
                Medical Concerns
              </h1>
              <div>
                <div className="mb-3 flex items-center justify-between gap-5">
                  <label className="mb-3 block font-medium text-dark dark:text-white">
                    Causes <span className="ml-1 text-red">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Causes"
                    className="w-[75%] rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>
                <SelectHorizontal
                  label="Main Concerns"
                  placeholder="Choose your concern"
                  required
                  options={[
                    "Wound treatment",
                    "Comorbidities treatment",
                    "Patient with disability",
                  ]}
                  isOptionSelected={false}
                  name="main-concerns"
                  setSelectedOption={setConcern}
                  selectedOption={concern}
                />
                <div className="mb-3 flex items-center justify-between gap-5">
                  <label className="mb-3 block font-medium text-dark dark:text-white">
                    Current Medication <span className="ml-1 text-red">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your current medication (separated by ',')"
                    className="w-[75%] rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-3 block font-medium text-dark dark:text-white">
                    Describe Your Current Conditions{" "}
                    <span className="ml-1 text-red">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
              </div>
            </>

            {/* Symptoms */}
            <div>
              <h1 className="mb-2 mt-7 text-lg font-semibold">
                Add Symtoms That Match Your Condition
              </h1>
              <div className="mb-3 grid grid-flow-row grid-cols-4 gap-2">
                {selectedAll.map((selected, index) => (
                  <div className="flex items-center justify-between gap-2 rounded-full border-2 border-primary bg-white px-2 py-1 text-primary">
                    <h1 className="font-medium">{selected}</h1>
                    <button
                      onClick={() => {
                        setSelectedAll((prev: string[]) =>
                          prev.filter((item) => item !== selected),
                        );
                      }}
                    >
                      <IconCircleXFilled size={33} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-2 rounded-full border-2 border-primary bg-white px-2 py-1 text-primary">
                  <h1 className="font-medium">Add Symptom</h1>
                  <button>
                    <IconCirclePlusFilled size={33} />
                  </button>
                </div>
              </div>
              <div>
                <Accordion
                  type="General Symptoms"
                  symptoms={[
                    "sakit pinggang",
                    "sakit punggung",
                    "sakit hati",
                    "sakit gigi",
                    "sakit kepala",
                    "sakit perut",
                  ]}
                  selectedAll={selectedAll}
                  setSelectedAll={setSelectedAll}
                />
                <Accordion
                  type="Skin Symptoms"
                  symptoms={["gatal?", "kesemutan?", "cihuy"]}
                  selectedAll={selectedAll}
                  setSelectedAll={setSelectedAll}
                />
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-[100%] border-stroke lg:w-[35%]">
            <div className="rounded-md border-[1px] border-stroke bg-white py-2">
              <div className="p-3">
                <h1 className="text-center text-lg font-bold text-primary">
                  Order Summary
                </h1>
              </div>
              <div className="px-5 py-2">
                <div className="flex items-center rounded-md border-[1px] border-stroke p-3 gap-3 my-3">
                  <img
                    src="/images/user/caregiver.png"
                    height={60}
                    width={60}
                    className="rounded-full bg-kalbe-veryLight"
                    alt="CG pfp"
                  />
                  <h1>Strawberry Shortcake, A.Md.Kep.</h1>
                </div>
                <DisabledLabel
                  horizontal={false}
                  label="Service Type"
                  type="text"
                  value="After Care"
                />
                <DisabledLabel
                  horizontal={false}
                  label="Service For"
                  type="text"
                  value="Wound Treatment"
                />
                <div>
                  <label className="font-medium text-dark dark:text-white">
                    Days of Visit
                  </label>
                  <div className="my-2 flex justify-between rounded-full border-[1px] border-stroke p-2 text-primary">
                    <button
                      onClick={() => {
                        if (days > 0) {
                          setDays(days - 1);
                        }
                      }}
                    >
                      <IconCircleMinus size={30} />
                    </button>
                    <h1 className="text-lg text-black">{days}</h1>
                    <button onClick={() => setDays(days + 1)}>
                      <IconCirclePlus size={30} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-between px-5 py-3">
                <h1 className="text-lg font-semibold">Sub Total: </h1>
                <h1 className="text-lg font-extrabold">Rp.1.500.000</h1>
              </div>
              <div className="flex w-full justify-center px-5">
                <button
                  type="button"
                  className="mb-5 w-full rounded-sm bg-primary p-[8px] font-medium text-white hover:bg-opacity-90"
                >
                  Pay
                </button>
              </div>
            </div>
          </div>
          <div className=""></div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PlacingOrder;
