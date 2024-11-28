"use client";

import { DataTable } from "@/components/Tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { columns } from "./columns";
import { AdminOrderServiceLogsTable } from "./data";

interface OrderServiceLogsTableProps {
  initialData: AdminOrderServiceLogsTable[];
}

function OrderServiceLogsTable({ initialData }: OrderServiceLogsTableProps) {
  return (
    <div className="mb-10">
      <DataTable
        data={initialData}
        columns={columns as ColumnDef<AdminOrderServiceLogsTable>[]}
        showAction={(row: AdminOrderServiceLogsTable) => row}
        initialSorting={[
          { id: "Status", desc: false },
          { id: "Appointment Date", desc: false }
        ]}
        selectStatusOptions={["Canceled", "Ongoing", "Completed"]}
      />
    </div>
  );
}

export default OrderServiceLogsTable;
