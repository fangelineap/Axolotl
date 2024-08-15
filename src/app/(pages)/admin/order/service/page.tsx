import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Axolotl - Admin Order Service Logs",
};

function AdminOrderService() {
  return (
    <DefaultLayout>
      <div>AdminOrderService</div>
    </DefaultLayout>
  );
}

export default AdminOrderService;
