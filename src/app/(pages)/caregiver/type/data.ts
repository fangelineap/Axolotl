import {
  CAREGIVER,
  MEDICINE,
  MEDICINE_ORDER,
  MEDICINE_ORDER_DETAIL,
  ORDER,
  USER,
  USER_AUTH_SCHEMA
} from "@/types/axolotl";

export type CaregiverOrder = USER_AUTH_SCHEMA & {
  caregiver: CAREGIVER;
};

export type CaregiverOrderDetails = ORDER & {
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
  medicineOrder: MEDICINE_ORDER & {
    orderDetail: (MEDICINE_ORDER_DETAIL & { medicine: MEDICINE })[];
  };
};

export type CaregiverInsertMedicineDetails = CaregiverOrderDetails & {
  medicineOrder: MEDICINE_ORDER & {
    orderDetail: (MEDICINE_ORDER_DETAIL & { medicine: MEDICINE })[];
  };
};
