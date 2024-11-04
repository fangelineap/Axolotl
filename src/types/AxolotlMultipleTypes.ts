import {
  APPOINTMENT,
  CAREGIVER,
  MEDICINE_ORDER,
  MEDICINE_ORDER_DETAIL,
  ORDER,
  PATIENT,
  USER
} from "./AxolotlMainType";

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
