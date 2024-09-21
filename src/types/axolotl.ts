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
  role: "Midwife" | "Nurse" | "Patient" | "Admin";
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

export type USER_AUTH_SCHEMA = USER & { email: string };

export type USER_DETAILS_AUTH_SCHEMA = USER_AUTH_SCHEMA & {
  patient?: PATIENT;
  caregiver?: CAREGIVER;
};
