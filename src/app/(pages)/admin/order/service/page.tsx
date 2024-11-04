import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import { getAdminAllOrderServiceLogs } from "./actions";
import OrderServiceLogsTable from "./table/OrderServiceLogsTable";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";

export const metadata = getAdminMetadata("Order Service");

async function getOrderServiceLogs() {
  const data = await getAdminAllOrderServiceLogs();

  if (!data.length) return [];

  return data;
}

async function AdminOrderService() {
  const data = await getOrderServiceLogs();

  return (
    <div className="bg-gray">
      <CustomLayout>
        <CustomBreadcrumbs parentPage="Order" pageName="Service Logs" />
        <h1 className="mb-5 text-heading-1 font-bold">Service Logs</h1>
        <OrderServiceLogsTable initialData={data} />
      </CustomLayout>
    </div>
  );
}

export default AdminOrderService;
