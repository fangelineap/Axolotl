import {
  APPOINTMENT,
  CAREGIVER,
  MEDICINE,
  MEDICINE_ORDER,
  MEDICINE_ORDER_DETAIL,
  ORDER,
  PATIENT,
  USER
} from "@/types/AxolotlMainType";

export type AdminOrderMedicineLogsTable = ORDER & {
  appointment: APPOINTMENT;
  medicineOrder: MEDICINE_ORDER & {
    medicineOrderDetail: (MEDICINE_ORDER_DETAIL & { medicine: MEDICINE })[];
  };
  patient: PATIENT & { users: USER };
  caregiver: CAREGIVER & { users: USER };
};
