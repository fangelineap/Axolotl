"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { DataTable } from "@/components/Tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { PatientOrderDetails } from "../type/data";
import { fetchOrdersByPatient } from "@/app/_server-action/patient";

// Define the status color map
const statusColorClassMap: Record<string, string> = {
  Ongoing: "bg-yellow-light text-yellow-dark",
  Canceled: "bg-red-light text-red",
  Done: "bg-green-light-3 text-green"
};

const OrderHistory = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<PatientOrderDetails[]>([]); // Set to an array of orders
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch order data when the component is mounted
  useEffect(() => {
    const getOrderData = async () => {
      setLoading(true);

      try {
        const orders = await fetchOrdersByPatient(); // Fetch data from the database

        console.log("orders", orders);
        if (!orders) {
          throw new Error("Failed to fetch orders");
        }
        setOrderData(orders); // Set the fetched data into state
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
        setLoading(false); // Stop loading on error
      }
    };

    getOrderData(); // Call the function when the component mounts
  }, []);

  orderData.forEach((order) => {
    console.log("cg name", order.caregiver?.users?.first_name); // Access the first name for each order
  });

  // Define the columns for the table
  const columns: ColumnDef<PatientOrderDetails>[] = [
    { accessorKey: "id", header: "Order ID" },
    { accessorKey: "appointment.service_type", header: "Order Type" },
    {
      accessorKey: "patient.users.first_name",
      header: "Caregiver Name",
      cell: ({ row }) => `${row.original.caregiver?.users?.first_name || "N/A"}`
    },
    {
      accessorKey: "is_completed",
      header: "Status",
      cell: ({ row }) => {
        const isCompleted = row.original.status;
        const status = isCompleted ? "Done" : "Ongoing";
        const colorClass =
          statusColorClassMap[status] || "bg-gray-500 text-white";

        return (
          <span
            className={`rounded-full px-2 py-1 text-xs font-bold ${colorClass}`}
          >
            {status}
          </span>
        );
      }
    }
  ];

  // Handle action to show order details
  const handleShowAction = (orderData: PatientOrderDetails) => {
    const query = new URLSearchParams({
      orderType: orderData.appointment.service_type,
      caregiverName: `${orderData.caregiver?.users?.first_name}`,
      status: orderData.status
    }).toString();

    router.push(`/order-detail/${orderData.id}?${query}`);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading while fetching data
  }

  if (orderData.length === 0) {
    return <div>No orders found.</div>; // Handle no data case
  }

  return (
    <DefaultLayout>
      <div>
        <div className="mb-4 text-sm text-gray-500">
          <span>Dashboard / </span>
          <span>Order / </span>
          <span>Service Order</span>
        </div>

        <h1 className="mb-6 text-5xl font-bold text-gray-800">Service Order</h1>

        <div className="rounded-lg bg-white p-6 shadow">
          <DataTable
            data={orderData} // Pass the data array
            columns={columns} // Pass the columns configuration
            basePath="/patient/order-history"
            showAction={handleShowAction} // Define the action handler
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default OrderHistory;
