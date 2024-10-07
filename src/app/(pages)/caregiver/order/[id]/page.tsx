"use client";
import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrderDetail from "@/components/Caregiver/OrderDetail/page";
import { useParams } from "next/navigation";
import { fetchOrdersByCaregiver } from "@/app/server-action/caregiver/action";
import type { CaregiverOrderDetails } from "../../type/data";

const OrderDetailPage: React.FC = () => {
  const params = useParams();
  const orderId = params.id;

  const [orderData, setOrderData] = useState<CaregiverOrderDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  function calculateEndTime(
    appointmentDate: Date,
    dayOfVisit: number,
    appointmentTime: string
  ): string {
    // Combine the date and time into a single Date object
    const [hours, minutes] = appointmentTime.split(":");
    const startDate = new Date(appointmentDate);
    startDate.setHours(parseInt(hours), parseInt(minutes));

    // Add the number of days from dayOfVisit
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + dayOfVisit);

    // Return the end time in the desired format
    return endDate.toISOString().split("T")[0] + " / " + appointmentTime;
  }

  // Fetch the order data based on the ID from the URL
  useEffect(() => {
    const getOrderData = async () => {
      setLoading(true);
      const orders = await fetchOrdersByCaregiver();

      // Check if orders are being fetched correctly
      console.log("Fetched Orders:", orders);

      // Ensure the id is compared as a string
      const order = orders.find(
        (order: CaregiverOrderDetails) => String(order.id) === String(orderId)
      );

      setOrderData(order || null);
      setLoading(false);
    };

    if (orderId) {
      getOrderData();
    }
  }, [orderId]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
          status={orderData.is_completed ? "Completed" : "Ongoing"}
          patientInfo={{
            name: `${orderData.user.first_name}  ${orderData.user.last_name}`,
            address: `${orderData.user.address}`,
            phoneNumber: `${orderData.user.phone_number}`,
            birthdate: `${orderData.user.birthdate}`
          }}
          medicalDetails={{
            causes: `${orderData.appointment?.causes}`,
            mainConcerns: `${orderData.appointment?.main_concern}`,
            currentMedicine: `${orderData.appointment?.current_medication}`,
            symptoms:
              Array.isArray(orderData.appointment?.symptoms) &&
              orderData.appointment?.symptoms.length > 0
                ? orderData.appointment.symptoms
                : [],
            medicalDescriptions: `${orderData.appointment?.medical_description}`,
            conjectures: `${orderData.appointment?.diagnosis}`
          }}
          serviceDetails={{
            orderId: `#${orderData.id}`,
            orderDate: orderData.created_at
              ? orderData.created_at.toString()
              : "N/A",
            serviceType: orderData.appointment
              ? orderData.appointment.service_type
              : "N/A",
            totalDays: orderData.appointment?.day_of_visit,
            startTime:
              new Date(orderData.appointment.appointment_date)
                .toISOString()
                .split("T")[0] +
              " / " +
              orderData.appointment?.appointment_time,

            endTime: calculateEndTime(
              orderData.appointment.appointment_date,
              orderData.appointment?.day_of_visit || 0,
              orderData.appointment.appointment_time
            ),
            serviceFee: orderData.appointment.total_payment,
            totalCharge: orderData.total_payment
          }}
          price={{
            total:
              orderData.medicineOrder?.sub_total_medicine?.toString() || "N/A",
            delivery:
              orderData.medicineOrder?.delivery_fee?.toString() || "N/A",
            totalCharge:
              orderData.medicineOrder?.total_price?.toString() || "N/A"
          }}
          medications={
            orderData.medicineOrder?.orderDetail?.map((detail) => ({
              quantity: detail.quantity,
              name: detail.medicine?.name || "N/A",
              price: detail.total_price.toString()
            })) || []
          }
          proofOfService={{
            imageUrl: orderData.user.caregiver?.profile_photo_url || ""
          }}
          orderType={orderData.appointment ? orderData.appointment.id : "N/A"}
          patientName={`${orderData.user.first_name} ${orderData.user.last_name}`}
        />
      </div>
    </DefaultLayout>
  );
};

export default OrderDetailPage;
