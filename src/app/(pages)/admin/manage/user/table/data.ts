import { CAREGIVER, PATIENT, USER, USER_AUTH_SCHEMA } from "@/types/axolotl";

export type AdminUserTable = USER_AUTH_SCHEMA & {
  patient: PATIENT;
  caregiver: CAREGIVER;
};

export type AdminCaregiverDetails = USER & {
  caregiver: CAREGIVER;
};
