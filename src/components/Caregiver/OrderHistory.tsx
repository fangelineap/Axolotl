"use client";
import { CaregiverOrderDetails } from "@/app/(pages)/caregiver/type/data";
import { fetchOrdersByCaregiver } from "@/app/_server-action/caregiver";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
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

const OrderPage = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<CaregiverOrderDetails[]>([]); // Set to an array of orders
  const [loading, setLoading] = useState(true); // State to handle loading

  useSWR("orderData", fetchOrdersByCaregiver, {
    revalidateOnFocus: true,
    onSuccess: (data) => {
      setOrderData(data);
      setLoading(false);
    }
  });

  // Define the columns for the table
  const columnHelper = createColumnHelper<CaregiverOrderDetails>();

  function userFullName(row: any) {
    return `${row.patient.users?.first_name} ${row.patient.users?.last_name}`.trim();
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
      id: "Patient Name",
      header: "Patient Name",
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
  const handleShowAction = (orderData: CaregiverOrderDetails) => {
    const query = new URLSearchParams({
      orderType: orderData.appointment.service_type,
      patientName: `${orderData.patient?.users?.first_name}`,
      status: orderData.status
    }).toString();

    router.push(`/order/${orderData.id}?${query}`);
  };

  return (
    <div className="bg-gray">
      <CustomLayout>
        <CustomBreadcrumbs subPage="Order Logs" pageName="Service Order Logs" />
        <h1 className="mb-6 text-5xl font-bold">Service Order</h1>
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
              <DataTable
                data={orderData}
                columns={columns as ColumnDef<CaregiverOrderDetails>[]}
                basePath="/caregiver/order"
                showAction={handleShowAction}
                initialSorting={[
                  { id: "Status", desc: false },
                  { id: "Appointment Date", desc: false }
                ]}
                selectStatusOptions={["Canceled", "Ongoing", "Completed"]}
              />
            )}
          </div>
        )}
      </CustomLayout>
    </div>
  );
};

export default OrderPage;
