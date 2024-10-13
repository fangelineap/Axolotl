"use client";

import { getCaregiverById, getUserFromSession } from "@/lib/server";
import { getCaregiverPhoto } from "@/app/_server-action/caregiver";
import { createAppointment } from "@/app/_server-action/patient";
import Accordion from "@/components/Axolotl/Accordion";
import DisabledCustomInputGroup from "@/components/Axolotl/DisabledInputFields/DisabledCustomInputGroup";
import Select from "@/components/Axolotl/Select";
import SelectHorizontal from "@/components/Axolotl/SelectHorizontal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { services } from "@/utils/Services";
import {
  IconCircleMinus,
  IconCirclePlus,
  IconCirclePlusFilled,
  IconCircleXFilled
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PlacingOrder = ({ searchParams }: any) => {
  const [concern, setConcern] = useState<string>("");
  const [selectedAll, setSelectedAll] = useState<string[]>([]);
  const [days, setDays] = useState<number>(1);

  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(3600);

  const [copied, setCopied] = useState(false);
  const [serviceType, setServiceType] = useState<string>("");
  const [session, setSession] = useState<any>(null);
  const [caregiver, setCaregiver] = useState<any>(null);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [service, setService] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await getUserFromSession();
      const cg = await getCaregiverById(searchParams.caregiver);

      if (cg) {
        setCaregiver(cg[0]);
        setServiceType(searchParams.service);

        const photo = await getCaregiverPhoto(cg[0].caregiver[0].profile_photo);
        setProfilePhoto(photo!);
      }

      if (data) {
        setSession(data);
      }
    };

    getSession();
  }, []);

  useEffect(() => {
    const getServiceTypes = () => {
      services.map((service) => {
        if (service.name === serviceType) {
          setService(service);
          setAllTypes([]);
          service.types.map((type) => {
            setAllTypes((prev) => [...prev, type.name.toString()]);
          });
        }
      });
    };

    getServiceTypes();
  }, [serviceType]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      () => clearInterval(interval as NodeJS.Timeout);
    }

    return () => clearInterval(interval as NodeJS.Timeout);
  }, [isActive, seconds]);

  const submitOrder = async (formData: FormData) => {
    const res = await createAppointment({
      service_type: serviceType,
      caregiver_id: searchParams.caregiver,
      patient_id: session?.id,
      causes: formData.get("causes")!.toString(),
      main_concern: concern,
      current_medication: formData.get("currentMedication")!.toString(),
      medical_description: formData.get("medicalDescription")!.toString(),
      days_of_visit: days,
      appointment_time: searchParams.time,
      appointment_date: searchParams.date,
      total_payment: days * service.price,
      symptoms: selectedAll
    });

    if (res !== "Please try again") {
      router.push(
        "/patient/health-services/appointment/conjecture?conjecture=" + res
      );
    }
  };

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
        <form
          action={submitOrder}
          className="mt-6 flex h-[100%] w-[85%] flex-col justify-between lg:flex-row"
        >
          {/* Left Side */}
          <div className="w-[100%] p-3 lg:mr-7 lg:w-[65%]">
            <h1 className="mb-5 text-2xl font-bold">Place Your Order</h1>
            {/* Patient Information Section */}
            {session && (
              <>
                <h1 className="mb-2 text-lg font-semibold">
                  Patient Information
                </h1>
                <div>
                  <DisabledCustomInputGroup
                    label="Patient Name"
                    horizontal
                    placeholder={session.first_name + " " + session.last_name}
                    type="text"
                    key={"patient-name"}
                  />
                  <DisabledCustomInputGroup
                    label="Address"
                    horizontal
                    placeholder={session.address}
                    type="text"
                    key={"patient-address"}
                  />
                  <DisabledCustomInputGroup
                    label="Phone Number"
                    horizontal
                    placeholder={"0" + session.phone_number}
                    type="text"
                    key={"patient-phone-number"}
                  />
                  <DisabledCustomInputGroup
                    label="Birthdate"
                    horizontal
                    placeholder={session.birthdate}
                    type="text"
                    key={"patient-birthdate"}
                  />
                </div>
              </>
            )}

            {/* Order Details */}
            <>
              <h1 className="mb-2 mt-7 text-lg font-semibold">Order Details</h1>
              <div>
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
                  selectedOption={serviceType}
                  setSelectedOption={setServiceType}
                  isOptionSelected={false}
                  changeTextColor={() => {}}
                />
                {/* <div className="flex justify-between gap-3"> */}
                <h1 className="text-body-sm font-medium text-dark dark:text-white">
                  Service Description:
                </h1>
                <p className="w-[75%] text-body-sm">
                  Service desc for after care
                </p>
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
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Causes <span className="ml-1 text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="causes"
                    placeholder="Causes"
                    className="w-[75%] rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>
                {allTypes.length > 0 && (
                  <SelectHorizontal
                    label="Main Concerns"
                    placeholder="Choose your concern"
                    required
                    options={allTypes}
                    isOptionSelected={false}
                    name="main-concerns"
                    setSelectedOption={setConcern}
                    selectedOption={concern}
                  />
                )}
                <div className="mb-3 flex items-center justify-between gap-5">
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Current Medication <span className="ml-1 text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="currentMedication"
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
                    name="medicalDescription"
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
                  <div
                    key={selected}
                    className="flex items-center justify-between gap-2 rounded-full border-2 border-primary bg-white px-2 py-1 text-primary"
                  >
                    <h1 className="font-medium">{selected}</h1>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedAll((prev: string[]) =>
                          prev.filter((item) => item !== selected)
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
                  symptoms={["itching", "skin rash"]}
                  selectedAll={selectedAll}
                  setSelectedAll={setSelectedAll}
                />
                <Accordion
                  type="Skin Symptoms"
                  symptoms={["dischromic patches"]}
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
                  {isActive ? "Service Payment" : "Order Summary"}
                </h1>
              </div>
              {isActive ? (
                <>
                  <div className="px-5 py-2">
                    {!copied && (
                      <div className="flex flex-col items-center justify-center rounded-md border-[0.5px] border-red bg-red-light px-3 py-1 text-red">
                        <h1 className="text-center text-lg font-semibold">
                          Your transaction will be automatically terminated in
                        </h1>
                        <h1 className="text-lg font-semibold">
                          {Math.floor(seconds / 3600)}:
                          {Math.floor(seconds / 60) == 60
                            ? "00"
                            : Math.floor(seconds / 60)}
                          :{seconds % 60 == 0 ? "00" : seconds % 60}
                        </h1>
                      </div>
                    )}
                    <div className="mb-1 mt-3 flex justify-between">
                      <h1 className="font-semibold text-stroke-dark">
                        Service Fee
                      </h1>
                      <h1>Rp. {service.price}</h1>
                    </div>
                    <div className="flex justify-between">
                      <h1 className="font-semibold text-stroke-dark">
                        Total Days
                      </h1>
                      <h1>{serviceType === "Booster" ? 1 : days}x visit</h1>
                    </div>
                    <div className="flex justify-center">
                      <div className="my-5 h-[0.5px] w-full bg-primary"></div>
                    </div>
                    <div className="mb-3 flex justify-between">
                      <h1 className="font-semibold text-stroke-dark">
                        Total Charge
                      </h1>
                      <h1 className="text-lg font-bold">
                        Rp.{" "}
                        {serviceType === "Booster"
                          ? service.price
                          : service.price * days}
                      </h1>
                    </div>
                    <div className="flex flex-col items-center rounded-md border-[1px] border-stroke px-5 py-2">
                      <h1 className="mb-1 text-lg font-semibold">
                        Virtual Account Number
                      </h1>
                      <h1>12345-67890-87654</h1>
                      <button
                        className={`my-3 rounded-md ${copied ? "disabled bg-gray-cancel" : "bg-primary"} px-3 py-1 font-semibold text-white`}
                        onClick={async (e) => {
                          e.preventDefault();

                          try {
                            await navigator.clipboard.writeText(
                              "12345-67890-87654"
                            );
                            setCopied(true);
                          } catch (error) {
                            console.log("error");
                          }
                        }}
                      >
                        {copied ? "Copied" : "Copy to clipboard"}
                      </button>
                    </div>
                    <div>
                      <h1 className="mb-2 text-lg font-bold">Payment Status</h1>
                      {copied ? (
                        <div className="rounded-md border-[1px] border-primary bg-kalbe-ultraLight px-5 py-2">
                          <h1 className="text-center text-lg font-semibold text-primary">
                            Verified
                          </h1>
                        </div>
                      ) : (
                        <div className="rounded-md border-[1px] border-yellow bg-yellow-light px-5 py-2">
                          <h1 className="text-center text-lg font-semibold text-yellow">
                            Pending
                          </h1>
                        </div>
                      )}
                    </div>
                    <div className="mb-5 mt-5 flex w-full justify-center">
                      {copied ? (
                        <button
                          className={`w-full rounded-sm bg-primary p-[8px] font-medium text-white hover:bg-opacity-90`}
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          disabled
                          className={`w-full rounded-sm bg-gray-cancel p-[8px] font-medium text-white hover:bg-opacity-90`}
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          Continue
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-5 py-2">
                    <div className="my-3 flex items-center gap-3 rounded-md border-[1px] border-stroke p-3">
                      <Image
                        src={profilePhoto}
                        height={60}
                        width={60}
                        className="h-[60px] w-[60px] rounded-full bg-kalbe-veryLight object-cover"
                        alt="CG pfp"
                      />
                      <h1>
                        {caregiver?.first_name} {caregiver?.last_name}
                      </h1>
                    </div>
                    <DisabledCustomInputGroup
                      horizontal={false}
                      label="Service Type"
                      type="text"
                      value={serviceType}
                    />
                    <DisabledCustomInputGroup
                      horizontal={false}
                      label="Service For"
                      type="text"
                      value={concern}
                    />
                    {serviceType &&
                      (serviceType !== "Booster" ? (
                        <div>
                          <label className="font-medium text-dark dark:text-white">
                            Days of Visit
                          </label>
                          <div className="my-2 flex justify-between rounded-full border-[1px] border-stroke p-2 text-primary">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (days > 0) {
                                  setDays(days - 1);
                                }
                              }}
                            >
                              <IconCircleMinus size={30} />
                            </button>
                            <h1 className="text-lg text-black">{days}</h1>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setDays(days + 1);
                              }}
                            >
                              <IconCirclePlus size={30} />
                            </button>
                          </div>
                        </div>
                      ) : null)}
                  </div>
                  <div className="flex justify-between px-5 py-3">
                    <h1 className="text-lg font-semibold">Sub Total: </h1>
                    <h1 className="text-lg font-extrabold">
                      {serviceType !== "Booster"
                        ? `Rp ${service ? service.price * days : "0"}`
                        : `Rp ${service.price}`}
                    </h1>
                  </div>
                  <div className="flex w-full justify-center px-5">
                    <button
                      className="mb-5 w-full rounded-sm bg-primary p-[8px] font-medium text-white hover:bg-opacity-90"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsActive(true);
                      }}
                    >
                      Pay
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default PlacingOrder;
