import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { Metadata } from "next";
import { getAdminAllOrderServiceLogs } from "./actions";
import OrderServiceLogsTable from "./table/OrderServiceLogsTable";

export const metadata: Metadata = {
  title: "Axolotl - Admin Order Service Logs"
};

async function getOrderServiceLogs() {
  const data = await getAdminAllOrderServiceLogs();

  if (!data.length) return [];

  return data;
}

async function AdminOrderService() {
  const data = await getOrderServiceLogs();

  return (
    <div className="bg-gray">
      <AdminLayout>
        <AdminBreadcrumbs parentPage="Order" pageName="Service Logs" />
        <h1 className="mb-5 text-heading-1 font-bold">Service Logs</h1>
        <OrderServiceLogsTable initialData={data} />
      </AdminLayout>
    </div>
  );
}

export default AdminOrderService;
