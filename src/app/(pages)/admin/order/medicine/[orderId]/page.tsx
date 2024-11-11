import { adminGetOrderLogsByOrderId } from "@/app/_server-action/admin";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import { AdminOrderMedicineLogsTable } from "../table/data";

interface AdminShowMedicineOrderProps {
  params: {
    orderId: string;
  };
}

/**
 * * Fetch Data for Admin Detailed Medicine Order Page
 * @param params
 * @returns
 */
async function fetchData({ params }: AdminShowMedicineOrderProps) {
  const response = await adminGetOrderLogsByOrderId("medicine", params.orderId);

  return response as AdminOrderMedicineLogsTable;
}

/**
 * * Generate Metadata for Admin Detailed Medicine Order Page
 * @param params
 * @returns
 */
export async function generateMetadata({
  params
}: AdminShowMedicineOrderProps) {
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
 * * Render Admin Detailed Medicine Order Page
 * @param params
 * @returns
 */
async function AdminShowMedicineOrder({ params }: AdminShowMedicineOrderProps) {
  const data = await fetchData({ params });

  return (
    <CustomLayout>
      <CustomBreadcrumbs parentPage="Order" pageName="Service Logs" />
      <h1 className="mb-5 text-heading-1 font-bold">{data.status}</h1>
    </CustomLayout>
  );
}

export default AdminShowMedicineOrder;
