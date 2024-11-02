import { CAREGIVER, PATIENT, USER } from "@/types/AxolotlMainType";

export type UserPersonalInformation = {
  address: USER["address"];
  gender: USER["gender"];
  birthdate: USER["birthdate"];
};

export type PatientPersonalInformation = {
  blood_type: PATIENT["blood_type"];
  height: PATIENT["height"];
  weight: PATIENT["weight"];
  is_smoking: PATIENT["is_smoking"];
  allergies: PATIENT["allergies"];
  current_medication: PATIENT["current_medication"];
  med_freq_times: PATIENT["med_freq_times"];
  med_freq_day: PATIENT["med_freq_day"];
  illness_history: PATIENT["illness_history"];
};

export type CaregiverPersonalInformation = {
  profile_photo: CAREGIVER["profile_photo"];
  employment_type: CAREGIVER["employment_type"];
  work_experiences: CAREGIVER["work_experiences"];
  workplace: CAREGIVER["workplace"];
  cv: CAREGIVER["cv"];
  degree_certificate: CAREGIVER["degree_certificate"];
  str: CAREGIVER["str"];
  sip: CAREGIVER["sip"];
};
