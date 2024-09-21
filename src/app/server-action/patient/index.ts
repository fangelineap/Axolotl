/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import createSupabaseServerClient from "@/app/lib/server";

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
  symptoms,
}: Appointment) {
  const supabase = await createSupabaseServerClient();

  console.log(
    "data",
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
    symptoms,
  );

  let concatSymptoms = "";

  symptoms.forEach((symptom, index) => {
    if (index === 0) {
      concatSymptoms = symptom;
    } else {
      concatSymptoms = concatSymptoms + "," + symptom;
    }
  });

  console.log(concatSymptoms);

  let prediction = "";

    try {
      const response = await fetch(
          "https://axolotl-api-obnth5g6wa-as.a.run.app/predict/",
          {
            method: 'POST',
            body: JSON.stringify({
              symptoms: symptoms.toString(),
            }),
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if(data.conjecture) {
            prediction = data.conjecture;
        }
        else {
            prediction = "Please try again";
        }
    } catch (error) {
        console.log('error', error)
    }

    try {
      const {data, error} = await supabase.from('appointment').insert({
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

      if(!error) {
          return prediction;
      }
    } catch (error) {
      console.log('error', error)
      return "Error";
    }
}
