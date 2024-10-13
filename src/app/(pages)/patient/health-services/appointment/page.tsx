"use client";

import { getProfilePhoto } from "@/app/_server-action/caregiver";
import Select from "@/components/Axolotl/Select";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CAREGIVER } from "@/types/axolotl";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type User = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  gender: string;
  birthdate: Date;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  role: string;
  caregiver: CAREGIVER[];
};

const OrderCaregiver = ({ searchParams }: any) => {
  const [time, setTime] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [caregiver, setCaregiver] = useState<User>();

  const router = useRouter();

  useEffect(() => {
    const getCaregiver = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*, caregiver(*)")
          .eq("user_id", searchParams.caregiver)
          .limit(1);
        if (data) {
          const url = await getProfilePhoto(
            data[0].caregiver[0]?.profile_photo
          );
          data[0].caregiver[0].profile_photo_url = url!;

          setCaregiver(data[0]);
        }
      } catch (error) {
        console.log("error", error);
        throw new Error("Error fetching data");
      }
    };

    if (searchParams.caregiver) {
      getCaregiver();
    }
  }, []);

  console.log("cg", caregiver);

  const toOrderForm = (formData: FormData) => {
    console.log("date", formData.get("appointmentDate"));
    router.push(
      `/patient/health-services/appointment/order-form?caregiver=${searchParams.caregiver}&service=${service}&time=${time}&date=${formData.get("appointmentDate")}`
    );
  };

  return (
    <DefaultLayout>
      <form action={toOrderForm}>
        <div className="flex justify-center">
          <div className="mt-6 flex h-[100%] w-[85%] flex-col justify-between gap-7 lg:flex-row">
            <div className="p-3 lg:w-[65%]">
              <div className="flex items-start gap-10">
                <div className="min-w-[100px]">
                  <Image
                    src={caregiver?.caregiver[0].profile_photo_url!}
                    height={100}
                    width={100}
                    className="h-[100px] w-[100px] rounded-full bg-kalbe-veryLight"
                    alt="CG pfp"
                  />
                </div>
                <div className="w-[50%]">
                  <h1 className="text-lg font-extrabold">
                    {`${caregiver?.first_name} ${caregiver?.last_name}`}
                  </h1>
                  <h1 className="mb-2 text-dark-secondary">
                    {`${caregiver?.role} at ${caregiver?.caregiver[0].workplace}`}
                  </h1>
                  <div className="flex justify-between rounded-md border border-primary bg-kalbe-proLight p-2">
                    <div>
                      <h1 className="mb-2 font-semibold text-primary">
                        Work Schedule
                      </h1>
                      <div className="mb-1 flex gap-2">
                        <Image
                          src="/images/icon/icon-calendar-patient.svg"
                          height={24}
                          width={24}
                          alt=""
                        />
                        <h1>Monday - Saturday</h1>
                      </div>
                      <div className="flex gap-2">
                        <Image
                          src="/images/icon/icon-clock-outline.svg"
                          height={24}
                          width={24}
                          alt=""
                        />
                        <h1>18.30 - 20.30</h1>
                      </div>
                    </div>
                    <Image
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
                  <Image
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
                  <Image
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
                  <Image
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
                  <Image
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
                  <h1 className="text-center text-lg font-bold text-primary">
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
                      "Booster"
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
                    type="submit"
                    className="mb-5 w-full rounded-sm bg-primary p-[8px] font-medium text-white hover:bg-opacity-90"
                  >
                    Make Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </DefaultLayout>
  );
};

export default OrderCaregiver;
