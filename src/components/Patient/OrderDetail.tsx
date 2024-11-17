import { updateRating } from "@/app/_server-action/patient";
import { AxolotlServices } from "@/utils/Services";
import { IconMessage } from "@tabler/icons-react";
import "flatpickr/dist/flatpickr.min.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxolotlButton from "../Axolotl/Buttons/AxolotlButton";

interface MedecinePreparationProps {
  orderStatus: string;
  orderNotes?: string;
  medicineOrderId?: string;
  medicineIsPaid?: "Verified" | "Unverified" | "Skipped";
  caregiverInfo: {
    id: string;
    name: string;
    profile_photo_url: string;
    reviewed_at: string;
  };
  patientInfo: {
    name: string;
    address: string;
    phoneNumber: string;
    birthdate: string;
  };
  medicalDetails: {
    causes: string;
    mainConcerns: string[];
    currentMedicine: string[];
    symptoms: string[];
    medicalDescriptions: string;
    conjectures: string;
  };
  serviceDetails: {
    orderId: string;
    orderDate: string;
    serviceType: string;
    totalDays: string;
    startTime: string;
    endTime: string;
    serviceFee: string;
    totalCharge: string;
    rate: number;
  };
  medicineDetail?: {
    quantity: number;
    name: string;
    price: string;
  }[];
  price: {
    total: string;
    delivery: string;
    totalCharge: string;
  };
}

