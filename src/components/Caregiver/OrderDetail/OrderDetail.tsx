"use client";
import { getClientPublicStorageURL } from "@/app/_server-action/global/storage/client";
import {
  globalFormatDate,
  globalFormatPrice
} from "@/utils/Formatters/GlobalFormatters";
import { IconX } from "@tabler/icons-react";
import Image from "next/image";
import React from "react";

interface OrderDetailProps {
  status: string;
  notes: string;
  patientInfo: {
    name: string;
    address: string;
    phoneNumber: string;
    birthdate: string;
    allergies: string;
    bloodType: string;
    height: string;
    weight: string;
    isSmoking: boolean;
    currentMedication: string;
    medFreqTimes: string;
    medFreqDay: string;
    illnessHistory: string;
  };
  medicalDetails: {
    causes: string;
    mainConcerns: string;
    currentMedicine: string;
    symptoms: string[];
    medicalDescriptions: string;
    conjectures: string;
  };
  serviceDetails: {
    orderId: string;
    orderDate: string;
    serviceType: string;
    totalDays: number;
    startTime: string;
    endTime: string;
    serviceFee: number;
    totalCharge: number;
  };
  medications: {
    quantity: number;
    name: string;
    price: number;
  }[];
  price: {
    total: number;
    delivery: number;
    totalCharge: number;
  };
  proofOfService: {
    imageUrl: string;
  };
  orderType: string;
  patientName: string;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  status,
  notes,
  patientInfo,
  medicalDetails,
  serviceDetails,
  medications,
  price,
  proofOfService
}) => {
  const proof_of_service_photo = getClientPublicStorageURL(
    "proof_of_service",
    proofOfService.imageUrl
  );

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between">
      {/* Left Side */}
      <div className="mb-6 flex-1 lg:mr-8">
        {/* Order Status */}
        <div className="flex-auto">
          <div className="mb-6">
            <div>
              <h2 className="text-xl font-bold">Order Status</h2>
            </div>
            <div className="mb-3 flex flex-row items-center">
              <div>
                <p className="font-bold text-black">Current Status</p>
              </div>
              <div
                className={`ml-20 inline-block rounded-full px-3 py-2 text-xs font-bold text-white ${
                  status === "Completed"
                    ? "bg-primary"
                    : status === "Ongoing"
                      ? "bg-yellow"
                      : "bg-red"
                }`}
              >
                {status}
              </div>
            </div>
            {/* Canceled */}
            {status === "Canceled" && (
              <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-red bg-red-light p-5 text-center text-red">
                <IconX
                  size={60}
                  className="rounded-full bg-red p-2 text-red-light"
                />
                <h1 className="text-heading-5 font-bold">
                  This order has been canceled
                </h1>
                <h1 className="text-lg font-medium">
                  The system has processed the refund to the patient&apos;s
                  virtual account.
                </h1>
                <div className="w-full text-left">
                  <p>
                    You{" "}
                    <span className="font-medium">
                      have rejected this order
                    </span>{" "}
                    due to the following reasons:
                  </p>
                  <ol className="list-disc pl-5">
                    <li>{notes}</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Patient Information</h2>
          <div className=" mt-2 flex flex-row ">
            <div className=" flex min-w-[200px] flex-col gap-y-1">
              <p>Patient Name</p>
              <p>Address</p>
              <p>Phone Number</p>
              <p>Birthdate</p>
              <p>Allergies</p>
              <p>Blood Type</p>
              <p>Height</p>
              <p>Weight</p>
              <p>Active Smoker</p>
              <p>Current Medication</p>
              <p>Med. Freq. Times</p>
              <p>Med. Freq. Day</p>
              <p>Illness History</p>
            </div>
            <div className="ml-19 flex flex-col gap-y-1 font-normal">
              <div>{patientInfo.name}</div>
              <div>{patientInfo.address}</div>
              <div>{patientInfo.phoneNumber}</div>
              <div>
                {globalFormatDate(new Date(patientInfo.birthdate), "longDate")}
              </div>
              <div>{patientInfo.allergies}</div>
              <div>{patientInfo.bloodType}</div>
              <div>{patientInfo.height} cm</div>
              <div>{patientInfo.weight} kg</div>
              <div>{patientInfo.isSmoking ? "Yes" : "No"}</div>
              <div>{patientInfo.currentMedication}</div>
              <div>{patientInfo.medFreqTimes}</div>
              <div>{patientInfo.medFreqDay}</div>
              <div>{patientInfo.illnessHistory}</div>
            </div>
          </div>
        </div>

        {/* Medical Concerns & Conjecture (Medical Details) */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Medical Concerns & Conjecture</h2>
          <div className=" mt-2 flex flex-row ">
            <div className=" flex min-w-[200px] flex-col gap-y-1">
              <p>Causes</p>
              <p>Main Concerns</p>
              <p>Current Medicine</p>
              <p>Symptoms</p>
            </div>
            <div className="ml-19 flex flex-col gap-y-1 font-normal">
              <div>{medicalDetails.causes}</div>
              <div>{medicalDetails.mainConcerns}</div>
              <div>{medicalDetails.currentMedicine}</div>
              <div>
                <ol className="list-decimal pl-5">
                  {medicalDetails.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <p className="font-medium">Medical Descriptions</p>
            <div className="font-normal">
              {medicalDetails.medicalDescriptions}
            </div>
          </div>

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
          <div className="flex min-w-[200px] flex-col gap-y-1">
            <div className="flex">
              <p className="mr-19.5">Order ID</p>
              <div className="ml-8 font-normal">
                {serviceDetails.orderId}
              </div>{" "}
            </div>
            <div className="flex">
              <p className="mr-15">Order Date</p>
              <div className="ml-8 font-normal">
                {globalFormatDate(
                  new Date(serviceDetails.orderDate),
                  "longDate"
                )}
              </div>
            </div>
            <div className="my-2 w-full border-b border-black"></div>{" "}
            {/* Full-width horizontal line */}
            <div className="flex">
              <p className="mr-12">Service Type</p>
              <div className="ml-8 font-normal">
                {serviceDetails.serviceType}
              </div>
            </div>
            <div className="flex">
              <p className="mr-3">Total Days of Visit</p>
              <div className="ml-8 font-normal">
                {serviceDetails.totalDays}x Visit
              </div>
            </div>
            <div className="flex">
              <p className="mr-6.5">Start Date/Time</p>
              <div className="ml-8 font-normal">
                {globalFormatDate(
                  new Date(serviceDetails.startTime),
                  "longDate"
                )}
              </div>
            </div>
            <div className="flex">
              <p className="mr-8">End Date/Time</p>
              <div className="ml-8 font-normal">
                {globalFormatDate(new Date(serviceDetails.endTime), "longDate")}
              </div>
            </div>
            <div className="flex">
              <p className="mr-14.5">Service Fee</p>
              <div className="ml-8 font-normal">
                {globalFormatPrice(serviceDetails.serviceFee)}
              </div>
            </div>
            <div className="flex">
              <p className="mr-12.5">Total Charge</p>
              <div className="ml-8 font-normal">
                {globalFormatPrice(serviceDetails.totalCharge)}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Medications */}
        <div>
          <h2 className="mb-4 text-xl font-bold">Additional Medications</h2>
          <div className="overflow-hidden rounded-md border border-primary">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-green-light text-white">
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med, index) => (
                  <tr key={index}>
                    <td className="border-primary p-2 text-left">
                      {med.quantity}
                    </td>
                    <td className="border-primary p-2">{med.name}</td>
                    <td className="border-primary p-2 text-right">
                      {globalFormatPrice(med.price)}
                    </td>
                  </tr>
                ))}
                {/* Summary Rows */}
                <tr>
                  <td
                    colSpan={2}
                    className="border-t border-primary p-2 text-left font-bold"
                  >
                    Total Price
                  </td>
                  <td className="border-t border-primary p-2 text-right">
                    {globalFormatPrice(price.total)}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    className="border-primary p-2 text-left font-bold"
                  >
                    Delivery Fee
                  </td>
                  <td className="border-primary p-2 text-right">
                    {globalFormatPrice(price.delivery)}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    className="rounded-bl-lg border-primary p-2 text-left font-bold"
                  >
                    Total Charge
                  </td>
                  <td className="rounded-br-lg border-primary p-2 text-right font-bold text-black">
                    {globalFormatPrice(price.total + price.delivery)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Side */}
      {status === "Completed" && (
        <div className=" w-full max-w-md rounded-lg  bg-white p-6 lg:mt-0 lg:w-auto">
          <div className="rounded-xl border p-4">
            <h2 className="mb-4 text-center text-xl font-bold text-primary">
              Evidence
            </h2>
            <p className="text-md mb-4 text-left font-bold">Proof of Service</p>
            <div className="mt-4 rounded-lg border p-4">
              <Image
                src={proof_of_service_photo}
                alt="Proof of Service"
                className="mx-auto h-auto max-w-full rounded-lg"
                height={500}
                width={500}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
