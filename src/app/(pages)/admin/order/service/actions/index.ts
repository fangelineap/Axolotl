import { adminGetAllOrderLogs } from "@/app/_server-action/admin";

/**
 * * Get all order service logs
 * @returns
 */
export async function getAdminAllOrderServiceLogs() {
  const serviceLogs = await adminGetAllOrderLogs("service");

  return serviceLogs;
}
