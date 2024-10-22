"use client";

import { DataTable } from "@/components/Tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { AdminOrderServiceLogsTable } from "./data";
import { columns } from "./columns";

interface OrderServiceLogsTableProps {
  initialData: AdminOrderServiceLogsTable[];
}

function OrderServiceLogsTable({ initialData }: OrderServiceLogsTableProps) {
  console.log({ initialData });

  return (
    <div className="mb-10">
      <DataTable
        data={initialData}
        columns={columns as ColumnDef<AdminOrderServiceLogsTable>[]}
        showAction={(row: AdminOrderServiceLogsTable) => row}
        initialSorting={[{ id: "Status", desc: false }]}
        selectInputOptions={["Canceled", "Ongoing", "Completed"]}
      />
    </div>
  );
}

export default OrderServiceLogsTable;
