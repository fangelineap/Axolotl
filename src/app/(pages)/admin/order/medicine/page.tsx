import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";
import { getAdminAllOrderMedicineLogs } from "./actions";
import OrderMedicineLogs from "./table/OrderMedicineLogsTable";

export const metadata = getAdminMetadata("Order Medicine");

async function getOrderMedicineLogs() {
  const data = await getAdminAllOrderMedicineLogs();

  if (!data.length) return [];

  return data;
}

async function AdminOrderMedicine() {
  const data = await getOrderMedicineLogs();

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
