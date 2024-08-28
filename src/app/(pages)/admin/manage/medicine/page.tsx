import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import ManageMedicineTable from "./table/ManageMedicineTable";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";

export const metadata = getAdminMetadata("Manage Medicine");

function AdminManageMedicine() {
  return (
    <div className="bg-gray">
      <DefaultLayout>
        <AdminBreadcrumbs parentPage="Manage" pageName="Medicine" />
        <div className="mx-20 w-auto">
          <h1 className="mb-5 text-heading-1 font-bold">Medicine List</h1>
          <ManageMedicineTable />
        </div>
      </DefaultLayout>
    </div>
  );
}

export default AdminManageMedicine;
