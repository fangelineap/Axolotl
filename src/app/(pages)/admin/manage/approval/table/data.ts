import { CAREGIVER, USER } from "@/types/axolotl";

export type AdminApprovalTable = CAREGIVER & { users: USER };
