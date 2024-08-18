import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import React from "react";
import ManageMedicineTable from "./table/ManageMedicineTable";

export const metadata: Metadata = {
  title: "Axolotl - Admin Manage Medicine",
};

async function AdminManageMedicine() {
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
