"use client";
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrderStatus from "@/components/OrderDetail/OrderStatus";
import PatientInformation from "@/components/OrderDetail/PatientInformation";
import MedicalDetails from "@/components/OrderDetail/MedicalDetails";
import ServiceDetails from "@/components/OrderDetail/ServiceDetails";
import AdditionalMedications from "@/components/OrderDetail/AdditionaMedications";
import ProofOfService from "@/components/OrderDetail/ProofOfService";
import { useParams, useRouter } from "next/navigation";

const orders = [
  {
    id: 1,
    status: "Cancel",
    patientInfo: {
      name: "Axolotl",
      address: "Jl. Lorem Ipsum, Malang City, East Java, Indonesia, 12345",
      phoneNumber: "08123456789",
      birthdate: "34/13/2054",
    },
    medicalDetails: {
      causes: "Post Fractured Left Arm Surgery",
      mainConcerns: ["Wound Treatment"],
      currentMedicine: ["Paracetamol", "Ibuprofen"],
      symptoms: ["Fever"],
      medicalDescriptions: "Lorem ipsum dolor sit amet...",
      conjectures: ["Conjecture", "Lack of Money"],
    },
    serviceDetails: {
      orderId: "#123456789",
      orderDate: "31/06/2024",
      serviceType: "After Care",
      totalDays: "2x Visit",
      startTime: "32/07/2024 23:59",
      endTime: "33/07/2024 23:59",
      serviceFee: "2 x Rp. 500.000",
      totalCharge: "Rp. 1.000.000",
    },
    medications: [
      { quantity: 5, name: "PROPOFOL", price: "Rp. 10.000" },
      { quantity: 1, name: "PROPOFOL", price: "Rp. 10.000" },
      { quantity: 1, name: "PROPOFOL", price: "Rp. 10.000" },
      { quantity: 1, name: "PROPOFOL", price: "Rp. 10.000" },
      { quantity: 1, name: "PROPOFOL", price: "Rp. 10.000" },
    ],
    proofOfService: {
      imageUrl: "/images/proof-of-service.jpg",
    },
  },
];

const OrderDetailPage = () => {
  const params = useParams();
  const id = params.id;
  const orderData = orders.find((order) => order.id === parseInt(id as string));

  if (!orderData) {
    return <div>Order not found</div>;
  }

  return (
    <DefaultLayout>
      <div className="mb-4 text-sm text-gray-500">
        <span>Dashboard / </span>
        <span>Order / </span>
        <span>Service Order</span>
      </div>

      <h1 className="mb-6 text-5xl font-bold text-gray-800">Order Details</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrderStatus status={orderData.status} />
          {/* <PatientInformation {...orderData.patientInfo} />
          <MedicalDetails {...orderData.medicalDetails} />
          <ServiceDetails {...orderData.serviceDetails} />
          <AdditionalMedications medications={orderData.medications} /> */}
        </div>
        <div>
          {/* <ProofOfService imageUrl={orderData.proofOfService.imageUrl} /> */}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default OrderDetailPage;
