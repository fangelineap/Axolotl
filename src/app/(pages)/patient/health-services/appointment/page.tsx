import { getGlobalCaregiverDataByCaregiverOrUserId } from "@/app/_server-action/global";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Appointment from "@/components/Patient/Appointment/Appointment";
import { getPatientMetadata } from "@/utils/Metadata/PatientMetadata";
import { redirect } from "next/navigation";

export const metadata = getPatientMetadata("appointment");

interface OrderCaregiverProps {
  searchParams: {
    caregiver: string;
    role: string;
  };
}

const OrderCaregiver = async ({ searchParams }: OrderCaregiverProps) => {
  const caregiverId = searchParams.caregiver;
  const caregiverRole = searchParams.role;

  if (!caregiverId) {
    redirect(`/patient/health-services?role=${caregiverRole}`);
  }

  const caregiverData = await getGlobalCaregiverDataByCaregiverOrUserId(
    "users",
    caregiverId
  );

  if (!caregiverData) {
    redirect(`/patient/health-services?role=${caregiverRole}`);
  }

  return (
    <DefaultLayout>
      <Appointment caregiverData={caregiverData.data} />
    </DefaultLayout>
  );
};

export default OrderCaregiver;
