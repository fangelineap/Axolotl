"use client";

import { DataTable } from "@/components/Tables/DataTable";
import React from "react";
import { AdminMedicineTable, data } from "./data";
import { columns } from "./columns";
import { ColumnDef } from "@tanstack/react-table";

function ManageMedicineTable() {
  return (
    <div className="mb-10">
    <DataTable
      data={data}
      columns={columns as ColumnDef<AdminMedicineTable>[]}
      showAction={(row: AdminMedicineTable) => console.log(row)}
      deleteAction={(row: AdminMedicineTable) => console.log(row)}
    />
    </div>
  );
}

export default ManageMedicineTable;
