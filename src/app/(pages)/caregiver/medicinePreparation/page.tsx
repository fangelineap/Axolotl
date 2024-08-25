"use client";
import React from "react";
import MedicinePreparation from "@/components/Caregiver/MedicinePreparation/page";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const medicinePreparation = () => {
  // Sample data to pass to the NewComponent
  const sampleData = {
    orderStatus: "Ongoing",
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
      medicalDescriptions:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Nam ac dolor eget metus scelerisque elementum.",
      conjectures: "Bokek habis topup valo",
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

    price: {
      total: "Rp. 50.000",
      delivery: "Rp. 10.000",
      totalCharge: "Rp. 60.000",
    },
  };

  return (
    <DefaultLayout>
      <div className="">
        <h1 className="mb-4 text-2xl font-bold">Order Details Page</h1>
        {/* Use the NewComponent and pass sample data as props */}
        <MedicinePreparation
          orderStatus={sampleData.orderStatus}
          patientInfo={sampleData.patientInfo}
          medicalDetails={sampleData.medicalDetails}
          serviceDetails={sampleData.serviceDetails}
          price={sampleData.price}
        />
      </div>
    </DefaultLayout>
  );
};

export default medicinePreparation;
