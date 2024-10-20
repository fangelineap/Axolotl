"use client";

import { DataTable } from "@/components/Tables/DataTable";
import React, { useState } from "react";
import { AdminUserTable } from "./data";
import { columns } from "./columns";
import { ColumnDef } from "@tanstack/react-table";
import AxolotlModal from "@/components/Axolotl/Modal/AxolotlModal";
import { toast, ToastContainer } from "react-toastify";
import { deleteAdminUserFromUserTable } from "../actions";
import { useRouter } from "next/navigation";

interface ManageUserTableProps {
  initialData: AdminUserTable[];
}

function ManageUserTable({ initialData }: ManageUserTableProps) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserTable | null>(null);
  const router = useRouter();

  const handleDeleteClick = (user: AdminUserTable) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleModalConfirm = async () => {
    if (selectedUser && selectedUser.user_id) {
      try {
        await deleteAdminUserFromUserTable(selectedUser.user_id);
        toast.success("User deleted successfully", {
          position: "bottom-right"
        });

        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete user. Please try again.", {
          position: "bottom-right"
        });
      } finally {
        handleModalClose();
      }
    }
  };

  return (
    <div className="mb-10">
      <ToastContainer />
      <DataTable
        data={initialData}
        columns={columns as ColumnDef<AdminUserTable>[]}
        showAction={(row: AdminUserTable) => row}
        deleteAction={(row: AdminUserTable) => handleDeleteClick(row)}
        initialSorting={[{ id: "Role", desc: false }]}
      />

      <AxolotlModal
        isOpen={openModal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title="Confirmation"
        question="Are you sure you want to delete this user? This action cannot be undone."
        action="delete"
        user={selectedUser}
      />
    </div>
  );
}

export default ManageUserTable;
