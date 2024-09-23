import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import ManageMedicineTable from "./table/ManageMedicineTable";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";
import { getAdminMedicine } from "./actions";

export const metadata = getAdminMetadata("Manage Medicine");

async function AdminManageMedicine() {
  const data = await getAdminMedicine();

  return (
    <div className="bg-gray">
      <DefaultLayout>
        <AdminBreadcrumbs parentPage="Manage" pageName="Medicine" />
        <div className="mx-20 h-auto w-auto">
          <h1 className="mb-5 text-heading-1 font-bold">Medicine List</h1>
          <ManageMedicineTable initialData={data} />
        </div>
      </DefaultLayout>
    </div>
  );
}

export default AdminManageMedicine;
