export type USER = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  gender: string;
  birthdate: Date;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  role: "Midwife" | "Nurse" | "Patient" | "Caregiver" | "Admin";
};

export type CAREGIVER = {
  id: string;
  profile_photo: string;
  employment_type: "Full-time" | "Part-time";
  workplace: string;
  work_experiences: number;
  cv: string;
  str: string;
  sip: string;
  degree_certificate: string;
  status: "Unverified" | "Verified" | "Rejected";
  reviewed_at: Date;
  created_at: Date;
  updated_at: Date;
  caregiver_id: string;
  notes?: string;
  rate?: number;
  schedule_start_day?:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  schedule_end_day?: CAREGIVER["schedule_start_day"];
  schedule_start_time?: string;
  schedule_end_time?: string;
};

export type PATIENT = {
  id: string;
  blood_type: "A" | "B" | "AB" | "O";
  weight: number;
  height: number;
  is_smoking: boolean;
  allergies: string;
  current_medication: string;
  med_freq_times: number;
  med_freq_day: number;
  illness_history: string;
  created_at: Date;
  updated_at: Date;
  patient_id: string;
};

export type MEDICINE = {
  uuid: string;
  name: string;
  type: string;
  exp_date: Date;
  price: number;
  medicine_photo?: string;
};

export type MEDICINE_ORDER_DETAIL_WITH_MEDICINE = MEDICINE_ORDER_DETAIL & {
  medicine: MEDICINE;
};

export type APPOINTMENT = {
  service_type: string;
  total_payment: number;
  causes: string;
  main_concern: string;
  current_medication: string;
  medical_description: string;
  day_of_visit: number;
  diagnosis: string;
  created_at: Date;
  updated_at: Date;
  paid_at: Date;
  appointment_time: string;
  appointment_date: Date;
  symptoms: string[];
};

export type ORDER = {
  id: string;
  status: string;
  total_payment: number;
  completed_at: Date;
  created_at: Date;
  update_at: Date;
  appointment_order_id: string;
  medicine_order_id: string;
  patient_id: string;
  caregiver_id: string;
  notes?: string;
  proof_of_service?: string;
  rate?: number;
};

export type MEDICINE_ORDER = {
  id: string;
  total_qty: number;
  sub_total_medicine: number;
  delivery_fee: number;
  total_price: number;
  is_paid: "Verified" | "Unverified" | "Skipped";
  paid_at: Date | null;
  updated_at: Date;
  created_at: Date;
};

export type MEDICINE_ORDER_DETAIL = {
  id: string;
  quantity: number;
  total_price: number;
  created_at: Date;
  updated_at: Date;
  medicine_id: string;
  medicine_order_id: string;
};

export type CAREGIVER_LICENSES_TYPE =
  | "cv"
  | "degree_certificate"
  | "str"
  | "sip";

export type ORDER_APPOINTMENT = ORDER & {
  appointment: APPOINTMENT;
};

export type MESSAGES = {
  id: string;
  text: string;
  sender: USER["user_id"];
  recipient: USER["user_id"];
  is_read: boolean;
  created_at: Date;
};
