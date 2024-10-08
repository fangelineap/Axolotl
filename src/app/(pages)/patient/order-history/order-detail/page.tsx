"use client";
import React, { useEffect, useState } from "react";
import MedicinePreparation from "@/components/Caregiver/MedicinePreparation/page";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrderDetail from "@/components/Patient/OrderDetail";
import { getOrderDetail } from "@/app/server-action/patient";

const medicinePreparation = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const data = await getOrderDetail("4");

      console.log("dataaaaaaa", data);
      if (data) {
        setData(data);
      }
    };

    getData();
  }, []);

  // Sample data to pass to the NewComponent
  const sampleData = {
    orderStatus: "Ongoing",
    patientInfo: {
      name: "Axolotl",
      address: "Jl. Lorem Ipsum, Malang City, East Java, Indonesia, 12345",
      phoneNumber: "08123456789",
      birthdate: "34/13/2054"
    },
    medicalDetails: {
      causes: "Post Fractured Left Arm Surgery",
      mainConcerns: ["Wound Treatment"],
      currentMedicine: ["Paracetamol", "Ibuprofen"],
      symptoms: ["Fever"],
      medicalDescriptions:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Nam ac dolor eget metus scelerisque elementum.",
      conjectures: "Bokek habis topup valo"
    },
    serviceDetails: {
      orderId: "#123456789",
      orderDate: "31/06/2024",
      serviceType: "After Care",
      totalDays: "2x Visit",
      startTime: "32/07/2024 23:59",
      endTime: "33/07/2024 23:59",
      serviceFee: "2 x Rp. 500.000",
      totalCharge: "Rp. 1.000.000"
    },

    price: {
      total: "Rp. 50.000",
      delivery: "Rp. 10.000",
      totalCharge: "Rp. 60.000"
    }
  };

  return (
    <DefaultLayout>
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
            <h2 className="flex h-7 w-7 items-center justify-center rounded-full bg-kalbe-light font-medium text-white">
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
      <div className="">
        <h1 className="mb-4 text-2xl font-bold">Order Details</h1>
        {/* Use the NewComponent and pass sample data as props */}
        {data != null && (
          <OrderDetail
            orderStatus={data.orderStatus}
            caregiverInfo={data.caregiverInfo}
            patientInfo={data.patientInfo}
            medicalDetails={data.medicalDetails}
            medicineDetail={data.medicineDetail}
            serviceDetails={data.serviceDetails}
            price={data.price}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default medicinePreparation;
