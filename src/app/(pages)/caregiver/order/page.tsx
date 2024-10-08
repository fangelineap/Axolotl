"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { DataTable } from "@/components/Tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchOrdersByCaregiver } from "@/app/server-action/caregiver/action";
import type { CaregiverOrderDetails } from "../type/data";

// Define the status color map
const statusColorClassMap: Record<string, string> = {
  Ongoing: "bg-yellow-light text-yellow-dark",
  Canceled: "bg-red-light text-red",
  Done: "bg-green-light-3 text-green"
};

const OrderPage = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<CaregiverOrderDetails[]>([]); // Set to an array of orders
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch order data when the component is mounted
  useEffect(() => {
    const getOrderData = async () => {
      setLoading(true);

      try {
        const orders = await fetchOrdersByCaregiver(); // Fetch data from the database

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
    console.log(order.patient?.users?.first_name); // Access the first name for each order
  });

  // Define the columns for the table
  const columns: ColumnDef<CaregiverOrderDetails>[] = [
    { accessorKey: "id", header: "Order ID" },
    { accessorKey: "appointment.service_type", header: "Order Type" },
    {
      accessorKey: "patient.users.first_name",
      header: "Patient Name",
      cell: ({ row }) => `${row.original.patient?.users?.first_name || "N/A"}`
    },
    {
      accessorKey: "is_completed",
      header: "Status",
      cell: ({ row }) => {
        const isCompleted = row.original.is_completed;
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
  const handleShowAction = (orderData: CaregiverOrderDetails) => {
    const query = new URLSearchParams({
      orderType: orderData.appointment.service_type,
      patientName: `${orderData.patient?.users?.first_name}`,
      status: orderData.is_completed ? "Done" : "Ongoing"
    }).toString();

    router.push(`/order/${orderData.id}?${query}`);
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
            basePath="/caregiver/order"
            showAction={handleShowAction} // Define the action handler
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default OrderPage;
