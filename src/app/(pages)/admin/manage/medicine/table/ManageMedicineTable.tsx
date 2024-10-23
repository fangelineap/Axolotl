"use client";

import AxolotlModal from "@/components/Axolotl/Modal/AxolotlModal";
import { DataTable } from "@/components/Tables/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteAdminMedicine } from "../actions";
import { columns } from "./columns";
import { AdminMedicineTable } from "./data";

interface ManageMedicineTableProps {
  initialData: AdminMedicineTable[];
}

function ManageMedicineTable({ initialData }: ManageMedicineTableProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] =
    useState<AdminMedicineTable | null>(null);

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
        question="Are you sure you want to delete this medicine? This action cannot be undone."
        action="delete"
        medicine={selectedMedicine}
      />
    </div>
  );
}

export default ManageMedicineTable;
