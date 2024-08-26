import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import { AdminMedicineTable } from "../../table/data";
import { getAdminMedicineById } from "../../actions";
import UpdateMedicine from "@/components/Admin/Manage/Medicine/UpdateMedicine";

interface MedicinePageProps {
  params: { medicineId: string };
}

async function fetchData({ params }: MedicinePageProps) {
  const response: AdminMedicineTable = await getAdminMedicineById(
    params.medicineId,
  );
  return response;
}

export async function generateMetadata({ params }: MedicinePageProps) {
  const response = await fetchData({ params });

  if (!response) {
    return {
      title: "Medicine Not Found",
    };
  }

  return {
    title: `Update Medicine ${response.name} Details`,
  };
}

async function AdminUpdateMedicine({ params }: MedicinePageProps) {
  const medicine = await fetchData({ params });

  if (!medicine) {
    return (
      <DefaultLayout>
        <div className="mx-20 h-auto w-auto">
          <h1 className="mb-5 text-heading-1 font-bold">Medicine Details</h1>
          <p>No medicine details found.</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <UpdateMedicine medicine={medicine} />
    </DefaultLayout>
  );
}

export default AdminUpdateMedicine;
