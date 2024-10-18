import { CAREGIVER, PATIENT, USER, USER_AUTH_SCHEMA } from "@/types/axolotl";

export type AdminUserTable = USER_AUTH_SCHEMA & {
  patient: PATIENT;
  caregiver: CAREGIVER;
};

export type AdminUpdateCaregiverDetails = {
  user_id: USER["user_id"];
  employment_type: CAREGIVER["employment_type"];
  work_experiences: CAREGIVER["work_experiences"];
  workplace: CAREGIVER["workplace"];
  cv: CAREGIVER["cv"];
  degree_certificate: CAREGIVER["degree_certificate"];
  str: CAREGIVER["str"];
  sip: CAREGIVER["sip"];
};

export type AdminUpdateAdminDetails = {
  user_id: USER["user_id"];
  email: string;
  phone_number: USER["phone_number"];
  address: USER["address"];
};

export type AdminUpdateUser = USER_AUTH_SCHEMA & {
  updateCaregiver: AdminUpdateCaregiverDetails;
};
