import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Axolotl - Admin Order Medicine Logs",
};

function AdminOrderMedicine() {
  return (
    <DefaultLayout>
      <div>AdminOrderMedicine</div>
    </DefaultLayout>
  );
}

export default AdminOrderMedicine;