const OrderDetail: React.FC<MedecinePreparationProps> = ({
  orderStatus,
  orderNotes,
  medicineOrderId,
  medicineIsPaid,
  caregiverInfo,
  patientInfo,
  medicalDetails,
  medicineDetail,
  serviceDetails,
  price
}) => {
  const [isMdOrLarger, setIsMdOrLarger] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [rated, setRated] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const calculateTotalPrice = () => {
      if (medicineDetail) {
        const sum = medicineDetail.reduce((acc, med) => {
          // Ensure med.price is treated as a string and handle null/undefined cases
          const priceAsString = med.price ? med.price.toString() : "0";

          // Safely perform replace operations
          const medPrice = parseInt(
            priceAsString.replace(/Rp\.\s/g, "").replace(/\./g, ""),
            10 // Ensure base 10 parsing
          );

          return acc + (isNaN(medPrice) ? 0 : medPrice * med.quantity); // Handle NaN cases
        }, 0);

        setTotalPrice(sum);
      }
    };

    calculateTotalPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)"); // Tailwind's 'md' size is 768px
    setIsMdOrLarger(mediaQuery.matches);

    const handleResize = () => setIsMdOrLarger(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const handleRateCaregiver = async () => {
    const res = await updateRating(
      serviceDetails.orderId,
      caregiverInfo.id,
      rating
    );

    if (res === "Success") {
      setRated(true);
      toast.success("Rate submitted successfully !");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between">
      {/* Left Side */}
      <div className="mb-6 flex-1 lg:mr-8">
        {/* Order Status */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Order Status</h2>
          <div className="mt-2 flex items-center">
            <p className="font-bold text-gray-600">Current Status</p>
            <span
              className={`ml-20 inline-block rounded-full px-5 py-1.5 text-xs font-bold text-white ${
                orderStatus === "Completed"
                  ? "bg-primary"
                  : orderStatus === "Ongoing"
                    ? "bg-yellow"
                    : "bg-red"
              }`}
            >
              {orderStatus}
            </span>
          </div>
        </div>
        {orderStatus === "Canceled" && (
          <div className="mb-6 flex flex-col items-center justify-center rounded-[7px] border border-red bg-red-200 p-4">
            <svg
              width="70"
              height="70"
              viewBox="0 0 102 102"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="m-4"
            >
              <circle cx="51" cy="51" r="51" fill="#EE4D4D" />
              <path
                d="M25.8519 26.4982C26.8045 25.5552 28.0964 25.0254 29.4435 25.0254C30.7905 25.0254 32.0825 25.5552 33.0351 26.4982L50.9983 44.2852L68.9614 26.4982C69.9195 25.5819 71.2028 25.0749 72.5347 25.0863C73.8667 25.0978 75.1409 25.6268 76.0828 26.5595C77.0247 27.4921 77.5589 28.7538 77.5705 30.0727C77.5821 31.3916 77.07 32.6623 76.1446 33.611L58.1815 51.398L76.1446 69.1851C77.07 70.1338 77.5821 71.4045 77.5705 72.7234C77.5589 74.0423 77.0247 75.304 76.0828 76.2366C75.1409 77.1693 73.8667 77.6983 72.5347 77.7098C71.2028 77.7212 69.9195 77.2142 68.9614 76.2979L50.9983 58.5108L33.0351 76.2979C32.077 77.2142 30.7938 77.7212 29.4618 77.7098C28.1298 77.6983 26.8557 77.1693 25.9138 76.2366C24.9719 75.304 24.4376 74.0423 24.426 72.7234C24.4145 71.4045 24.9265 70.1338 25.8519 69.1851L43.815 51.398L25.8519 33.611C24.8995 32.6677 24.3645 31.3884 24.3645 30.0546C24.3645 28.7207 24.8995 27.4415 25.8519 26.4982Z"
                fill="#FBE3E4"
              />
            </svg>

            <div className="flex flex-col gap-2 text-center">
              <h1 className={`mb-1 text-2xl font-bold text-red`}>
                !! REFUND STATEMENT !!
              </h1>
              <div className="mb-3">
                <p className="text-lg text-red">
                  Your caregiver{" "}
                  <span className="font-semibold">has rejected this order</span>{" "}
                  due to the following reasons:
                </p>
                <p className="text-start text-red">
                  <ul className="list-disc">
                    <li>{orderNotes}</li>
                  </ul>
                </p>
              </div>
            </div>
            <p className="my-5 w-[1/2] text-xl font-semibold text-red">
              We have processed the refund to your virtual account. It should
              reflect shortly.
            </p>
          </div>
        )}
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-bold">Caregiver Information</h2>
          <div className="my-5 flex">
            <Image
              src={
                caregiverInfo.profile_photo_url ||
                "/images/user/Default Caregiver Photo.png"
              }
              height={100}
              width={100}
              className="h-[100px] w-[100px] rounded-full bg-kalbe-veryLight object-cover"
              alt="CG pfp"
            />
          </div>
          <div>
            {isMdOrLarger ? (
              <div className=" mt-2 flex flex-row ">
                <div className=" flex flex-col gap-y-1">
                  <strong>Caregiver Name</strong>
                  <strong>Reviewed At</strong>
                </div>
                <div className="ml-19 flex flex-col gap-y-1">
                  <div>{caregiverInfo.name}</div>
                  <div>
                    {
                      new Date(caregiverInfo.reviewed_at)
                        .toISOString()
                        .split("T")[0]
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-y-2">
                <div>
                  <strong>Caregiver Name:</strong> {caregiverInfo.name}
                </div>
                <div>
                  <strong>Reviewed At:</strong>{" "}
                  {
                    new Date(caregiverInfo.reviewed_at)
                      .toISOString()
                      .split("T")[0]
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Patient Information</h2>
          {isMdOrLarger ? (
            <div className=" mt-2 flex flex-row ">
              <div className=" flex flex-col gap-y-1">
                <strong>Patient Name</strong>
                <strong>Address</strong>
                <strong>Phone Number</strong>
                <strong>Birthdate</strong>
              </div>
              <div className="ml-19 flex flex-col gap-y-1">
                <div>{patientInfo.name}</div>
                <div>{patientInfo.address}</div>
                <div>{patientInfo.phoneNumber}</div>
                <div>{patientInfo.birthdate}</div>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex flex-col gap-y-2">
              <div>
                <strong>Patient Name:</strong> {patientInfo.name}
              </div>
              <div>
                <strong>Address:</strong> {patientInfo.address}
              </div>
              <div>
                <strong>Phone Number:</strong> {patientInfo.phoneNumber}
              </div>
              <div>
                <strong>Birthdate:</strong> {patientInfo.birthdate}
              </div>
            </div>
          )}
        </div>

        {/* Medical Concerns & Conjecture (Medical Details) */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Medical Concerns & Conjecture</h2>
          <div className="mt-2 flex flex-col sm:flex-row">
            <div className="flex flex-col gap-y-1">
              <strong>Causes</strong>
              <strong>Main Concerns</strong>
              <strong>Current Medicine</strong>
              <strong>Symptoms</strong>
              <strong>Medical Descriptions</strong>
            </div>
            <div className="mt-2 flex flex-col gap-y-1 sm:ml-8 sm:mt-0">
              <div>{medicalDetails.causes}</div>
              <div>{medicalDetails.mainConcerns.join(", ")}</div>
              <div>{medicalDetails.currentMedicine.join(", ")}</div>
              <div>{medicalDetails.symptoms.join(", ")}</div>
            </div>
          </div>
          <div className="mt-2">{medicalDetails.medicalDescriptions}</div>

          <div className="mt-2">
            <div className="flex flex-col items-center justify-center text-center">
              <div className=" w-full rounded-t-md border border-primary bg-green-light py-2 text-white">
                <p className="font-bold">Conjecture</p>
              </div>
              <div className="w-full rounded-b-md border border-primary py-2 font-bold text-primary">
                <p>{medicalDetails.conjectures}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Service Details</h2>
          <div className="flex flex-col gap-y-1">
            <div className="flex">
              <strong className="mr-19.5">Order ID</strong>
              <div className="ml-8">{serviceDetails.orderId}</div>{" "}
            </div>
            <div className="flex">
              <strong className="mr-15">Order Date</strong>
              <div className="ml-8">
                {new Date(serviceDetails.orderDate).toISOString().split("T")[0]}
              </div>
            </div>
            <div className="my-2 w-full border-b border-gray-400"></div>{" "}
            {/* Full-width horizontal line */}
            <div className="flex">
              <strong className="mr-12">Service Type</strong>
              <div className="ml-8">{serviceDetails.serviceType}</div>
            </div>
            <div className="flex">
              <strong className="mr-3">Total Days of Visit</strong>
              <div className="ml-8">{serviceDetails.totalDays}</div>
            </div>
            <div className="flex">
              <strong className="mr-6.5">Start Date/Time</strong>
              <div className="ml-8">{serviceDetails.startTime}</div>
            </div>
            <div className="flex">
              <strong className="mr-8">End Date/Time</strong>
              <div className="ml-8">{serviceDetails.endTime}</div>
            </div>
            <div className="flex">
              <strong className="mr-14.5">Service Fee</strong>
              <div className="ml-8">{serviceDetails.serviceFee}</div>
            </div>
            <div className="flex">
              <strong className="mr-12.5">Total Charge</strong>
              <div className="ml-8">{serviceDetails.totalCharge}</div>
            </div>
          </div>
        </div>

        {/* Additional Medications */}
        {medicineDetail &&
          medicineDetail.length > 0 &&
          medicineIsPaid === "Verified" && (
            <div>
              <h2 className="mb-4 text-xl font-bold">Additional Medications</h2>
              <div className="overflow-hidden rounded-md border border-primary">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className=" bg-green-light text-white">
                      <th className="p-2 text-left">Quantity</th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-right">Price/Item</th>
                      <th className="p-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicineDetail.map((med, index) => (
                      <tr key={index}>
                        <td className="border-primary p-2 text-left">
                          {med.quantity}
                        </td>
                        <td className="border-primary p-2">{med.name}</td>
                        <td className="border-primary p-2 text-right">
                          Rp. {med.price}
                        </td>
                        <td className="border-primary p-2 text-right">
                          Rp. {parseInt(med.price) * med.quantity}
                        </td>
                      </tr>
                    ))}

                    {/* Summary Rows */}
                    <tr>
                      <td
                        colSpan={3}
                        className="border-t border-primary p-2 text-left font-bold"
                      >
                        Total Price
                      </td>
                      <td className="border-t border-primary p-2 text-right">
                        Rp. {totalPrice.toLocaleString("id-ID")}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={3}
                        className="border-primary p-2 text-left font-bold"
                      >
                        Delivery Fee
                      </td>
                      <td className="border-primary p-2 text-right">
                        Rp. {parseInt(price.delivery).toLocaleString("id-ID")}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={3}
                        className="rounded-bl-lg border-primary p-2 text-left font-bold"
                      >
                        Total Charge
                      </td>
                      <td className="rounded-br-lg border-primary p-2 text-right font-bold text-black">
                        Rp.{" "}
                        {(parseInt(price.delivery) + totalPrice).toLocaleString(
                          "id-ID"
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>

      {/* Right Side */}
      <>
        {orderStatus === "Canceled" || orderStatus === "Completed" ? (
          <div className="w-[100%] border-stroke lg:w-[35%]">
            <div className="rounded-md border-[1px] border-stroke bg-white px-5 py-2">
              <div className="p-3">
                <h1 className="text-center text-lg font-bold text-primary">
                  Service Payment
                </h1>
              </div>
              <div className="px-5 py-2">
                <div className="mb-3 flex justify-between">
                  <label className="font-medium text-dark-secondary dark:text-white">
                    Service Fee
                  </label>
                  <label className="font-medium text-dark dark:text-white">
                    Rp.{" "}
                    {
                      AxolotlServices.find(
                        (service) => service.name === serviceDetails.serviceType
                      )?.price
                    }
                  </label>
                </div>
                <div className="flex justify-between">
                  <label className="font-medium text-dark-secondary dark:text-white">
                    Days of Visit
                  </label>
                  <label className="font-medium text-dark dark:text-white">
                    {serviceDetails.totalDays}x
                  </label>
                </div>
                <div className="my-5 h-[0.5px] w-full bg-kalbe-light"></div>
                <div className="mb-5 flex justify-between">
                  <label className="text-lg text-dark dark:text-white">
                    Total Charge
                  </label>
                  <label className="text-lg font-bold text-dark dark:text-white">
                    Rp. {serviceDetails.totalCharge}
                  </label>
                </div>
                <div className="mb-3">
                  <h1 className="mb-2 text-lg font-bold">Payment Status</h1>
                  <div className="rounded-md border-[1px] border-primary bg-kalbe-ultraLight px-5 py-2">
                    <h1 className="text-center text-lg font-semibold text-primary">
                      Verified
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : orderStatus === "Ongoing" && serviceDetails.rate ? (
          <div className="w-[100%] border-stroke lg:w-[35%]">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <button
                className={`${medicineIsPaid !== "Verified" && medicineOrderId ? "border-primary bg-primary" : "disabled pointer-events-none border-dark-secondary bg-dark-secondary "} mb-4 w-full rounded border py-2 text-lg font-bold text-white`}
                onClick={() =>
                  router.push(
                    `/patient/health-services/appointment/additional?medicineId=${medicineOrderId}&orderId=${serviceDetails.orderId}`
                  )
                }
              >
                Additional Medicine
              </button>
              <button
                className="flex w-full items-center justify-center gap-2 rounded border border-primary py-2 text-lg font-bold text-primary hover:bg-kalbe-ultraLight hover:text-primary"
                onClick={() => alert("Order Finished!")}
              >
                <IconMessage size={25} />
                Chat With Caregiver
              </button>
              <ToastContainer />
            </div>
          </div>
        ) : (
          orderStatus === "Ongoing" &&
          !medicineOrderId &&
          !serviceDetails.rate && (
            <div className="flex h-full w-full justify-center rounded-md border border-stroke lg:w-[35%]">
              <div className="w-full max-w-md rounded-lg bg-white p-6">
                <div>
                  <p className="mb-5 text-center text-2xl font-bold text-primary">
                    Service Rating
                  </p>
                  <p className="mb-3 text-dark-secondary">
                    How is your experience?
                  </p>
                </div>
                <div className="mb-5.5 flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`ms-3 h-8 w-8 cursor-pointer ${index <= (serviceDetails.rate ? serviceDetails.rate - 1 : rating) ? "text-yellow-300" : "text-gray-300 dark:text-gray-500"}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                      onClick={() => setRating(index)}
                    >
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                  ))}
                </div>
                <div className="border-b-[0.5px] border-primary">
                  <p className="my-3 text-center text-lg">
                    {serviceDetails.rate
                      ? serviceDetails.rate === 5
                        ? "Satisfied"
                        : serviceDetails.rate >= 3
                          ? "Good"
                          : "Dissatisfied"
                      : rating === 4
                        ? "Satisfied"
                        : rating >= 2
                          ? "Good"
                          : "Dissatisfied"}
                  </p>
                </div>
                {!rated && serviceDetails.rate === null && (
                  <AxolotlButton
                    label="Rate"
                    variant="primary"
                    fontThickness="bold"
                    customClasses="w-full mt-7"
                    onClick={handleRateCaregiver}
                  />
                )}
              </div>
            </div>
          )
        )}
      </>
    </div>
  );
};

export default OrderDetail;
