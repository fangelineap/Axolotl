import {
  CAREGIVER,
  MEDICINE_ORDER,
  ORDER,
  PATIENT,
  USER
} from "@/types/AxolotlMainType";
import { USER_AUTH_SCHEMA } from "@/types/AxolotlMultipleTypes";

export type PatientOrder = USER_AUTH_SCHEMA & {
  patient: PATIENT;
};

export type PatientOrderDetails = ORDER & {
  patient: PATIENT;
  user: USER;
  caregiver: CAREGIVER & { users: USER };
  appointment: {
    id: string;
    service_type: string;
    causes: string;
    main_concern: string;
    current_medication: string;
    symptoms: string[];
    medical_description: string;
    diagnosis: string;
    day_of_visit: number;
    appointment_time: string;
    appointment_date: Date;
    total_payment: number;
  };
  medicineOrder: MEDICINE_ORDER;
  medicines: {
    name: string;
    quantity: number;
    price: number;
  }[];
};
