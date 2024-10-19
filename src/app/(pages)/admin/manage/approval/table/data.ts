import { CAREGIVER, USER } from "@/types/AxolotlMainType";

export type AdminApprovalTable = CAREGIVER & { users: USER };
