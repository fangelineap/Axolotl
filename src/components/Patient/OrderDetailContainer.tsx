"use client";

import React, { useEffect, useState } from "react";
import OrderDetail from "@/components/Patient/OrderDetail";
import { getOrderDetail } from "@/app/_server-action/patient";
import { useParams } from "next/navigation";
import { Skeleton } from "@mui/material";

const OrderDetailContainer = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const getData = async () => {
      const data = await getOrderDetail(id);

      if (data) {
        console.log("data", data);
        setData(data);
        setLoading(false);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      <h1 className="mb-4 text-2xl font-bold">Order Details</h1>
      {/* Use the NewComponent and pass sample data as props */}
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          animation="wave"
          height={300}
          className="rounded-lg"
        />
      ) : (
        data != null && (
          <OrderDetail
            orderStatus={data.orderStatus}
            orderNotes={data.orderNotes}
            medicineOrderId={data.medicineOrderId}
            medicineIsPaid={data.medicineIsPaid}
            caregiverInfo={data.caregiverInfo}
            patientInfo={data.patientInfo}
            medicalDetails={data.medicalDetails}
            medicineDetail={data.medicineDetail}
            serviceDetails={data.serviceDetails}
            price={data.price}
          />
        )
      )}
    </div>
  );
};

export default OrderDetailContainer;
