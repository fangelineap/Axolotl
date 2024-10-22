"use client";

import { DataTable } from "@/components/Tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { columns } from "./columns";
import { AdminOrderMedicineLogsTable } from "./data";

interface OrderMedicineLogsProps {
  initialData: AdminOrderMedicineLogsTable[];
}

function OrderMedicineLogs({ initialData }: OrderMedicineLogsProps) {
  console.log({ initialData });

  return (
    <div className="mb-10">
      <DataTable
        data={initialData}
        columns={columns as ColumnDef<AdminOrderMedicineLogsTable>[]}
        showAction={(row: AdminOrderMedicineLogsTable) => row}
        initialSorting={[{ id: "Status", desc: false }]}
        selectInputOptions={["Canceled", "Ongoing", "Completed"]}
      />
    </div>
  );
}

export default OrderMedicineLogs;
