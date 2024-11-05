import {
  CAREGIVER,
  MEDICINE,
  MEDICINE_ORDER,
  MEDICINE_ORDER_DETAIL,
  ORDER,
  PATIENT,
  USER
} from "@/types/AxolotlMainType";
import { USER_AUTH_SCHEMA } from "@/types/AxolotlMultipleTypes";

export type CaregiverOrder = USER_AUTH_SCHEMA & {
  caregiver: CAREGIVER;
};

export type CaregiverOrderDetails = ORDER & {
  patient: PATIENT & { users: USER };
  user: USER;
  caregiver: CAREGIVER;
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
  rate: number;
  proof_of_service: string;
  medicineOrder: MEDICINE_ORDER;
  medicines: {
    name: string;
    quantity: number;
    price: number;
  }[];
};

export type CaregiverInsertMedicineDetails = CaregiverOrderDetails & {
  medicineOrder: MEDICINE_ORDER & {
    orderDetail: (MEDICINE_ORDER_DETAIL & { medicine: MEDICINE })[];
  };
};
