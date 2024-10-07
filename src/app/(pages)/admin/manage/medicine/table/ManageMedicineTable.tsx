"use client";

import { DataTable } from "@/components/Tables/DataTable";
import React, { useState } from "react";
import { AdminMedicineTable } from "./data";
import { columns } from "./columns";
import { ColumnDef } from "@tanstack/react-table";
import AxolotlModal from "@/components/Axolotl/Modal/AxolotlModal";
import { deleteAdminMedicine } from "../actions";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

interface ManageMedicineTableProps {
  initialData: AdminMedicineTable[];
}

function ManageMedicineTable({ initialData }: ManageMedicineTableProps) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] =
    useState<AdminMedicineTable | null>(null);
  const router = useRouter();

  const handleDeleteClick = (medicine: AdminMedicineTable) => {
    setSelectedMedicine(medicine);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedMedicine(null);
  };

  const handleModalConfirm = async () => {
    if (selectedMedicine && selectedMedicine.uuid) {
      try {
        await deleteAdminMedicine(selectedMedicine.uuid);
        toast.success("Medicine deleted successfully", {
          position: "bottom-right"
        });

        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete medicine. Please try again.", {
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
        columns={columns as ColumnDef<AdminMedicineTable>[]}
        showAction={(row: AdminMedicineTable) => row}
        deleteAction={(row: AdminMedicineTable) => handleDeleteClick(row)}
        initialSorting={[{ id: "Medicine Name", desc: false }]}
      />

      <AxolotlModal
        isOpen={openModal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title="Confirmation"
        question="Are you sure you want to delete this medicine?"
        action="delete"
        medicine={selectedMedicine}
      />
    </div>
  );
}

export default ManageMedicineTable;
