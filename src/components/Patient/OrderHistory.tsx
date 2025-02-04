"use client";

import { CaregiverOrderDetails } from "@/app/(pages)/caregiver/type/data";
import { PatientOrderDetails } from "@/app/(pages)/patient/type/data";
import { fetchOrdersByPatient } from "@/app/_server-action/patient";
import { DataTable } from "@/components/Tables/DataTable";
import { globalFormatDate } from "@/utils/Formatters/GlobalFormatters";
import { Skeleton } from "@mui/material";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

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

  // Define the columns for the table
  const columnHelper = createColumnHelper<CaregiverOrderDetails>();

  function userFullName(row: any) {
    console.log(row);

    return `${row.caregiver.users?.first_name} ${row.caregiver.users?.last_name}`.trim();
  }

  const statusDisplay: Record<
    "Canceled" | "Ongoing" | "Completed",
    { bgColor: string; textColor: string }
  > = {
    Canceled: { bgColor: "bg-red-light", textColor: "text-red" },
    Ongoing: { bgColor: "bg-yellow-light", textColor: "text-yellow" },
    Completed: { bgColor: "bg-kalbe-ultraLight", textColor: "text-primary" }
  };

  const columns = [
    columnHelper.accessor("appointment.appointment_date", {
      cell: (info) => {
        const created_at = info.getValue();
        const formattedDate = globalFormatDate(
          new Date(created_at),
          "longDate"
        );

        return formattedDate;
      },
      id: "Appointment Date",
      header: "Appointment Date",
      enableSorting: true,
      enableColumnFilter: true
    }),
    columnHelper.accessor("appointment.service_type", {
      cell: (info) => info.getValue(),
      id: "Order Type",
      header: "Order Type",
      enableSorting: true,
      enableColumnFilter: true
    }),
    columnHelper.accessor((row) => userFullName(row), {
      cell: (info) => info.getValue(),
      id: "Caregiver Name",
      header: "Caregiver Name",
      enableSorting: true,
      enableColumnFilter: true
    }),
    columnHelper.accessor("status", {
      cell: (info) => {
        const status = info.getValue() as "Canceled" | "Ongoing" | "Completed";
        const { bgColor, textColor } = statusDisplay[status];

        return (
          <div className={`flex items-center justify-center`}>
            <div className={`rounded-3xl px-3 py-1 ${bgColor}`}>
              <p className={`font-bold ${textColor}`}>{status}</p>
            </div>
          </div>
        );
      },
      id: "Status",
      header: "Status",
      enableSorting: true,
      enableColumnFilter: true,
      sortingFn: customStatusSort
    })
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
    <>
      <h1 className="mb-6 text-5xl font-bold">Order History</h1>
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
          columns={columns as ColumnDef<PatientOrderDetails>[]} // Pass the columns configuration
          basePath="/patient/order-history"
          showAction={handleShowAction} // Define the action handler
          initialSorting={[
            { id: "Status", desc: false },
            { id: "Appointment Date", desc: false }
          ]}
          selectStatusOptions={["Canceled", "Ongoing", "Completed"]}
        />
      )}
    </>
  );
};

export default OrderHistory;
