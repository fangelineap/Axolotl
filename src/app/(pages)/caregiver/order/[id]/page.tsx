import { fetchOrderDetail } from "@/app/_server-action/caregiver";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import OrderDetail from "@/components/Caregiver/OrderDetail/OrderDetail";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { redirect } from "next/navigation";
import { globalFormatDate } from "../../../../../utils/Formatters/GlobalFormatters";
import type { CaregiverOrderDetails } from "../../type/data";
import { getCaregiverMetadata } from "@/utils/Metadata/CaregiverMetadata";

export const metadata = getCaregiverMetadata("order detail");
async function getOrderData(orderId: string) {
  try {
    const orderData: CaregiverOrderDetails = await fetchOrderDetail(orderId);

    if (!orderData) {
      return;
    }

    return orderData;
  } catch (error) {
    console.error("Failed to fetch order details:", error);

    return;
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

  return globalFormatDate(endDate, "shortDate") + " / " + appointmentTime;
}

const OrderDetailPage = async ({ params }: { params: { id: string } }) => {
  const orderData = await getOrderData(params.id);

  if (!orderData) {
    return <div>Order not found</div>;
  }

  // Extract user and patient data from orderData
  const user = orderData.user;
  const first_name = user?.first_name;
  const last_name = user?.last_name;
  const address = user?.address;
  const phone_number = user?.phone_number;
  const birthdate = user?.birthdate;
  const proof_of_service = orderData.proof_of_service;

  if (orderData.status === "Ongoing" && !orderData.medicine_order_id) {
    redirect(`/caregiver/order/${params.id}/prepare/${params.id}`);
  }

  return (
    <DefaultLayout>
      <CustomBreadcrumbs parentPage="Order" pageName="Order Details" />

      <h1 className="mb-6 text-5xl font-bold text-gray-800">Order Details</h1>

      <div>
        <OrderDetail
          status={orderData.status}
          patientInfo={{
            name: `${first_name} ${last_name}`,
            address: address || "N/A",
            phoneNumber: phone_number || "N/A",
            birthdate: String(birthdate) || "N/A"
          }}
          medicalDetails={{
            causes: orderData.appointment?.causes || "N/A",
            mainConcerns: orderData.appointment?.main_concern || "N/A",
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
              globalFormatDate(
                new Date(orderData.appointment.appointment_date),
                "shortDate"
              ) +
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
          medications={orderData.medicines.map((detail) => ({
            quantity: detail.quantity,
            name: detail.name || "Unknown",
            price: detail.quantity * detail.price || 0
          }))}
          proofOfService={{
            imageUrl: proof_of_service || ""
          }}
          orderType={orderData.appointment?.id || "N/A"}
          patientName={`${first_name} ${last_name}`}
        />
      </div>
    </DefaultLayout>
  );
};

export default OrderDetailPage;
