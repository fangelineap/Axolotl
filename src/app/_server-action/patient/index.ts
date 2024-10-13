/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import createSupabaseServerClient, {
  getUserDataFromSession
} from "@/lib/server";
import { services } from "@/utils/Services";
import { getProfilePhoto } from "../caregiver";
import { unstable_noStore } from "next/cache";
import { PatientOrder } from "@/app/(pages)/caregiver/type/data";
import { MEDICINE_ORDER_DETAIL } from "@/types/axolotl";
import { getAdminUserByUserID } from "@/app/(pages)/admin/manage/user/actions";

interface Appointment {
  service_type: string;
  caregiver_id: string;
  patient_id: string;
  causes: string;
  main_concern: string;
  current_medication: string;
  medical_description: string;
  days_of_visit: number;
  appointment_time: string;
  appointment_date: Date;
  total_payment: number;
  symptoms: string[];
}
export async function createAppointment({
  service_type,
  caregiver_id,
  patient_id,
  causes,
  main_concern,
  current_medication,
  medical_description,
  days_of_visit,
  appointment_time,
  appointment_date,
  total_payment,
  symptoms
}: Appointment) {
  const supabase = await createSupabaseServerClient();

  let concatSymptoms = "";

  symptoms.forEach((symptom, index) => {
    if (index === 0) {
      concatSymptoms = symptom;
    } else {
      concatSymptoms = concatSymptoms + "," + symptom;
    }
  });

  let prediction = "";

  try {
    const response = await fetch(
      "https://axolotl-api-obnth5g6wa-as.a.run.app/predict/",
      {
        method: "POST",
        body: JSON.stringify({
          symptoms: symptoms.toString()
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    if (data.conjecture) {
      prediction = data.conjecture;
    } else {
      prediction = "Please try again";
    }
  } catch (error) {
    console.log("error", error);
  }

  try {
    const { data, error } = await supabase
      .from("appointment")
      .insert({
        service_type: service_type,
        causes: causes,
        main_concern: main_concern,
        current_medication: current_medication,
        medical_description: medical_description,
        day_of_visit: days_of_visit,
        diagnosis: prediction,
        appointment_time: appointment_time,
        appointment_date: appointment_date,
        total_payment: total_payment,
        symptoms: symptoms
      })
      .select("id");

    const user = await getUserDataFromSession();
    const { data: cgUserData, error: cgUserError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", caregiver_id);
    const { data: cgData, error: cgError } = await supabase
      .from("caregiver")
      .select("*")
      .eq("caregiver_id", cgUserData![0].id);

    if (!user || !("patient" in user) || !user.patient?.id) {
      throw new Error("No caregiver ID found for the logged-in user");
    }

    const { data: orderData, error: orderError } = await supabase
      .from("order")
      .insert({
        patient_id: user?.patient?.id,
        caregiver_id: cgData![0].id,
        appointment_order_id: data![0].id,
        total_payment: total_payment,
        update_at: new Date()
      })
      .select("*");
    if (orderData) {
      console.log("order id", orderData);
    }

    if (!error) {
      return data[0].id;
    }
  } catch (error) {
    console.log("error", error);
    return "Error";
  }
}

export async function getOrder(id: string) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("appointment")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      return data;
    }
  } catch (error) {
    console.log("Error", error);
  }
}

type MedicineType = {
  id: string;
  quantity: number;
  total_price: number;
  created_at: Date;
  updated_at: Date;
  medicine_id: string;
  medicine_order_id: string;
};
export async function getOrderDetail(id: string) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("order")
      .select("*, patient(*), caregiver(*), appointment(*), medicineOrder(*)")
      .eq("id", id)
      .single();

    let meds: any;
    if (data.medicineOrder) {
      const { data: medsData, error: medsError } = await supabase
        .from("medicineOrderDetail")
        .select("*")
        .eq("medicine_order_id", data.medicineOrder.id);

      if (medsData) {
        meds = await Promise.all(
          medsData.map(async (med: MedicineType) => {
            const { data: medicineData, error: medicineError } = await supabase
              .from("medicine")
              .select("*")
              .eq("uuid", med.medicine_id)
              .single();

            if (medicineData) {
              return {
                name: medicineData.name,
                quantity: med.quantity,
                price: medicineData.price
              };
            }
          })
        );
      }
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.patient.patient_id)
      .single();

    const { data: cgData, error: cgError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.caregiver.caregiver_id)
      .single();

    const serviceFee = services.find(
      (service) => service.name === data.appointment.service_type
    );

    const profilePhoto = await getProfilePhoto(data.caregiver.profile_photo);

    const temp = {
      orderStatus: data.is_completed ? "Completed" : "Ongoing",
      caregiverInfo: {
        name: cgData.first_name + " " + cgData.last_name,
        str: data.caregiver.str,
        profile_photo_url: profilePhoto
      },
      patientInfo: {
        name: userData.first_name + " " + userData.last_name,
        address: userData.address,
        phoneNumber: userData.phone_number,
        birthdate: userData.birthdate
      },
      medicalDetails: {
        causes: data.appointment.causes,
        mainConcerns: data.appointment.main_concern.split(","),
        currentMedicine: data.appointment.current_medication.split(","),
        symptoms: data.appointment.symptoms,
        medicalDescriptions: data.appointment.medical_description,
        conjectures: data.appointment.diagnosis
      },
      serviceDetails: {
        orderId: data.id,
        orderDate: data.created_at,
        serviceType: data.appointment.service_type,
        totalDays: data.appointment.day_of_visit,
        startTime: data.appointment.appointment_date,
        endTime: data.appointment.appointment_date,
        serviceFee: serviceFee ? serviceFee.price : 0,
        totalCharge: data.appointment.total_payment
      },
      medicineDetail: meds,
      price: {
        total: "80000",
        delivery: "30000",
        totalCharge: "50000"
      }
    };

    return temp;
  } catch (error) {
    console.log("error", error);
  }
}

