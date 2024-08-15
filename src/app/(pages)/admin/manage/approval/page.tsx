import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Axolotl - Admin Manage Approval",
};

function AdminManageApproval() {
  return (
    <DefaultLayout>
      <div>AdminManageApproval</div>
    </DefaultLayout>
  );
}

export default AdminManageApproval;
