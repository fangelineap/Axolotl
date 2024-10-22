import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { Metadata } from "next";
import { getAdminAllOrderMedicineLogs } from "./actions";
import OrderMedicineLogs from "./table/OrderMedicineLogsTable";

export const metadata: Metadata = {
  title: "Axolotl - Admin Order Medicine Logs"
};

async function getOrderServiceLogs() {
  const data = await getAdminAllOrderMedicineLogs();

  if (!data.length) return [];

  return data;
}

async function AdminOrderMedicine() {
  const data = await getOrderServiceLogs();

  return (
    <div className="bg-gray">
      <AdminLayout>
        <AdminBreadcrumbs parentPage="Order" pageName="Medicine Logs" />
        <h1 className="mb-5 text-heading-1 font-bold">Medicine Logs</h1>
        <OrderMedicineLogs initialData={data} />
      </AdminLayout>
    </div>
  );
}

export default AdminOrderMedicine;
