import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import { getAdminMedicineById } from "../actions";
import { AdminMedicineTable } from "../table/data";
import ViewMedicine from "@/components/Admin/Manage/Medicine/ViewMedicine";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";

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

  if (!medicine) {
    return (
      <DefaultLayout>
        <div className="mx-20 flex h-[75vh] w-auto items-center justify-center">
          <h1 className="mb-5 text-heading-1 font-bold">
            Something went wrong
          </h1>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <AdminBreadcrumbs
        parentPage="Manage"
        subPage="Medicine"
        pageName="View"
      />
      <ViewMedicine medicine={medicine} />
    </DefaultLayout>
  );
}

export default AdminShowMedicine;
