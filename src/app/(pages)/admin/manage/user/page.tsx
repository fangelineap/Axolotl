import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Axolotl - Admin Manage User",
};

function AdminManageUser() {
  return (
    <DefaultLayout>
      <div>AdminManageUser</div>
    </DefaultLayout>
  );
}

export default AdminManageUser;
