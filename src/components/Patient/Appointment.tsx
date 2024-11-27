"use client";

import { getGlobalUserProfilePhoto } from "@/app/_server-action/global";
import { createSupabaseClient } from "@/lib/client";
import { CAREGIVER, USER } from "@/types/AxolotlMainType";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import DatePickerOne from "../FormElements/DatePicker/DatePickerOne";
import Select from "../Axolotl/Select";
import { Skeleton } from "@mui/material";
import { AxolotlServices } from "@/utils/Services";
import { getAppointmentsByCaregiverId } from "@/app/_server-action/patient";
import AxolotlButton from "../Axolotl/Buttons/AxolotlButton";

type Caregiver = USER & {
  profile_photo_url?: string;
  caregiver: CAREGIVER[];
};

const Appointment = ({ caregiverId }: { caregiverId: string }) => {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [caregiver, setCaregiver] = useState<Caregiver>();
  const [appointments, setAppointments] = useState<any>([]);

  const router = useRouter();

  useEffect(() => {
    const getCaregiver = async () => {
      const supabase = createSupabaseClient();

      try {
        const { data } = await supabase
          .from("users")
          .select("*, caregiver(*)")
          .eq("user_id", caregiverId)
          .limit(1);
        if (data) {
          const url = await getGlobalUserProfilePhoto(
            data[0].caregiver[0]?.profile_photo
          );
          data[0].profile_photo_url = url!;

          setCaregiver(data[0]);
        }
      } catch (error) {
        console.log("error", error);
        throw new Error("Error fetching data");
      }
    };

    if (caregiverId) {
      getCaregiver();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getAppointments = async () => {
      try {
        if (caregiver) {
          const data = await getAppointmentsByCaregiverId(
            caregiver.caregiver[0].id
          );
          setAppointments(data);
        }
      } catch (error) {
        console.log("Error while fetching appointments by caregiver id", error);
      }
    };

    getAppointments();
  }, [caregiver]);

  const availableHours = useMemo(() => {
    if (
      caregiver?.caregiver[0].schedule_start_time &&
      caregiver?.caregiver[0].schedule_end_time
    ) {
      const startHour = parseInt(
        caregiver?.caregiver[0].schedule_start_time.split(":")[0]
      );
      const endHour = parseInt(
        caregiver?.caregiver[0].schedule_end_time.split(":")[0]
      );

      const startMinutes =
        caregiver?.caregiver[0].schedule_start_time.split(":")[1];

      const hours: any = [];
      for (let i = startHour; i < endHour; i++) {
        hours.push(`${i}:${startMinutes}`);
      }

      if (appointments.length > 0 && date !== "") {
        appointments.forEach((appointment: any) => {
          const isDateEqual = appointment.appointment.appointment_date == date;

          if (isDateEqual) {
            const index = hours.indexOf(
              appointment.appointment.appointment_time
            );

            if (index !== -1) {
              hours.splice(index, 1);
            }
          }
        });
      }

      return hours;
    }
  }, [appointments, caregiver, date]);

  const toOrderForm = (formData: FormData) => {
    router.push(
      `/patient/health-services/appointment/order-form?caregiver=${caregiverId}&service=${service}&time=${time}&date=${formData.get("appointmentDate")}`
    );
  };

  return (
    <form action={toOrderForm}>
      {caregiver ? (
        <div className="flex justify-center">
          <div className="mt-6 flex h-[100%] w-[85%] flex-col justify-between gap-7 lg:flex-row">
            <div className="p-3 lg:w-[65%]">
              <div className="flex items-start gap-10">
                <div className="min-w-[100px]">
                  <Image
                    src={
                      caregiver?.profile_photo_url ||
                      "/images/user/Default Caregiver Photo.png"
                    }
                    height={100}
                    width={100}
                    className="h-[100px] w-[100px] rounded-full bg-kalbe-veryLight object-cover"
                    alt="CG pfp"
                  />
                </div>
                <div className="w-[50%]">
                  <h1 className="text-lg font-bold">
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
                        <h1>
                          {caregiver?.caregiver[0].schedule_start_day} -{" "}
                          {caregiver?.caregiver[0].schedule_end_day}
                        </h1>
                      </div>
                      <div className="flex gap-2">
                        <Image
                          src="/images/icon/icon-clock-outline.svg"
                          height={24}
                          width={24}
                          alt=""
                        />
                        <h1>
                          {caregiver?.caregiver[0].schedule_start_time
                            ?.split(":")
                            .slice(0, 2)
                            .join(":")}{" "}
                          -{" "}
                          {caregiver?.caregiver[0].schedule_end_time
                            ?.split(":")
                            .slice(0, 2)
                            .join(":")}
                        </h1>
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
              {availableHours && availableHours.length === 0 && (
                <div className="mb-5.5 rounded-md border-[1px] border-red-500 bg-red-200 py-2">
                  <div className="p-3">
                    <h1 className="text-center text-lg font-bold text-red-500">
                      Oops, this caregiver is not available on the date you
                      picked, please pick another date
                    </h1>
                  </div>
                </div>
              )}

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
                    setDate={setDate}
                    startDay={caregiver?.caregiver[0].schedule_start_day}
                    endDay={caregiver?.caregiver[0].schedule_end_day}
                    required
                  />
                  <Select
                    label="Pick a time"
                    name="appointmentTime"
                    placeholder="HH:MM"
                    required
                    customClass={"w-full mb-3"}
                    options={availableHours || []}
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
                    options={
                      caregiver.role === "Nurse"
                        ? AxolotlServices.map((service) => service.name)
                        : AxolotlServices.map((service) => service.name).filter(
                            (service) => service !== "Booster"
                          )
                    }
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
                  <AxolotlButton
                    label="Make Appointment"
                    type="submit"
                    isSubmit
                    customClasses="mb-4"
                    fontThickness="bold"
                    variant="primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          width="100%"
          animation="wave"
          height={45}
          className="rounded-lg"
        />
      )}
    </form>
  );
};

export default Appointment;
