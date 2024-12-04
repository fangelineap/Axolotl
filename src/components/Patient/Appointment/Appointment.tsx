"use client";

import { getClientPublicStorageURL } from "@/app/_server-action/global/storage/client";
import { getAppointmentsByCaregiverId } from "@/app/_server-action/patient";
import { USER_CAREGIVER } from "@/types/AxolotlMultipleTypes";
import {
  globalFormatDate,
  globalFormatTime
} from "@/utils/Formatters/GlobalFormatters";
import { AxolotlServices } from "@/utils/Services";
import { Skeleton } from "@mui/material";
import {
  IconClock,
  IconRosetteDiscountCheckFilled,
  IconStarFilled
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AxolotlButton from "../../Axolotl/Buttons/AxolotlButton";
import Select from "../../Axolotl/Select";
import DatePickerOne from "../../FormElements/DatePicker/DatePickerOne";
import { AppointmentValidation } from "./Validation/AppointmentValidation";

const Appointment = ({ caregiverData }: { caregiverData: USER_CAREGIVER }) => {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [appointments, setAppointments] = useState<any>([]);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const caregiver = caregiverData;
  const router = useRouter();

  const caregiverProfilePhoto = getClientPublicStorageURL(
    "profile_photo",
    caregiver.caregiver[0].profile_photo
  );

  /**
   * * Handle Image Load
   */
  const handleImageLoad = () => setImageLoaded(true);

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
        throw new Error(error as string);
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
      if (startHour > endHour) {
        for (let i = startHour; i <= 12; i++) {
          hours.push(`${i}:${startMinutes}`);
        }
        for (let i = 1; i < endHour; i++) {
          hours.push(`${i}:${startMinutes}`);
        }
      } else {
        for (let i = startHour; i < endHour; i++) {
          hours.push(`${i}:${startMinutes}`);
        }
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
    if (AppointmentValidation(formData) === false) return;

    router.push(
      `/patient/health-services/appointment/order-form?caregiver=${caregiver.user_id}&service=${service}&time=${time}&date=${formData.get("appointmentDate")}`
    );
  };

  const renderAbout = (
    titles: string[],
    descriptions: (string | number)[],
    icons?: JSX.Element[]
  ) => {
    return (
      <div className="flex flex-col gap-4">
        {titles.map((title, index) => (
          <div key={index} className="flex items-start gap-2">
            {icons && icons[index]}
            <div className="flex flex-col">
              <h1 className="text-lg font-medium">{title}</h1>
              <p>{descriptions[index] || "Not available"}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <form action={toOrderForm}>
      {caregiver ? (
        <div className="flex justify-center">
          <div className="mt-6 flex h-[100%] w-[85%] flex-col justify-between gap-7 lg:flex-row">
            <div className="p-3 lg:w-[65%]">
              <div className="flex items-start gap-10">
                {!imageLoaded && (
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    width={160}
                    height={160}
                    className="rounded-full object-cover"
                  />
                )}
                <div
                  className={`h-40 w-40 overflow-hidden rounded-full border ${imageLoaded ? "" : "hidden"}`}
                >
                  <Image
                    src={caregiverProfilePhoto}
                    alt="User Profile Photo"
                    width={200}
                    height={200}
                    priority
                    className={`h-full w-full object-cover ${imageLoaded ? "" : "hidden"}`}
                    onLoad={handleImageLoad}
                  />
                </div>
                <div className="w-[50%]">
                  <h1 className="text-heading-5 font-bold">
                    {`${caregiver?.first_name} ${caregiver?.last_name}`}
                  </h1>
                  <h1 className="mb-2 text-xl text-dark-secondary">
                    {`${caregiver?.role} at ${caregiver?.caregiver[0].workplace}`}
                  </h1>
                  <div className="flex justify-between rounded-md border border-primary bg-kalbe-ultraLight p-2">
                    <div>
                      <h1 className="mb-2 text-xl font-medium text-primary">
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
                        <IconClock size={24} stroke={1.5} />
                        <h1>
                          {caregiver?.caregiver[0].schedule_start_time &&
                            globalFormatTime(
                              caregiver.caregiver[0].schedule_start_time,
                              "stringTime"
                            )}{" "}
                          -{" "}
                          {caregiver?.caregiver[0].schedule_end_time &&
                            globalFormatTime(
                              caregiver.caregiver[0].schedule_end_time,
                              "stringTime"
                            )}
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
                <h1 className="text-heading-6 font-medium">
                  Caregiver Verification Status and Rating
                </h1>
                {renderAbout(
                  ["Verified at", "Rating"],
                  [
                    globalFormatDate(
                      caregiver?.caregiver[0].reviewed_at,
                      "longDate"
                    ),
                    caregiver?.caregiver[0].rate
                      ? caregiver.caregiver[0].rate.toFixed(2)
                      : "Be the first to rate this caregiver"
                  ],
                  [
                    <IconRosetteDiscountCheckFilled
                      key="calendar"
                      size={24}
                      stroke={1.5}
                      className="text-primary"
                    />,
                    <IconStarFilled
                      key="star"
                      size={24}
                      stroke={1.5}
                      className="text-yellow"
                    />
                  ]
                )}
                <h1 className="text-heading-6 font-medium">
                  Caregiver Profile
                </h1>
                {renderAbout(
                  ["Workplace", "Work Experience", "Working Status"],
                  [
                    caregiver?.caregiver[0].workplace,
                    `${caregiver?.caregiver[0].work_experiences} years`,
                    caregiver?.caregiver[0].employment_type
                  ]
                )}
              </div>
            </div>
            <div className="p-3 lg:w-[30%]">
              {availableHours && availableHours.length === 0 && (
                <div className="mb-5.5 rounded-md border-[1px] border-red bg-red-light py-2">
                  <div className="p-3">
                    <h1 className="text-center text-lg font-medium text-red">
                      Oops, this caregiver is not available on the date you
                      picked, please pick another date
                    </h1>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-stroke bg-white py-5">
                <h1 className="text-center text-lg font-bold text-primary">
                  Create Appointment
                </h1>
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
                    customClass={`w-full mb-3`}
                    options={availableHours || []}
                    selectedOption={time}
                    setSelectedOption={setTime}
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
                  />
                  {service !== "" && (
                    <div className="mb-3 rounded-md border border-stroke p-3">
                      <h3 className="text-center font-medium">
                        Service Description
                      </h3>
                      {AxolotlServices.find((s) => s.name === service) && (
                        <p className="mt-3">
                          {
                            AxolotlServices.find((s) => s.name === service)
                              ?.description
                          }
                        </p>
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
