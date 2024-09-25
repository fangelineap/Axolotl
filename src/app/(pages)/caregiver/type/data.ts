import {
  CAREGIVER,
  MEDICINE_ORDER,
  MEDICINE_ORDER_DETAIL,
  ORDER,
  PATIENT,
  USER_AUTH_SCHEMA
} from "@/types/axolotl";

export type CaregiverOrder = USER_AUTH_SCHEMA & {
  caregiver: CAREGIVER;
};

export type CaregiverOrderDetails = ORDER & {
  patient: PATIENT;
  caregiver: CAREGIVER;
  appointment: {
    id: string;
  };
};

export type CaregiverInsertMedicineDetails = CaregiverOrderDetails & {
  medicineOrder: MEDICINE_ORDER & {
    medicineOrderDetail: MEDICINE_ORDER_DETAIL[];
  };
};
