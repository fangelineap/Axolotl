"use client";
import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrderDetail from "@/components/Caregiver/OrderDetail/page";
import { useParams, useSearchParams } from "next/navigation";

// TypeScript Types
type PatientInfo = {
  name: string;
  address: string;
  phoneNumber: string;
  birthdate: string;
};

type MedicalDetails = {
  causes: string;
  mainConcerns: string[];
  currentMedicine: string[];
  symptoms: string[];
  medicalDescriptions: string;
  conjectures: string;
};

type ServiceDetails = {
  orderId: string;
  orderDate: string;
  serviceType: string;
  totalDays: string;
  startTime: string;
  endTime: string;
  serviceFee: string;
  totalCharge: string;
};

type Medication = {
  quantity: number;
  name: string;
  price: string;
};

type Price = {
  total: string;
  delivery: string;
  totalCharge: string;
};

type ProofOfService = {
  imageUrl: string;
};

type Order = {
  id: number;
  status: string;
  patientInfo: PatientInfo;
  medicalDetails: MedicalDetails;
  serviceDetails: ServiceDetails;
  medications: Medication[];
  price: Price;
  proofOfService: ProofOfService;
};

// Sample Orders Data
const orders: Order[] = [
  {
    id: 1,
    status: "Ongoing",
    patientInfo: {
      name: "Axolotl",
      address: "Jl. Lorem Ipsum, Malang City, East Java, Indonesia, 12345",
      phoneNumber: "08123456789",
      birthdate: "34/13/2054", // Ensure date format is correct
    },
    medicalDetails: {
      causes: "Post Fractured Left Arm Surgery",
      mainConcerns: ["Wound Treatment"],
      currentMedicine: ["Paracetamol", "Ibuprofen"],
      symptoms: ["Fever"],
      medicalDescriptions:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Nam ac dolor eget metus scelerisque elementum. Integer sit amet turpis quis magna dictum dapibus. Duis convallis, orci sit amet auctor sodales, libero velit dictum purus, ut varius elit justo id arcu. Cras vulputate auctor arcu, at tristique est varius ac. Vivamus dapibus efficitur nulla, sed scelerisque lorem tristique eget. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean a tincidunt nisi. Nam sit amet magna lacus. Ut condimentum, purus sed suscipit placerat, erat arcu suscipit nisi, et elementum eros velit eu justo.",
      conjectures: "Lack of Money",
    },
    serviceDetails: {
      orderId: "#123456789",
      orderDate: "31/06/2024", // Ensure date format is correct
      serviceType: "After Care",
      totalDays: "2x Visit",
      startTime: "32/07/2024 23:59", // Ensure date format is correct
      endTime: "33/07/2024 23:59", // Ensure date format is correct
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
    price: {
      total: "Rp. 50.000",
      delivery: "Rp. 10.000",
      totalCharge: "Rp. 60.000",
    },
    proofOfService: {
      imageUrl: "/images/logo/axolotl.svg",
    },
  },
  // Additional orders can be added here...
];

const OrderDetailPage: React.FC = () => {
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

      <div>
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
          price={{
            total: orderData.price.total,
            delivery: orderData.price.delivery,
            totalCharge: orderData.price.totalCharge,
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
