import createSupabaseServerClient from "@/lib/server";
import { unstable_noStore } from "next/cache";
import { AdminOrderServiceLogsTable } from "../table/data";

export async function getAdminAllOrderServiceLogs() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("order")
      .select("*, appointment(*), patient(*, users(*)), caregiver(*, users(*))")
      .is("medicine_order_id", null)
      .not("appointment_order_id", "is", null)
      .not("patient_id", "is", null)
      .not("caregiver_id", "is", null);

    if (error) {
      console.error("Error fetching Order Service Logs:", error);

      return [];
    }

    if (!data || data.length === 0) return [];

    return data as AdminOrderServiceLogsTable[];
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return [];
  }
}
