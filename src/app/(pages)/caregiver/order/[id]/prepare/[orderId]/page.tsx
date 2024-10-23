import MedicinePreparation from "@/components/Caregiver/MedicinePreparation/MedicinePreparation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { medicinePreparation } from "@/app/_server-action/caregiver";
import { CaregiverOrderDetails } from "@/app/(pages)/caregiver/type/data";

async function getMedicinePreparationData(id: string) {
  try {
    const data: CaregiverOrderDetails = await medicinePreparation(id);

    if (!data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch medicine preparation details:", error);

    return null;
  }
}

function calculateEndTime(
  appointmentDate: Date,
  dayOfVisit: number,
  appointmentTime: string
): string {
  const [hours, minutes] = appointmentTime.split(":");
  const startDate = new Date(appointmentDate);
  startDate.setHours(parseInt(hours), parseInt(minutes));

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + dayOfVisit);

  return endDate.toISOString().split("T")[0] + " / " + appointmentTime;
}

const MedicinePreparationPage = async ({
  params
}: {
  params: { orderId: string };
}) => {
  const orderData = await getMedicinePreparationData(params.orderId);

  if (!orderData) {
    throw new Error("Failed to fetch order data");
  }

  // Extract user and patient data from orderData
  const user = orderData.patient?.users;
  const first_name = user?.first_name;
  const last_name = user?.last_name;
  const address = user?.address;
  const phone_number = user?.phone_number;
  const birthdate = user?.birthdate;

  return (
    <DefaultLayout>
      <div className="mb-4 text-sm text-gray-500">
        <span>Dashboard / </span>
        <span>Order / </span>
        <span>Medicine Preparation</span>
      </div>

      <h1 className="mb-6 text-5xl font-bold text-gray-800">
        Preparing Medicine...
      </h1>
      <div>
        <MedicinePreparation
          orderStatus={orderData.status}
          patientInfo={{
            name: `${first_name} ${last_name}`,
            address: address,
            phoneNumber: phone_number,
            birthdate: birthdate
          }}
          medicalDetails={{
            causes: orderData.appointment?.causes,
            mainConcerns: orderData.appointment?.main_concern,
            currentMedicine: orderData.appointment?.current_medication || "N/A",
            symptoms:
              Array.isArray(orderData.appointment?.symptoms) &&
              orderData.appointment.symptoms.length > 0
                ? orderData.appointment.symptoms
                : [],
            medicalDescriptions:
              orderData.appointment?.medical_description || "N/A",
            conjectures: orderData.appointment?.diagnosis || "N/A"
          }}
          serviceDetails={{
            orderId: `#${orderData.id}`,
            orderDate: orderData.created_at
              ? orderData.created_at.toString()
              : "N/A",
            serviceType: orderData.appointment?.service_type || "N/A",
            totalDays: orderData.appointment?.day_of_visit,
            startTime:
              new Date(orderData.appointment.appointment_date)
                .toISOString()
                .split("T")[0] +
              " / " +
              orderData.appointment?.appointment_time,
            endTime: calculateEndTime(
              orderData.appointment.appointment_date,
              orderData.appointment?.day_of_visit || 0,
              orderData.appointment.appointment_time
            ),
            serviceFee: orderData.appointment.total_payment,
            totalCharge: orderData.total_payment
          }}
          price={{
            total: orderData.medicineOrder?.sub_total_medicine || 0,
            delivery: orderData.medicineOrder?.delivery_fee || 0,
            totalCharge: orderData.total_payment || 0
          }}
        />
      </div>
    </DefaultLayout>
  );
};

export default MedicinePreparationPage;
