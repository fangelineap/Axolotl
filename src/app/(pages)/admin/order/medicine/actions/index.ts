import createSupabaseServerClient from "@/lib/server";
import { unstable_noStore } from "next/cache";
import { AdminOrderMedicineLogsTable } from "../table/data";

export async function getAdminAllOrderMedicineLogs() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("order")
      .select(
        "*, appointment(*), medicineOrder(*, medicineOrderDetail(*, medicine(*))), patient(*, users(*)), caregiver(*, users(*))"
      )
      .not("medicine_order_id", "is", null)
      .not("appointment_order_id", "is", null)
      .not("patient_id", "is", null)
      .not("caregiver_id", "is", null);

    if (error) {
      console.error("Error fetching Order Service Logs:", error);

      return [];
    }

    if (!data || data.length === 0) return [];

    return data as AdminOrderMedicineLogsTable[];
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return [];
  }
}
