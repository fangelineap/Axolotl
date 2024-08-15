import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Axolotl - Admin Manage Medicine",
};

function AdminManageMedicine() {
  return (
    <DefaultLayout>
      <div>AdminManageMedicine</div>
    </DefaultLayout>
  );
}

export default AdminManageMedicine;
