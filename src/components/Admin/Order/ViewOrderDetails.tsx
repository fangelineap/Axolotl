import { AdminOrderMedicineLogsTable } from "@/app/(pages)/admin/order/medicine/table/data";
import { AdminOrderServiceLogsTable } from "@/app/(pages)/admin/order/service/table/data";
import { getGlobalUserProfilePhoto } from "@/app/_server-action/global";
import { getServerPublicStorageURL } from "@/app/_server-action/global/storage/server";
import CustomDivider from "@/components/Axolotl/CustomDivider";
import { AxolotlServices } from "@/utils/Services";
import { IconStarFilled } from "@tabler/icons-react";
import Image from "next/image";

interface ViewOrderDetailsProps {
  orderType: "service" | "medicine";
  data: AdminOrderServiceLogsTable | AdminOrderMedicineLogsTable;
}

interface StatusDisplayProps {
  borderColor: string;
  bgColor: string;
  textColor: string;
}

function renderFields(fieldName: string[], fieldValue: string[]) {
  return (
    <div className="flex items-center">
      <div className="flex w-75 flex-col gap-2">
        {fieldName.map((field, index) => (
          <p key={index} className="font-medium">
            {field}
          </p>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {fieldValue.map((value, index) => (
          <p key={index}>{value}</p>
        ))}
      </div>
    </div>
  );
}

function calculateEndTime(
  appointmentDate: Date,
  dayOfVisit: number,
  appointmentTime: string
) {
  const [hours, minutes] = appointmentTime.split(":");
  const startDate = new Date(appointmentDate);
  startDate.setHours(parseInt(hours), parseInt(minutes));

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + dayOfVisit);

  return endDate;
}

async function ViewOrderDetails({ orderType, data }: ViewOrderDetailsProps) {
  const serviceLogData = data as AdminOrderServiceLogsTable;
  const medicineLogData = data as AdminOrderMedicineLogsTable;

  const caregiver_id = serviceLogData.caregiver.users.user_id;
  const caregiver_full_name = `${serviceLogData.caregiver.users.first_name} ${serviceLogData.caregiver.users.last_name}`;
  const caregiver_employment_status = serviceLogData.caregiver.employment_type;
  const caregiver_profile_photo = await getGlobalUserProfilePhoto(
    serviceLogData.caregiver.profile_photo
  );

  const patient_id = serviceLogData.patient.users.user_id;
  const patient_full_name = `${serviceLogData.patient.users.first_name} ${serviceLogData.patient.users.last_name}`;
  const patient_address = serviceLogData.patient.users.address;
  const patient_phone_number = serviceLogData.patient.users.phone_number;

  const orderStatus = serviceLogData.status;

  const orderStartDate = new Date(serviceLogData.appointment.appointment_date);
  const orderEndDate = calculateEndTime(
    orderStartDate,
    serviceLogData.appointment.day_of_visit,
    serviceLogData.appointment.appointment_time
  );

  const serviceFee =
    AxolotlServices.find(
      (service) => service.name === serviceLogData.appointment.service_type
    )?.price || 0;

  let orderPoS = "";
  let orderRate = 0;

  if (
    orderStatus === "Completed" &&
    serviceLogData.proof_of_service &&
    serviceLogData.rate
  ) {
    orderPoS =
      (await getServerPublicStorageURL(
        "proof_of_service",
        serviceLogData.proof_of_service
      )) || "";

    orderRate = serviceLogData.rate;
  }

  /**
   * * Status Display Configurations
   */
  const orderStatusDisplay: Record<
    "Canceled" | "Ongoing" | "Completed",
    { bgColor: string }
  > = {
    Canceled: { bgColor: "bg-red" },
    Ongoing: { bgColor: "bg-yellow" },
    Completed: { bgColor: "bg-primary" }
  };

  const statusDisplay: Record<"true" | "false", StatusDisplayProps> = {
    false: {
      borderColor: "border-yellow",
      bgColor: "bg-yellow-light",
      textColor: "text-yellow"
    },
    true: {
      borderColor: "border-primary",
      bgColor: "bg-kalbe-ultraLight",
      textColor: "text-primary"
    }
  };

  const orderStatusDisplayConfig =
    orderStatusDisplay[orderStatus as "Canceled" | "Ongoing" | "Completed"];

  const appointmentPaymentStatus =
    statusDisplay[serviceLogData.appointment.is_paid ? "true" : "false"];

  /**
   * * Formatters
   */
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const priceFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  });

  /**
   * * Helper function to format dates and price
   */
  const formatDate = (date: Date, formatter: Intl.DateTimeFormat) =>
    formatter.format(new Date(date));

  const formatPrice = (price: number) => priceFormatter.format(price);

  /**
   * * Formatted Dates and Price
   */
  const formattedCaregiverReviewDate = formatDate(
    serviceLogData.caregiver.reviewed_at,
    dateFormatter
  );

  const formattedPatientBirthdate = formatDate(
    serviceLogData.patient.users.birthdate,
    dateFormatter
  );

  const formattedOrderDate = formatDate(
    serviceLogData.created_at,
    dateFormatter
  );

  const formattedOrderCompletedAt = formatDate(
    serviceLogData.complete_at,
    dateFormatter
  );

  const formattedAppointmentPaidAt = formatDate(
    serviceLogData.appointment.paid_at,
    dateFormatter
  );

  const formattedOrderStartDate = formatDate(orderStartDate, dateFormatter);
  const formattedOrderEndDate = formatDate(orderEndDate, dateFormatter);

  const formattedServiceFee = formatPrice(serviceFee);
  const formattedServiceTotalPayment = formatPrice(
    serviceLogData.appointment.total_payment
  );

  let medicineSubTotalPrice = 0;
  let medicineDeliveryFee = 0;
  let medicineTotalPrice = 0;

  let medicinePaymentStatus: StatusDisplayProps = {
    borderColor: "",
    bgColor: "",
    textColor: ""
  };

  let medicinePaidAt = new Date();

  if (orderType === "medicine" && medicineLogData.medicineOrder) {
    medicineSubTotalPrice = medicineLogData.medicineOrder.sub_total_medicine;
    medicineDeliveryFee = medicineLogData.medicineOrder.delivery_fee;
    medicineTotalPrice = medicineLogData.medicineOrder.total_price;

    medicinePaymentStatus =
      statusDisplay[medicineLogData.medicineOrder.is_paid ? "true" : "false"];

    medicinePaidAt = medicineLogData.medicineOrder.paid_at || new Date();
  }

  const formattedMedicineSubTotalPrice = formatPrice(medicineSubTotalPrice);
  const formattedMedicineDeliveryFee = formatPrice(medicineDeliveryFee);
  const formattedMedicineTotalPrice = formatPrice(medicineTotalPrice);
  const formattedMedicinePaidAt = formatDate(
    new Date(medicinePaidAt),
    dateFormatter
  );

  return (
    <>
      {/* Container */}
      <div className="flex w-full justify-between gap-10">
        {/* Left Side */}
        <div className="w-[65%]">
          <div className="flex w-full flex-col gap-10">
            {/* Order Status */}
            <div className="flex w-full flex-col gap-2">
              <h1 className="text-heading-6 font-medium">Order Status</h1>
              <div className="flex items-center">
                <p className="w-50 font-medium">Current Status</p>
                <p
                  className={`rounded-full px-3 py-2 font-bold text-white ${orderStatusDisplayConfig.bgColor}`}
                >
                  {orderStatus}
                </p>
              </div>
              {orderStatus === "Completed" && (
                <>
                  <div className="flex items-center">
                    <p className="w-50 font-medium">Completed At</p>
                    <p>{formattedOrderCompletedAt}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="w-50 font-medium">Order Rating</p>
                    <div className="flex items-center gap-3">
                      <IconStarFilled className="text-yellow" />
                      <p>{orderRate}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Caregiver Information */}
            <div className="flex w-full flex-col gap-2">
              <h1 className="text-heading-6 font-medium">
                Caregiver Information
              </h1>
              <div className="my-5 flex w-full items-center justify-center">
                <div
                  className={`h-30 w-30 overflow-hidden rounded-full border`}
                >
                  <Image
                    src={
                      caregiver_profile_photo ??
                      "/images/user/Default Caregiver Photo.png"
                    }
                    alt="User Profile Photo"
                    width={100}
                    height={100}
                    priority
                    className={`h-full w-full object-cover`}
                  />
                </div>
              </div>
              {renderFields(
                [
                  "Caregiver ID",
                  "Caregiver Name",
                  "Caregiver Employment Status",
                  "Caregiver Review Date"
                ],
                [
                  caregiver_id,
                  caregiver_full_name,
                  caregiver_employment_status,
                  formattedCaregiverReviewDate
                ]
              )}
            </div>

            {/* Patient Information */}
            <div className="flex w-full flex-col gap-2">
              <h1 className="text-heading-6 font-medium">
                Patient Information
              </h1>
              {renderFields(
                [
                  "Patient ID",
                  "Patient Name",
                  "Patient Address",
                  "Patient Phone Number",
                  "Patient Birthdate"
                ],
                [
                  patient_id,
                  patient_full_name,
                  patient_address,
                  patient_phone_number,
                  formattedPatientBirthdate
                ]
              )}
            </div>

            {/* Medical Concerns */}
            <div className="flex w-full flex-col gap-2">
              <h1 className="text-heading-6 font-medium">Medical Concerns</h1>
              {renderFields(
                ["Causes", "Main Concerns", "Current Medicine"],
                [
                  serviceLogData.appointment.causes,
                  serviceLogData.appointment.main_concern,
                  serviceLogData.appointment.current_medication
                ]
              )}
              <div className="flex items-center">
                <div className="flex w-75 flex-col gap-2">
                  <p className="font-medium">Symptoms</p>
                </div>
                <ol className="list-decimal pl-5">
                  {serviceLogData.appointment.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ol>
              </div>
              <div className="flex flex-col">
                <div className="flex w-75 flex-col gap-2">
                  <p className="font-medium">Medical Description</p>
                </div>
                <p>{serviceLogData.appointment.medical_description}</p>
              </div>
            </div>

            {/* Service Details */}
            <div className="flex w-full flex-col gap-2">
              <h1 className="text-heading-6 font-medium">Service Details</h1>
              {renderFields(
                ["Order ID", "Order Date"],
                [serviceLogData.id, formattedOrderDate]
              )}
              <CustomDivider horizontal color="black" />
              {renderFields(
                [
                  "Service Type",
                  "Total Days of Visit",
                  "Start Date/Time",
                  "End Date/Time",
                  "Service Fee",
                  "Total Appointment Charge"
                ],
                [
                  serviceLogData.appointment.service_type,
                  `${serviceLogData.appointment.day_of_visit}x Visit`,
                  `${formattedOrderStartDate} ${serviceLogData.appointment.appointment_time}`,
                  `${formattedOrderEndDate} ${serviceLogData.appointment.appointment_time}`,
                  `${serviceLogData.appointment.day_of_visit} x ${formattedServiceFee}`,
                  formattedServiceTotalPayment
                ]
              )}
            </div>

            {/* Additional Medications */}
            {orderType === "medicine" && medicineLogData.medicineOrder && (
              <div className="flex w-full flex-col gap-2">
                <h1 className="text-heading-6 font-medium">Order Item(s)</h1>
                <div className="overflow-hidden rounded-md border border-primary">
                  Table Here
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="w-[35%]">
          <div className="flex w-full flex-col items-start justify-between gap-10">
            {/* PoS */}
            {orderPoS !== "" && (
              <div className="flex w-full flex-col gap-2 rounded-lg border-[1.5px] border-gray-1 p-5">
                <h1 className="text-center text-heading-6 font-bold text-primary">
                  Evidence
                </h1>
                <div className="flex flex-col gap-2">
                  <h1 className="font-medium">Proof of Service</h1>
                  <div className="flex justify-center">
                    <Image
                      src={orderPoS}
                      alt="Proof of Service"
                      width={200}
                      height={200}
                      className="w-full rounded-md border-[1.5px] border-gray-1 p-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Appointment Payment Status */}
            <div className="w-full rounded-lg border-[1.5px] border-gray-1 p-5">
              <h1 className="mb-3 text-center text-heading-6 font-bold text-primary">
                Service Payment
              </h1>
              {/* Payment Details */}
              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full flex-col gap-1">
                  <div className="flex justify-between">
                    <p className="text-dark-secondary">Service Fee</p>
                    <p>{formattedServiceFee}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-dark-secondary">Total Days</p>
                    <p>{serviceLogData.appointment.day_of_visit}x Visit</p>
                  </div>
                </div>
                <CustomDivider horizontal />
                <div className="flex justify-between text-lg font-medium">
                  <p>Total Charge</p>
                  <p>{formattedServiceTotalPayment}</p>
                </div>
              </div>
              {/* Payment Status */}
              <div className="mt-5 flex flex-col gap-2">
                <h1 className="text-lg font-medium">Payment Status</h1>
                <div className="flex justify-between">
                  <p className="text-dark-secondary">Payment Method</p>
                  <p>Virtual Account</p>
                </div>
                {serviceLogData.appointment.is_paid && (
                  <div className="flex justify-between">
                    <p className="text-dark-secondary">Paid At</p>
                    <p>{formattedAppointmentPaidAt}</p>
                  </div>
                )}
                <h1
                  className={`rounded-md font-bold ${appointmentPaymentStatus.textColor} px-3 py-2 ${appointmentPaymentStatus.bgColor} border ${appointmentPaymentStatus.borderColor} text-center`}
                >
                  {serviceLogData.appointment.is_paid
                    ? "Verified"
                    : "Awaiting Payment"}
                </h1>
              </div>
            </div>

            {/* Medication Payment Status */}
            {orderType === "medicine" && (
              <div className="w-full rounded-lg border-[1.5px] border-gray-1 p-5">
                <h1 className="mb-3 text-center text-heading-6 font-bold text-primary">
                  Medication Payment
                </h1>
                {/* Payment Details */}
                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex justify-between">
                      <p className="text-dark-secondary">
                        Total Price ({medicineLogData.medicineOrder.total_qty}{" "}
                        items)
                      </p>
                      <p>{formattedMedicineSubTotalPrice}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-dark-secondary">Delivery Fee</p>
                      <p>{formattedMedicineDeliveryFee}</p>
                    </div>
                  </div>
                  <CustomDivider horizontal />
                  <div className="flex justify-between text-lg font-medium">
                    <p>Total Charge</p>
                    <p>{formattedMedicineTotalPrice}</p>
                  </div>
                </div>
                {/* Payment Status */}
                <div className="mt-5 flex flex-col gap-2">
                  <h1 className="text-lg font-medium">Payment Status</h1>
                  <div className="flex justify-between">
                    <p className="text-dark-secondary">Payment Method</p>
                    <p>Virtual Account</p>
                  </div>
                  {medicineLogData.medicineOrder.is_paid && (
                    <div className="flex justify-between">
                      <p className="text-dark-secondary">Paid At</p>
                      <p>{formattedMedicinePaidAt}</p>
                    </div>
                  )}
                  <h1
                    className={`rounded-md font-bold ${medicinePaymentStatus.textColor} px-3 py-2 ${medicinePaymentStatus.bgColor} border ${medicinePaymentStatus.borderColor} text-center`}
                  >
                    {medicineLogData.medicineOrder.is_paid
                      ? "Verified"
                      : "Awaiting Payment"}
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewOrderDetails;
