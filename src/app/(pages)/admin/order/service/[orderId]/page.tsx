import { adminGetOrderLogsByOrderId } from "@/app/_server-action/admin";
import ViewOrderDetails from "@/components/Admin/Order/ViewOrderDetails";
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
    title: `Order ID ${response.patient.users.first_name} ${response.patient.users.last_name} Details`
  };
}

/**
 * * Render Admin Detailed Service Order Page
 * @param params
 * @returns
 */
async function AdminShowServiceOrder({ params }: AdminShowServiceOrderProps) {
  const data = await fetchData({ params });

  if (!data) {
    return (
      <CustomLayout>
        <div className="mx-20 flex h-[75vh] w-auto items-center justify-center">
          <h1 className="mb-5 text-heading-1 font-bold">
            Something went wrong
          </h1>
        </div>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout>
      <CustomBreadcrumbs
        parentPage="Order"
        subPage="Service Logs"
        pageName="Details"
      />
      <h1 className="mb-5 text-heading-1 font-bold">
        Order {data.patient.users.first_name} {data.patient.users.last_name}{" "}
        Details
      </h1>
      <ViewOrderDetails orderType="service" data={data} />
    </CustomLayout>
  );
}

export default AdminShowServiceOrder;
