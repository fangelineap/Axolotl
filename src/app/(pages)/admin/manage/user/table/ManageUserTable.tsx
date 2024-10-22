"use client";

import AxolotlModal from "@/components/Axolotl/Modal/AxolotlModal";
import { DataTable } from "@/components/Tables/DataTable";
import { getUserFromSession } from "@/lib/server";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteAdminUserFromUserTable } from "../actions";
import { columns } from "./columns";
import { AdminUserTable } from "./data";

interface ManageUserTableProps {
  initialData: AdminUserTable[];
}

function ManageUserTable({ initialData }: ManageUserTableProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserTable | null>(null);

  const handleDeleteClick = (user: AdminUserTable) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleModalConfirm = async () => {
    const { data: currentUser, error: currentUserError } =
      await getUserFromSession();

    if (currentUserError || !currentUser) {
      toast.error("Something went wrong. Please try again.", {
        position: "bottom-right"
      });

      handleModalClose();

      return;
    }

    if (selectedUser?.user_id === currentUser.user_id) {
      toast.error(
        "Deleting yourself? I mean, it’s one way to quit your job, but I wouldn’t recommend it.",
        {
          position: "bottom-right"
        }
      );

      handleModalClose();

      return;
    }

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
