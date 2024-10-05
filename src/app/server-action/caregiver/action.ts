"use server";

import { CaregiverOrder } from "@/app/(pages)/caregiver/type/data";
import createSupabaseServerClient, {
  getUserDataFromSession
} from "@/lib/server";
import { MEDICINE_ORDER_DETAIL } from "@/types/axolotl";

import { unstable_noStore } from "next/cache";

export const fetchMedicine = async () => {
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await supabase.from("medicine").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error fetching medicine:", error.message);
      throw new Error("Failed to fetch medicine");
    } else {
      console.log("Unknown error fetching medicine");
      throw new Error("An unknown error occurred while fetching medicine");
    }
  }
};

export async function fetchOrdersByCaregiver() {
  unstable_noStore();
  const supabase = await createSupabaseServerClient();

  try {
    const userData = await getUserDataFromSession();

    if (
      !userData ||
      !("caregiver" in userData) ||
      !userData.caregiver?.caregiver_id
    ) {
      throw new Error("No caregiver ID found for the logged-in user");
    }

    let caregiverData: CaregiverOrder;
    // Check if caregiver exists in userData
    if (userData.caregiver) {
      caregiverData = {
        ...userData,
        caregiver: userData.caregiver
      } as CaregiverOrder;
    } else {
      throw new Error("Caregiver data is missing");
    }

    const caregiver_id = caregiverData.caregiver.id;

    // Query to fetch orders with related appointment, patient, caregiver, and medicine order details
    const { data, error } = await supabase
      .from("order")
      .select(
        "*, patient(*, users (first_name, last_name, address)), appointment(*), caregiver(*), medicineOrder(*)"
      )
      .eq("caregiver_id", caregiver_id);

    if (error) {
      console.error("Error fetching orders:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn("No orders found for the caregiver");
      return [];
    }

    // Loop through each order and fetch the medicine order details
    const ordersWithDetails = await Promise.all(
      data.map(async (order: any) => {
        if (order.medicineOrder && order.medicineOrder.id) {
          const { data: medicineDetail, error: medicineDetailError } =
            await supabase
              .from("medicineOrder")
              .select("*, medicineOrderDetail(*)")
              .eq("id", order.medicineOrder.id);

          if (medicineDetailError) {
            console.error(
              "Error fetching medicine order details:",
              medicineDetailError.message
            );
            return null;
          }

          // Return combined data with medicineOrderDetail
          return {
            ...order,
            medicineOrder: {
              ...order.medicineOrder,
              medicineOrderDetail:
                medicineDetail?.[0]?.medicineOrderDetail || []
            }
          };
        } else {
          return order; // Return order without medicineOrder if not found
        }
      })
    );

    // Filter out any null values that might have occurred due to errors in medicine detail fetching
    const validOrders = ordersWithDetails.filter((order) => order !== null);

    console.log(validOrders);

    // Access and print the array of medicineOrderDetailData
    validOrders.forEach((order) => {
      if (
        order.medicineOrder &&
        order.medicineOrder.medicineOrderDetail.length > 0
      ) {
        console.log("Medicine Order Details:");
        order.medicineOrder.medicineOrderDetail.forEach(
          (detail: MEDICINE_ORDER_DETAIL, index: number) => {
            console.log(`Detail ${index + 1}:`, detail);
          }
        );
      } else {
        console.log("No medicine order details found for this order.");
      }
    });

    return validOrders;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
