/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import createSupabaseServerClient from "@/lib/server";
import { services } from "@/utils/Services";
import { getProfilePhoto } from "../caregiver";

interface Appointment {
  service_type: string;
  caregiver_id: string;
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

    if (data) {
      console.log("data", data);
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

    const { data: medsData, error: medsError } = await supabase
      .from("medicineOrderDetail")
      .select("*")
      .eq("medicine_order_id", data.medicineOrder.id);

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

    let meds: any;
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
