"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface OrderDetailProps {
  status: string;
  patientInfo: {
    name: string;
    address: string;
    phoneNumber: string;
    birthdate: string;
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
    price: string;
  }[];
  price: {
    total: string;
    delivery: string;
    totalCharge: string;
  };
  proofOfService: {
    imageUrl: string;
  };
  orderType: string;
  patientName: string;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  status,
  patientInfo,
  medicalDetails,
  serviceDetails,
  medications,
  price,
  proofOfService
}) => {
  const [isMdOrLarger, setIsMdOrLarger] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)"); // Tailwind's 'md' size is 768px
    setIsMdOrLarger(mediaQuery.matches);

    const handleResize = () => setIsMdOrLarger(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

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
            <div className="flex flex-row">
              <div>
                <p className="font-bold text-gray-600">Current Status</p>
              </div>
              <div
                className={`ml-20 inline-block rounded-full px-5 py-1.5 text-xs font-bold text-white ${
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
              <div>{medicalDetails.mainConcerns}</div>
              <div>{medicalDetails.currentMedicine}</div>
              <div>
                {Array.isArray(medicalDetails.symptoms) &&
                medicalDetails.symptoms.length > 0
                  ? medicalDetails.symptoms.join(", ")
                  : "No symptoms available"}
              </div>
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
              <div className="ml-8">{serviceDetails.orderDate}</div>
            </div>
            <div className="my-2 w-full border-b border-black"></div>{" "}
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
              <div className="ml-7.5">{serviceDetails.totalCharge}</div>
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
                      {med.price}
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
                    {price.total}
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
                    {price.delivery}
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
                    {price.totalCharge}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className=" w-full max-w-md rounded-lg  bg-white p-6 lg:mt-0 lg:w-auto">
        <div className="rounded-xl border p-4">
          <h2 className="mb-4 text-center text-xl font-bold text-primary">
            Evidence
          </h2>
          <p className="text-md mb-4 text-left font-bold">Proof of Service</p>
          <div className="mt-4 rounded-lg border p-4">
            <Image
              src={proofOfService.imageUrl}
              alt="Proof of Service"
              className="mx-auto h-auto max-w-full rounded-lg"
              height={500}
              width={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
