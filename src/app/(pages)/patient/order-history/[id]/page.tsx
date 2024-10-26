"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrderDetail from "@/components/Patient/OrderDetail";
import { getOrderDetail } from "@/app/_server-action/patient";
import { useParams } from "next/navigation";

const MedicinePreparation = () => {
  const [data, setData] = useState<any>(null);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const getData = async () => {
      const data = await getOrderDetail(id);

      if (data) {
        console.log("data", data);
        setData(data);
      }
    };

    getData();
  }, []);

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

export default MedicinePreparation;
