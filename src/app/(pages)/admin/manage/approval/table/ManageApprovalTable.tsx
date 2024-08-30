"use client";

import { DataTable } from "@/components/Tables/DataTable";
import React from "react";
import { columns } from "./columns";
import { ColumnDef } from "@tanstack/react-table";
import { AdminApprovalTable } from "./data";

interface ManageApprovalTableProps {
  initialData: AdminApprovalTable[];
}

function ManageApprovalTable({ initialData }: ManageApprovalTableProps) {
  return (
    <div className="mb-10">
      <DataTable
        data={initialData}
        columns={columns as ColumnDef<AdminApprovalTable>[]}
        showAction={(row: AdminApprovalTable) => row}
        initialSorting={[{ id: "Status", desc: false }]}
      />
    </div>
  );
}

export default ManageApprovalTable;
