import { CAREGIVER, PATIENT, USER } from "./AxolotlMainType";

export type USER_AUTH_SCHEMA = USER & { email: string };

export type USER_DETAILS_AUTH_SCHEMA = USER_AUTH_SCHEMA & {
  patient?: PATIENT;
  caregiver?: CAREGIVER;
};

export type CREATE_NEW_ADMIN_AUTH_SCHEMA = USER & {
  email: string;
  password: string;
};

export type USER_CAREGIVER = USER & { caregiver: CAREGIVER };
