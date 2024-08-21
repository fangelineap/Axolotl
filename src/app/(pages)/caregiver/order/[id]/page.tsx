"use client";
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrderDetail from "@/components/Caregiver/OrderDetail/page";
import { useParams, useSearchParams } from "next/navigation";

const orders = [
  {
    id: 1,
    status: "Pending",
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
  // Additional orders can be added here...
];

const OrderDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = parseInt(params.id as string);
  const orderType = searchParams.get("orderType");
  const patientName = searchParams.get("patientName");
  const status = searchParams.get("status");

  const orderData = orders.find((order) => order.id === id);

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
        <OrderDetail
          status={status || orderData.status}
          patientInfo={{
            name: patientName || orderData.patientInfo.name,
            address: orderData.patientInfo.address,
            phoneNumber: orderData.patientInfo.phoneNumber,
            birthdate: orderData.patientInfo.birthdate,
          }}
          medicalDetails={orderData.medicalDetails}
          serviceDetails={{
            orderId: `#${id}`,
            orderDate: orderData.serviceDetails.orderDate,
            serviceType: orderType || orderData.serviceDetails.serviceType,
            totalDays: orderData.serviceDetails.totalDays,
            startTime: orderData.serviceDetails.startTime,
            endTime: orderData.serviceDetails.endTime,
            serviceFee: orderData.serviceDetails.serviceFee,
            totalCharge: orderData.serviceDetails.totalCharge,
          }}
          medications={orderData.medications}
          proofOfService={orderData.proofOfService}
          orderType={orderType || orderData.serviceDetails.serviceType}
          patientName={patientName || orderData.patientInfo.name}
        />
      </div>
    </DefaultLayout>
  );
};

export default OrderDetailPage;
