"use client";
import { fetchOrdersByPatient } from "@/app/_server-action/patient";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import { DataTable } from "@/components/Tables/DataTable";
import { Skeleton } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import type { PatientOrderDetails } from "../type/data";

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

const OrderHistory = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<PatientOrderDetails[]>([]); // Set to an array of orders
  const [loading, setLoading] = useState(true); // State to handle loading

  useSWR("orderData", fetchOrdersByPatient, {
    revalidateOnFocus: true,
    onSuccess: (data) => {
      setOrderData(data);
      setLoading(false);
    }
  });

  orderData.forEach((order) => {
    console.log("cg name", order.caregiver?.users?.first_name); // Access the first name for each order
  });

  // Define the columns for the table
  const columns: ColumnDef<PatientOrderDetails>[] = [
    {
      id: "Appointment Date",
      accessorKey: "appointment.appointment_date",
      header: "Appointment Date",
      cell: (info) => {
        const created_at = info.getValue();
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        }).format(new Date(created_at as string | number));

        return formattedDate;
      }
    },
    {
      id: "Order Type",
      accessorKey: "appointment.service_type",
      header: "Order Type"
    },
    {
      id: "Caregiver Name",
      accessorKey: "caregiver.users.first_name",
      header: "Caregiver Name",
      cell: ({ row }) => `${row.original.caregiver?.users?.first_name || "N/A"}`
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const statusColor: Record<
          "Canceled" | "Ongoing" | "Completed",
          { bgColor: string; textColor: string }
        > = {
          Canceled: { bgColor: "bg-red-light", textColor: "text-red" },
          Ongoing: { bgColor: "bg-yellow-light", textColor: "text-yellow" },
          Completed: {
            bgColor: "bg-kalbe-ultraLight",
            textColor: "text-primary"
          }
        };
        const status = info.getValue() as "Canceled" | "Ongoing" | "Completed";
        const { bgColor, textColor } = statusColor[status];

        return (
          <div className={`flex items-center justify-center`}>
            <div className={`rounded-3xl px-3 py-1 ${bgColor}`}>
              <p className={`font-bold ${textColor}`}>{status}</p>
            </div>
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
  const handleShowAction = (orderData: PatientOrderDetails) => {
    const query = new URLSearchParams({
      orderType: orderData.appointment.service_type,
      caregiverName: `${orderData.caregiver?.users?.first_name}`,
      status: orderData.status
    }).toString();

    router.push(`/order-detail/${orderData.id}?${query}`);
  };

  return (
    <div className="bg-gray">
      <CustomLayout>
        <CustomBreadcrumbs parentPage="Order" pageName="Order History" />
        <h1 className="mb-6 text-5xl font-bold">Order History</h1>
        <div className="rounded-lg bg-white p-6 shadow">
          {loading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              animation="wave"
              height={300}
              className="rounded-lg"
            />
          ) : orderData.length === 0 ? (
            <div>No orders found.</div>
          ) : (
            <DataTable
              data={orderData} // Pass the data array
              columns={columns} // Pass the columns configuration
              basePath="/patient/order-history"
              showAction={handleShowAction} // Define the action handler
            />
          )}
        </div>
      </CustomLayout>
    </div>
  );
};

export default OrderHistory;
