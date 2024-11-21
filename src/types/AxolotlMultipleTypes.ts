import {
  APPOINTMENT,
  CAREGIVER,
  MEDICINE_ORDER,
  MEDICINE_ORDER_DETAIL,
  MESSAGES,
  ORDER,
  PATIENT,
  USER
} from "./AxolotlMainType";

export type USER_CHAT = USER & { messages: MESSAGES[] };

export type USER_AUTH_SCHEMA = USER & { email: string };

export type USER_DETAILS_AUTH_SCHEMA = USER_AUTH_SCHEMA & {
  patient?: PATIENT;
  caregiver?: CAREGIVER;
};

export type CREATE_NEW_ADMIN_AUTH_SCHEMA = USER & {
  email: string;
  password: string;
};

export type USER_CAREGIVER = USER & { caregiver: CAREGIVER[] };

export type CAREGIVER_SCHEDULE_ORDER = ORDER & {
  patient: PATIENT & {
    users: {
      first_name: USER["first_name"];
      last_name: USER["last_name"];
      address: USER["address"];
      phone_number: USER["phone_number"];
      birthdate: USER["birthdate"];
    };
  };
  appointment: APPOINTMENT;
  caregiver: CAREGIVER;
  medicineOrder: MEDICINE_ORDER & {
    medicineOrderDetail: MEDICINE_ORDER_DETAIL;
  };
};

export type CAREGIVER_MEDICINE_ORDER = {
  total_qty: MEDICINE_ORDER["total_qty"];
  sub_total_medicine: MEDICINE_ORDER["sub_total_medicine"];
  delivery_fee: MEDICINE_ORDER["delivery_fee"];
  total_price: MEDICINE_ORDER["total_price"];
  is_paid: MEDICINE_ORDER["is_paid"];
  paid_at: MEDICINE_ORDER["paid_at"];
};

export type BASIC_PROFILE_DETAILS = {
  email: string;
  phone_number: USER["phone_number"];
  address: USER["address"];
};

export type PATIENT_PROFILE_DETAILS = {
  weight: PATIENT["weight"];
  height: PATIENT["height"];
  is_smoking: PATIENT["is_smoking"];
  allergies: PATIENT["allergies"] | null;
  current_medication: PATIENT["current_medication"] | null;
  med_freq_times: PATIENT["med_freq_times"] | null;
  med_freq_day: PATIENT["med_freq_day"] | null;
  illness_history: PATIENT["illness_history"];
};

export type CAREGIVER_PROFILE_DETAILS = {
  start_day: CAREGIVER["schedule_start_day"];
  end_day: CAREGIVER["schedule_end_day"];
  start_time: CAREGIVER["schedule_start_time"];
  end_time: CAREGIVER["schedule_end_time"];
};

export type CAREGIVER_SCHEDULE_DATA = CAREGIVER_PROFILE_DETAILS;