export async function fetchOrdersByPatient() {
  unstable_noStore();
  const supabase = await createSupabaseServerClient();

  try {
    const userData = await getUserDataFromSession();

    if (
      !userData ||
      !("patient" in userData) ||
      !userData.patient?.patient_id
    ) {
      throw new Error("No patient ID found for the logged-in user");
    }

    let patientData: PatientOrder;
    // Check if caregiver exists in userData
    if (userData.patient) {
      patientData = {
        ...userData,
        patient: userData.patient
      } as PatientOrder;
    } else {
      throw new Error("Patient data is missing");
    }

    const patient_id = patientData.patient.id;

    // Query to fetch orders with related appointment, patient, caregiver, and medicine order details
    const { data, error } = await supabase
      .from("order")
      .select(
        `*, caregiver(*, users (first_name, last_name, address, phone_number, birthdate)), appointment(*), patient(*), medicineOrder(*, medicineOrderDetail(*))`
      )
      .eq("patient_id", patient_id);

    if (error) {
      console.error("Error fetching orders:", error.message);

      return [];
    }

    if (!data || data.length === 0) {
      console.warn("No orders found for the caregiver");

      return [];
    }

    // Loop through each order and fetch the medicine order details
    const ordersWithDetails = await Promise.all(
      data.map(async (order: any) => {
        if (order.medicineOrder && order.medicineOrder.id) {
          const { data: medicineDetail, error: medicineDetailError } =
            await supabase
              .from("medicineOrder")
              .select("*, medicineOrderDetail(*, medicine(*))")
              .eq("id", order.medicineOrder.id);

          if (medicineDetailError) {
            console.error(
              "Error fetching medicine order details:",
              medicineDetailError.message
            );

            return null;
          }

          // Return combined data with medicineOrderDetail
          return {
            ...order,
            medicineOrder: {
              ...order.medicineOrder,
              medicineOrderDetail:
                medicineDetail?.[0]?.medicineOrderDetail || []
            }
          };
        } else {
          return order; // Return order without medicineOrder if not found
        }
      })
    );

    // Filter out any null values that might have occurred due to errors in medicine detail fetching
    const validOrders = ordersWithDetails.filter((order) => order !== null);

    console.log(validOrders);

    // Access and print the array of medicineOrderDetailData
    validOrders.forEach((order) => {
      if (
        order.medicineOrder &&
        order.medicineOrder.medicineOrderDetail.length > 0
      ) {
        console.log("Medicine Order Details:");
        order.medicineOrder.medicineOrderDetail.forEach(
          (detail: MEDICINE_ORDER_DETAIL, index: number) => {
            console.log(`Detail ${index + 1}:`, detail);
          }
        );
      } else {
        console.log("No medicine order details found for this order.");
      }
    });

    return validOrders;
  } catch (error) {
    console.error("Error:", error);

    return [];
  }
}
