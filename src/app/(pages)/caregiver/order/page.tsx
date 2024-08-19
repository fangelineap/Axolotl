"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { DataTable } from "@/components/Tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React from "react";

interface Order {
  id: number;
  orderType: string;
  patientName: string;
  status: string;
}

const statusColorClassMap: Record<string, string> = {
  Ongoing: "bg-yellow-light text-yellow-dark",
  Canceled: "bg-red-light text-red",
  Done: "bg-green-light-3 text-green",
};

const Order = () => {
  const router = useRouter();

  const data: Order[] = [
    {
      id: 1,
      orderType: "After Care",
      patientName: "Axolotl",
      status: "Ongoing",
    },
    {
      id: 2,
      orderType: "After Care",
      patientName: "Axolotl",
      status: "Ongoing",
    },
    {
      id: 3,
      orderType: "After Care",
      patientName: "Axolotl",
      status: "Canceled",
    },
    { id: 4, orderType: "After Care", patientName: "Axolotl", status: "Done" },
    { id: 5, orderType: "After Care", patientName: "Axolotl", status: "Done" },
    {
      id: 6,
      orderType: "Neonatal Care",
      patientName: "Arvel",
      status: "Canceled",
    },
    { id: 7, orderType: "Booster", patientName: "Alex", status: "Ongoing" },
    {
      id: 8,
      orderType: "Elderly Care",
      patientName: "Kartawijaya",
      status: "Done",
    },
    { id: 9, orderType: "After Care", patientName: "Monyet", status: "Done" },
  ];

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
    },
    {
      accessorKey: "orderType",
      header: "Order Type",
    },
    {
      accessorKey: "patientName",
      header: "Patient Name",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<string>();
        const colorClass =
          statusColorClassMap[status] || "bg-gray-500 text-white";

        return (
          <span
            className={`rounded-full px-2 py-1 text-xs font-bold ${colorClass}`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const handleShowAction = (row: Order) => {
    router.push(`/order?id=${row.id}`);
  };

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
            data={data}
            columns={columns}
            basePath="/caregiver/order"
            showAction={handleShowAction}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Order;
