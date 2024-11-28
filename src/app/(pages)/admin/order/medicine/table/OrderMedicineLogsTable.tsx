"use client";

import { DataTable } from "@/components/Tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { columns } from "./columns";
import { AdminOrderMedicineLogsTable } from "./data";

interface OrderMedicineLogsProps {
  initialData: AdminOrderMedicineLogsTable[];
}

function OrderMedicineLogs({ initialData }: OrderMedicineLogsProps) {
  return (
    <div className="mb-10">
      <DataTable
        data={initialData}
        columns={columns as ColumnDef<AdminOrderMedicineLogsTable>[]}
        showAction={(row: AdminOrderMedicineLogsTable) => row}
        initialSorting={[
          { id: "Status", desc: false },
          { id: "Appointment Date", desc: false }
        ]}
        selectStatusOptions={["Canceled", "Ongoing", "Completed"]}
      />
    </div>
  );
}

export default OrderMedicineLogs;
