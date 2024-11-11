import { adminGetOrderLogsByOrderId } from "@/app/_server-action/admin";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import { AdminOrderServiceLogsTable } from "../table/data";

interface AdminShowServiceOrderProps {
  params: {
    orderId: string;
  };
}

/**
 * * Fetch Data for Admin Detailed Service Order Page
 * @param params
 * @returns
 */
async function fetchData({ params }: AdminShowServiceOrderProps) {
  const response = await adminGetOrderLogsByOrderId("service", params.orderId);

  return response as AdminOrderServiceLogsTable;
}

/**
 * * Generate Metadata for Admin Detailed Service Order Page
 * @param params
 * @returns
 */
export async function generateMetadata({ params }: AdminShowServiceOrderProps) {
  const response = await fetchData({ params });

  if (!response) {
    return {
      title: "Order Not Found"
    };
  }

  return {
    title: `Order ID ${response.id} Details`
  };
}

/**
 * * Render Admin Detailed Service Order Page
 * @param params
 * @returns
 */
async function AdminShowServiceOrder({ params }: AdminShowServiceOrderProps) {
  const data = await fetchData({ params });

  return (
    <CustomLayout>
      <CustomBreadcrumbs parentPage="Order" pageName="Service Logs" />
      <h1 className="mb-5 text-heading-1 font-bold">{data.status}</h1>
    </CustomLayout>
  );
}

export default AdminShowServiceOrder;
