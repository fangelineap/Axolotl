import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import { getAdminMedicineById } from "../actions";
import { AdminMedicineTable } from "../table/data";

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
    title: `${response.name} Details`,
  };
}

async function AdminShowMedicine({ params }: MedicinePageProps) {
  const medicine = await fetchData({ params });
  const formatDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(medicine.exp_date));

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
      <div className="mx-20 h-auto w-auto">
        <h1 className="mb-5 text-heading-1 font-bold">Medicine Details</h1>
        <h1>Medicine Details ID: {medicine.uuid}</h1>
        <h1>Medicine Name: {medicine.name}</h1>
        <h1>Medicine Type: {medicine.type}</h1>
        <h1>Medicine Price: {medicine.price}</h1>
        <h1>Medicine Expired Date: {formatDate}</h1>
      </div>
    </DefaultLayout>
  );
}

export default AdminShowMedicine;
