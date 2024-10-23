import { adminGetAllOrderLogs } from "@/app/_server-action/admin";
import { AdminOrderMedicineLogsTable } from "../table/data";

/**
 * * Get all order medicine logs
 * @returns
 */
export async function getAdminAllOrderMedicineLogs() {
  const medicineLogs = await adminGetAllOrderLogs("medicine");

  return medicineLogs as AdminOrderMedicineLogsTable[];
}
