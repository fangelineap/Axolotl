import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Appointment from "@/components/Patient/Appointment";

const OrderCaregiver = ({ searchParams }: any) => {
  return (
    <DefaultLayout>
      <Appointment caregiverId={searchParams.caregiver} />
    </DefaultLayout>
  );
};

export default OrderCaregiver;
