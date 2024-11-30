"use client";

import {
  getGlobalCaregiverDataByCaregiverOrUserId,
  getGlobalUserProfilePhoto
} from "@/app/_server-action/global";
import { createAppointment } from "@/app/_server-action/patient";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import AxolotlModal from "@/components/Axolotl/Modal/AxolotlModal";
import { getUserFromSession } from "@/lib/server";
import { USER_CAREGIVER } from "@/types/AxolotlMultipleTypes";
import { globalFormatPrice } from "@/utils/Formatters/GlobalFormatters";
import { AxolotlServices } from "@/utils/Services";
import { Symptoms } from "@/utils/Symptoms";
import { Chip, Skeleton, Slide, Stack } from "@mui/material";
import {
  IconCircleMinus,
  IconCirclePlus,
  IconCirclePlusFilled
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import Accordion from "../../Axolotl/Accordion";
import DisabledCustomInputGroup from "../../Axolotl/DisabledInputFields/DisabledCustomInputGroup";
import Select from "../../Axolotl/Select";
import SelectHorizontal from "../../Axolotl/SelectHorizontal";
import { OrderFormValidation } from "./Validation/OrderFormValidation";
import { ToastContainer } from "react-toastify";

interface OrderFormProps {
  time: string;
  date: string;
  caregiverId: string;
  serviceSelection: string;
}

const OrderForm = ({
  time,
  date,
  caregiverId,
  serviceSelection
}: OrderFormProps) => {
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

  const [loading, setLoading] = useState<boolean>(true);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [additionalSymptom, setAdditionalSymptom] = useState<string[]>([]);

  const router = useRouter();

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmModal = (symptom: string) => {
    setOpenModal(false);
    setAdditionalSymptom((prev) => [...prev, symptom]);
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await getUserFromSession();
      const { data: getCaregiverData } =
        await getGlobalCaregiverDataByCaregiverOrUserId("users", caregiverId);

      const cg = getCaregiverData as USER_CAREGIVER;

      if (cg) {
        setCaregiver(cg);
        setServiceType(serviceSelection);

        const photo = await getGlobalUserProfilePhoto(
          cg.caregiver[0].profile_photo
        );

        if (photo) {
          setProfilePhoto(photo);
        }
      }

      if (data) {
        setSession(data);
        setLoading(false);
      }
    };

    getSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getServiceTypes = () => {
      AxolotlServices.map((service) => {
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
    if (
      !OrderFormValidation(serviceType, formData, concern, selectedAll, days)
    ) {
      setIsActive(false);

      return;
    }

    const res = await createAppointment({
      service_type: serviceType,
      caregiver_id: caregiverId,
      patient_id: session?.id,
      causes: formData.get("causes")!.toString(),
      main_concern: concern,
      current_medication: formData.get("currentMedication")!.toString(),
      medical_description: formData.get("medicalDescription")!.toString(),
      days_of_visit: days,
      appointment_time: time,
      appointment_date: new Date(date),
      total_payment: days * service.price,
      symptoms: selectedAll.map((symptom) => {
        return symptom.toLowerCase();
      }),
      additionalSymptom: additionalSymptom
    });

    if (res !== "Please try again") {
      router.push(
        "/patient/health-services/appointment/conjecture?appointment=" + res
      );
    }
  };

  return (
    <>
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          animation="wave"
          height={300}
          className="rounded-lg"
        />
      ) : (
        <>
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
                  <h1 className="mb-2 text-lg font-medium">
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
                <h1 className="mb-2 mt-7 text-lg font-medium">Order Details</h1>
                <div>
                  <Select
                    label="Choose your home service"
                    name="appointmentService"
                    placeholder="Select service"
                    required
                    customClass={`w-full mb-3 ${isActive ? "disabled pointer-events-none" : ""}`}
                    options={[
                      "Neonatal Care",
                      "Elderly Care",
                      "After Care",
                      "Booster"
                    ]}
                    selectedOption={serviceType}
                    setSelectedOption={setServiceType}
                  />
                  <h1 className="text-body-sm font-medium text-dark dark:text-white">
                    Service Description:
                  </h1>
                  <p className="w-[75%] text-body-sm">
                    Service desc for after care
                  </p>
                </div>
              </>

              {/* Medical Concerns */}
              <>
                <h1 className="mb-2 mt-7 text-lg font-medium">
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
                      className={`${isActive ? "disabled pointer-events-none" : ""} w-[75%] rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary`}
                    />
                  </div>
                  {allTypes.length > 0 && (
                    <SelectHorizontal
                      label="Main Concerns"
                      placeholder="Choose your concern"
                      required
                      options={allTypes}
                      name="main-concerns"
                      setSelectedOption={setConcern}
                      selectedOption={concern}
                      customClass={`${isActive ? "disabled pointer-events-none" : ""}`}
                    />
                  )}
                  <div className="mb-3 flex items-center justify-between gap-5">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                      Current Medication{" "}
                      <span className="ml-1 text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="currentMedication"
                      placeholder="Enter your current medication (separated by ',')"
                      className={`${isActive ? "disabled pointer-events-none" : ""} w-[75%] rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary`}
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
                      className={`${isActive ? "disabled pointer-events-none" : ""} w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary`}
                    ></textarea>
                  </div>
                </div>
              </>

              {/* Symptoms */}
              <div>
                <h1 className="mb-2 mt-7 text-lg font-medium">
                  Add Symtoms That Match Your Condition
                </h1>
                <Stack
                  direction="row"
                  marginBottom={2}
                  className="flex flex-wrap gap-2"
                  width={"85%"}
                >
                  <TransitionGroup component={null}>
                    {selectedAll.map((selected) => (
                      <Slide
                        key={selected}
                        direction="down"
                        timeout={300}
                        mountOnEnter
                        unmountOnExit
                      >
                        <Chip
                          label={selected}
                          variant="outlined"
                          sx={{
                            fontSize: "0.8rem",
                            borderColor: "#1CBF90",
                            color: "#1CBF90",
                            "& .MuiChip-deleteIcon": {
                              color: "#1CBF90"
                            },
                            "& .MuiChip-deleteIcon:hover": {
                              color: "#26725C"
                            }
                          }}
                          className="font-bold"
                          onDelete={() => {
                            setSelectedAll((prev) =>
                              prev.filter((item) => item !== selected)
                            );
                          }}
                        />
                      </Slide>
                    ))}
                    {additionalSymptom.map((additional) => (
                      <Slide
                        key={additional}
                        direction="down"
                        timeout={300}
                        mountOnEnter
                        unmountOnExit
                      >
                        <Chip
                          label={
                            additional[0].toUpperCase() + additional.slice(1)
                          }
                          variant="outlined"
                          sx={{
                            fontSize: "0.8rem",
                            borderColor: "#1CBF90",
                            color: "#1CBF90",
                            "& .MuiChip-deleteIcon": {
                              color: "#1CBF90"
                            },
                            "& .MuiChip-deleteIcon:hover": {
                              color: "#26725C"
                            }
                          }}
                          className="font-bold"
                          onDelete={() => {
                            setAdditionalSymptom((prev) =>
                              prev.filter((item) => item !== additional)
                            );
                          }}
                        />
                      </Slide>
                    ))}
                    <Slide
                      key="add-symptom"
                      direction="down"
                      timeout={300}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Chip
                        label="Add Symptom"
                        variant="outlined"
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          borderColor: "#1CBF90",
                          color: "#1CBF90",
                          "& .MuiChip-deleteIcon": {
                            color: "#1CBF90"
                          },
                          "& .MuiChip-deleteIcon:hover": {
                            color: "#26725C"
                          }
                        }}
                        className="font-bold"
                        deleteIcon={<IconCirclePlusFilled />}
                        onDelete={() => {
                          setOpenModal(true);
                        }}
                      />
                    </Slide>
                  </TransitionGroup>
                </Stack>
                <div>
                  {Symptoms.map((symptom) => (
                    <Accordion
                      key={symptom.name}
                      type={symptom.name}
                      symptoms={symptom.symptoms}
                      selectedAll={selectedAll}
                      setSelectedAll={setSelectedAll}
                      customClass={
                        isActive ? "disabled pointer-events-none" : ""
                      }
                    />
                  ))}
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
                          <h1 className="text-center text-lg font-medium">
                            Your transaction will be automatically terminated in
                          </h1>
                          <h1 className="text-lg font-medium">
                            {Math.floor(seconds / 3600)}:
                            {Math.floor(seconds / 60) == 60
                              ? "00"
                              : Math.floor(seconds / 60)}
                            :{seconds % 60 == 0 ? "00" : seconds % 60}
                          </h1>
                        </div>
                      )}
                      <div className="mb-1 mt-3 flex justify-between">
                        <h1 className="font-medium text-stroke-dark">
                          Service Fee
                        </h1>
                        <h1>{globalFormatPrice(service.price)}</h1>
                      </div>
                      <div className="flex justify-between">
                        <h1 className="font-medium text-stroke-dark">
                          Total Days
                        </h1>
                        <h1>{serviceType === "Booster" ? 1 : days}x visit</h1>
                      </div>
                      <div className="flex justify-center">
                        <div className="my-5 h-[0.5px] w-full bg-primary"></div>
                      </div>
                      <div className="mb-3 flex justify-between">
                        <h1 className="font-medium text-stroke-dark">
                          Total Charge
                        </h1>
                        <h1 className="text-lg font-bold">
                          {globalFormatPrice(
                            serviceType === "Booster"
                              ? service.price
                              : service.price * days
                          )}
                        </h1>
                      </div>
                      <div className="flex flex-col items-center rounded-md border-[1px] border-stroke px-5 py-2">
                        <h1 className="mb-1 text-lg font-medium">
                          Virtual Account Number
                        </h1>
                        <h1>12345-67890-87654</h1>
                        <button
                          className={`my-3 rounded-md ${copied ? "disabled bg-gray-cancel" : "bg-primary"} px-3 py-1 font-medium text-white`}
                          onClick={async (e) => {
                            e.preventDefault();

                            try {
                              await navigator.clipboard.writeText(
                                "12345-67890-87654"
                              );
                              setCopied(true);
                            } catch (error) {
                              throw new Error(error as string);
                            }
                          }}
                        >
                          {copied ? "Copied" : "Copy to clipboard"}
                        </button>
                      </div>
                      <div>
                        <h1 className="mb-2 text-lg font-bold">
                          Payment Status
                        </h1>
                        {copied ? (
                          <div className="rounded-md border-[1px] border-primary bg-kalbe-ultraLight px-5 py-2">
                            <h1 className="text-center text-lg font-medium text-primary">
                              Verified
                            </h1>
                          </div>
                        ) : (
                          <div className="rounded-md border-[1px] border-yellow bg-yellow-light px-5 py-2">
                            <h1 className="text-center text-lg font-medium text-yellow">
                              Pending
                            </h1>
                          </div>
                        )}
                      </div>
                      <div className="mb-5 mt-5 flex w-full justify-center">
                        {copied ? (
                          <AxolotlButton
                            label="Continue"
                            variant="primary"
                            fontThickness="bold"
                            isSubmit
                          />
                        ) : (
                          <AxolotlButton
                            label="Continue"
                            variant="secondary"
                            fontThickness="bold"
                            type="button"
                          />
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
                      <h1 className="text-lg font-medium">Sub Total: </h1>
                      <h1 className="text-lg font-bold">
                        {serviceType !== "Booster"
                          ? `${service ? globalFormatPrice(service.price * days) : "0"}`
                          : `${service ? globalFormatPrice(service.price) : "0"}`}
                      </h1>
                    </div>
                    <div className="flex w-full justify-center px-5">
                      <AxolotlButton
                        label="Pay"
                        variant="primary"
                        fontThickness="bold"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsActive(true);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>

          <AxolotlModal
            isOpen={openModal}
            onClose={handleCloseModal}
            onConfirm={() => {}}
            confirmAddSymptom={handleConfirmModal}
            title="Additional Symptom"
            question=""
            action="add symptom"
          />

          <ToastContainer />
        </>
      )}
    </>
  );
};

export default OrderForm;
