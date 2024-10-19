"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { DataTable } from "@/components/Tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchOrdersByCaregiver } from "@/app/_server-action/caregiver";
import type { CaregiverOrderDetails } from "../type/data";
import { Skeleton } from "@mui/material";

/**
 * * Default Sort Function; This function will sort the table starting from Ongoing, Completed, and Canceled
 * @param rowA
 * @param rowB
 * @param columnId
 * @returns
 */
const customStatusSort = (rowA: any, rowB: any, columnId: string) => {
  const order: { [key: string]: number } = {
    Ongoing: 0,
    Completed: 1,
    Canceled: 2
  };
  const statusA = rowA.getValue(columnId);
  const statusB = rowB.getValue(columnId);

  return order[statusA] - order[statusB];
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusColor: Record<string, string> = {
          Ongoing: "bg-yellow-light text-yellow-dark",
          Canceled: "bg-red-light text-red",
          Completed: "bg-kalbe-ultraLight text-primary"
        };
        const status = row.original.status;
        const colorClass = statusColor[status] || "bg-gray-500 text-white";

        return (
          <div className="flex items-center justify-center">
            <span
              className={`rounded-full px-2 py-1 text-xs font-bold ${colorClass}`}
            >
              {status}
            </span>
          </div>
        );
      },
      id: "Status",
      enableSorting: true,
      enableColumnFilter: true,
      sortingFn: customStatusSort,
      filterFn: "equals"
    }
  ];

  // Handle action to show order details
  const handleShowAction = (orderData: CaregiverOrderDetails) => {
    const query = new URLSearchParams({
      orderType: orderData.appointment.service_type,
      patientName: `${orderData.patient?.users?.first_name}`,
      status: orderData.status
    }).toString();

    router.push(`/order/${orderData.id}?${query}`);
  };

  return (
    <DefaultLayout>
      <div className="mb-4 text-sm text-gray-500">
        <span>Dashboard / </span>
        <span>Order / </span>
        <span>Service Order</span>
      </div>

      <h1 className="mb-6 text-5xl font-bold text-gray-800">Service Order</h1>
      {loading ? (
        // **Render Skeletons when loading is true**
        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          {/* Skeleton for the table */}
          <Skeleton
            variant="rectangular"
            width="100%"
            animation="wave"
            height={300}
            className="rounded-lg"
          />
        </div>
      ) : (
        // **Render actual content when loading is false**
        <div>
          {orderData.length === 0 ? (
            <div>No orders found.</div>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow">
              <DataTable
                data={orderData}
                columns={columns}
                basePath="/caregiver/order"
                showAction={handleShowAction}
                initialSorting={[{ id: "Status", desc: false }]}
              />
            </div>
          )}
        </div>
      )}
    </DefaultLayout>
  );
};

export default OrderPage;
