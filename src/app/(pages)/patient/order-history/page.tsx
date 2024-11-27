import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import OrderHistory from "@/components/Patient/OrderHistory";
import { getPatientMetadata } from "@/utils/Metadata/PatientMetadata";

export const metadata = getPatientMetadata("order history");

const page = () => {
  return (
    <div className="bg-gray">
      <CustomLayout>
        <CustomBreadcrumbs parentPage="Order" pageName="Order History" />
        <OrderHistory />
      </CustomLayout>
    </div>
  );
};

export default page;
