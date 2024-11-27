"use client";

import { getIncompleteUserPersonalInformation } from "@/app/_server-action/auth";
import { DataTable } from "@/components/Tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { columns } from "./columns";
import { AdminApprovalTable } from "./data";

interface ManageApprovalTableProps {
  initialData: AdminApprovalTable[];
}

function ManageApprovalTable({ initialData }: ManageApprovalTableProps) {
  const router = useRouter();

  const determinePersonalInfo = async (user: AdminApprovalTable) => {
    const { is_complete } = await getIncompleteUserPersonalInformation(
      user.users.id,
      user.users.role
    );

    if (!is_complete) {
      toast.error("User has incomplete personal information", {
        position: "bottom-right"
      });

      return;
    }

    router.push(`/admin/manage/approval/${user?.users.user_id}`);
  };

  const handleShowClick = (user: AdminApprovalTable) => {
    determinePersonalInfo(user);
  };

  return (
    <div className="mb-10">
      <DataTable
        data={initialData}
        columns={columns as ColumnDef<AdminApprovalTable>[]}
        showAction={(row: AdminApprovalTable) => handleShowClick(row)}
        initialSorting={[{ id: "Status", desc: false }]}
      />
    </div>
  );
}

export default ManageApprovalTable;
