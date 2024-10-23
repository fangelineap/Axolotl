import {
  APPOINTMENT,
  CAREGIVER,
  ORDER,
  PATIENT,
  USER
} from "@/types/AxolotlMainType";

export type AdminOrderServiceLogsTable = ORDER & {
  appointment: APPOINTMENT;
  patient: PATIENT & { users: USER };
  caregiver: CAREGIVER & { users: USER };
};
