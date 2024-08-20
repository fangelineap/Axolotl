"use client";

import Select from "@/components/Axolotl/Select";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState } from "react";

const OrderCaregiver = () => {
  const [time, setTime] = useState<string>("");
  const [service, setService] = useState<string>("");

  return (
    <DefaultLayout>
      <div className="flex justify-center">
        <div className="mt-6 flex h-[100%] w-[85%] flex-col justify-between gap-7 lg:flex-row">
          <div className="p-3 lg:w-[65%]">
            <div className="flex items-start gap-10">
              <img
                src="/images/user/caregiver.png"
                height={100}
                width={100}
                className="rounded-full bg-kalbe-veryLight"
                alt="CG pfp"
              />
              <div className="w-[50%]">
                <h1 className="text-lg font-extrabold">
                  Strawberry Shortcake, A.Md.Kep.
                </h1>
                <h1 className="mb-2 text-dark-secondary">
                  Nurse at RS Axolotl Malang, Malang City, East Java
                </h1>
                <div className="flex justify-between rounded-md border border-primary bg-kalbe-proLight p-2">
                  <div>
                    <h1 className="mb-2 font-semibold text-primary">
                      Work Schedule
                    </h1>
                    <div className="mb-1 flex gap-2">
                      <img
                        src="/images/icon/icon-calendar-patient.svg"
                        height={24}
                        width={24}
                        alt=""
                      />
                      <h1>Monday - Saturday</h1>
                    </div>
                    <div className="flex gap-2">
                      <img
                        src="/images/icon/icon-clock-outline.svg"
                        height={24}
                        width={24}
                        alt=""
                      />
                      <h1>18.30 - 20.30</h1>
                    </div>
                  </div>
                  <img
                    src="/images/icon/icon-done-outlined.svg"
                    height={70}
                    width={70}
                    className="p-3"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="my-7 h-[0.5px] w-[100%] bg-primary"></div>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-lg font-extrabold">About</h1>
              <div className="flex items-start gap-3">
                <img
                  src="/images/icon/education-outline.svg"
                  height={35}
                  width={35}
                  alt="Alumni Logo"
                />
                <div className="flex flex-col">
                  <h1 className="font-semibold">Alumni</h1>
                  <h1 className="text-dark-secondary">
                    Universitas Indonesia, 2010
                  </h1>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img
                  src="/images/icon/icon-building.svg"
                  height={35}
                  width={35}
                  alt="Alumni Logo"
                />
                <div className="flex flex-col">
                  <h1 className="font-semibold">Work Location</h1>
                  <h1 className="text-dark-secondary">
                    Universitas Indonesia, 2010
                  </h1>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img
                  src="/images/icon/icon-id-card-outline.svg"
                  height={35}
                  width={35}
                  alt="Alumni Logo"
                />
                <div className="flex flex-col">
                  <h1 className="font-semibold">STR Number</h1>
                  <h1 className="text-dark-secondary">
                    Universitas Indonesia, 2010
                  </h1>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img
                  src="/images/icon/icon-sertificate-line.svg"
                  height={35}
                  width={35}
                  alt="Alumni Logo"
                />
                <div className="flex flex-col">
                  <h1 className="font-semibold">Certifications</h1>
                  <h1 className="text-dark-secondary">
                    Universitas Indonesia, 2010
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 lg:w-[30%]">
            <div className="rounded-md border-[1px] border-stroke bg-white py-2">
              <div className="p-3">
                <h1 className="text-lg font-bold text-primary text-center">
                  Create Appointment
                </h1>
              </div>
              <div className="px-5 py-2">
                <DatePickerOne
                  customClasses="w-full mb-3"
                  label="Pick a date"
                  name="appointmentDate"
                  required
                />
                <Select
                  label="Pick a time"
                  name="appointmentTime"
                  placeholder="HH:MM"
                  required
                  customClass={"w-full mb-3"}
                  options={["00:00", "01:00", "02:00", "03:00", "04:00"]}
                  selectedOption={time}
                  setSelectedOption={setTime}
                  isOptionSelected={false}
                  changeTextColor={() => {}}
                />
                <Select
                  label="Choose your home service"
                  name="appointmentService"
                  placeholder="Select service"
                  required
                  customClass={"w-full mb-3"}
                  options={[
                    "Neonatal Care",
                    "Elderly Care",
                    "After Care",
                    "Booster",
                  ]}
                  selectedOption={service}
                  setSelectedOption={setService}
                  isOptionSelected={false}
                  changeTextColor={() => {}}
                />
                {service !== "" && (
                  <div className="mb-3 rounded-md border border-stroke p-3">
                    <h3 className="text-center font-semibold">
                      Service Description
                    </h3>
                    {service === "Neonatal Care" && (
                      <p>Neonatal care service description</p>
                    )}
                    {service === "Elderly Care" && (
                      <p>Elderly care service description</p>
                    )}
                    {service === "After Care" && (
                      <p>After care service description</p>
                    )}
                    {service === "Booster" && (
                      <p>Booster service description</p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex w-full justify-center px-5">
                <button
                  type="button"
                  className="mb-5 w-full rounded-sm bg-primary p-[8px] font-medium text-white hover:bg-opacity-90"
                >
                  Make Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default OrderCaregiver;
