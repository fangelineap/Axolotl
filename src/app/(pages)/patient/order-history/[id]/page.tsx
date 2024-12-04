import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import OrderDetailContainer from "@/components/Patient/OrderDetailContainer";
import { getPatientMetadata } from "@/utils/Metadata/PatientMetadata";

export const metadata = getPatientMetadata("order detail");

const page = () => {
  return (
    <CustomLayout>
      <OrderDetailContainer />
    </CustomLayout>
  );
};

export default page;
