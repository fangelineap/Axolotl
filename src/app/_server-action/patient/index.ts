/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { PatientOrder } from "@/app/(pages)/patient/type/data";
import createSupabaseServerClient, {
  getUserDataFromSession
} from "@/lib/server";
import {
  MEDICINE_ORDER_DETAIL,
  MEDICINE_ORDER_DETAIL_WITH_MEDICINE
} from "@/types/AxolotlMainType";
import { AxolotlServices } from "@/utils/Services";
import { unstable_noStore } from "next/cache";
import { getGlobalUserProfilePhoto } from "../global";

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
  additionalSymptom?: string[];
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
  symptoms,
  additionalSymptom
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
        appointment_date: new Date(appointment_date).toLocaleString(),
        total_payment: total_payment,
        symptoms: additionalSymptom
          ? symptoms.concat(additionalSymptom)
          : symptoms
      })
      .select("id");

    if (error) {
      console.log("Error whie creating appointment", error);
      throw new Error("Error while creating appointment");
    }

    const user = await getUserDataFromSession();
    const { data: cgUserData, error: cgUserError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", caregiver_id);
    const { data: cgData, error: cgError } = await supabase
      .from("caregiver")
      .select("*")
      .eq("caregiver_id", cgUserData![0].id);

    if (cgUserError) {
      console.log("Error while fetching caregiver user data", cgUserError);
      throw new Error("Error while fetching caregiver user data");
    }

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

    console.log("Error while creating appointment", orderError);

    return "Error";
  } catch (error) {
    console.log("Error while creating order", error);
    throw new Error("Error while creating order");
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

    const serviceFee = AxolotlServices.find(
      (service) => service.name === data.appointment.service_type
    );

    const profilePhoto = await getGlobalUserProfilePhoto(
      data.caregiver.profile_photo
    );

    const temp = {
      orderStatus: data.status,
      orderNotes: data.notes,
      medicineOrderId: data.medicineOrder ? data.medicineOrder.id : null,
      medicineIsPaid: data.medicineOrder ? data.medicineOrder.is_paid : null,
      caregiverInfo: {
        id: cgData.id,
        name: cgData.first_name + " " + cgData.last_name,
        profile_photo_url: profilePhoto,
        reviewed_at: data.caregiver.reviewed_at
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
        totalCharge: data.appointment.total_payment,
        rate: data.rate
      },
      medicineDetail: meds,
      price: {
        total: "80000",
        delivery: "10000",
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

export async function fetchMedicineOrderById(id: string) {
  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("medicineOrder")
      .select("*")
      .eq("id", id);

    if (data) {
      try {
        const { data: detailData, error: detailError } = await supabase
          .from("medicineOrderDetail")
          .select("*, medicine(*)")
          .eq("medicine_order_id", id);

        return {
          ...data[0],
          medicineOrderDetail: detailData
        };
      } catch (error) {
        console.log("Error when fetching medicine order detail", error);
      }
    }
  } catch (error) {
    console.log("Error when fetching medicine order", error);
  }
}

export async function handleAdditionalMedicinePayment(
  medicineOrderId: string,
  medicine: MEDICINE_ORDER_DETAIL_WITH_MEDICINE[],
  orderId: string
) {
  const supabase = await createSupabaseServerClient();

  const setFilteredMedicineOrder = async (medicineOrderDetailId: string) => {
    try {
      await supabase
        .from("medicineOrderDetail")
        .delete()
        .eq("id", medicineOrderDetailId);
    } catch (error) {
      console.log("Error", error);
    }
  };

  try {
    const { data: medicineDetail, error: medicineDetailError } = await supabase
      .from("medicineOrderDetail")
      .select("*")
      .eq("medicine_order_id", medicineOrderId);

    if (medicineDetail) {
      medicineDetail.forEach((medDetail) => {
        let flag = false;
        medicine.map((meds) => {
          if (meds.id === medDetail.id) {
            flag = true;
          }
        });

        if (flag === false) {
          setFilteredMedicineOrder(medDetail.id);
        }
      });
    }

    const { data, error } = await supabase
      .from("medicineOrder")
      .update({
        total_qty: medicine.reduce((acc, curr) => acc + curr.quantity, 0),
        sub_total_medicine: medicine.reduce(
          (acc, curr) => acc + curr.total_price,
          0
        ),
        total_price:
          medicine.reduce((acc, curr) => acc + curr.total_price, 0) + 10000,
        is_paid: "Verified",
        paid_at: new Date(),
        updated_at: new Date()
      })
      .eq("id", medicineOrderId)
      .select("*");

    if (data) {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from("order")
          .update({
            status: "Completed",
            update_at: new Date(),
            completed_at: new Date()
          })
          .eq("id", orderId)
          .select("*");

        if (orderData) {
          return "Success";
        }
      } catch (error) {
        console.log("Error", error);
        throw new Error("Error while updating order status");
      }
    }
  } catch (error) {
    console.log("Error", error);
  }
}

export async function updateRating(
  orderId: string,
  caregiverId: string,
  rating: number
) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("order")
      .update({
        rate: rating + 1
      })
      .eq("id", orderId)
      .select("rate");

    if (data) {
      try {
        const { data } = await supabase
          .from("caregiver")
          .select("rate")
          .eq("caregiver_id", caregiverId);
        try {
          if (data) {
            const { data: updateData } = await supabase
              .from("caregiver")
              .update({ rate: (data[0].rate + rating + 1) / 2 })
              .eq("caregiver_id", caregiverId)
              .select("rate");

            if (updateData) {
              return "Success";
            }
          } else {
            const { data: updateData } = await supabase
              .from("caregiver")
              .update({ rate: rating + 1 })
              .eq("caregiver_id", caregiverId)
              .select("rate");

            if (updateData) {
              return "Success";
            }
          }
        } catch (error) {
          console.log("error", error);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  } catch (error) {
    console.log("error", error);
  }
}

export async function skipAdditionalMedicine(
  orderId: string,
  medicineOrderId: string
) {
  const supabase = await createSupabaseServerClient();

  try {
    await supabase
      .from("medicineOrder")
      .update({ is_paid: "Skipped" })
      .eq("id", medicineOrderId);

    await supabase
      .from("order")
      .update({ status: "Completed" })
      .eq("id", orderId);

    return "Success";
  } catch (error) {
    throw new Error("Error while fetching appointments by caregiver id");
  }
}

export async function getAppointmentsByCaregiverId(caregiverId: string) {
  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("order")
      .select("appointment(appointment_time, appointment_date)")
      .eq("caregiver_id", caregiverId)
      .eq("status", "Ongoing");

    if (data) {
      return data;
    }
  } catch (error) {
    throw new Error("Error while fetching appointments by caregiver id");
  }
}
