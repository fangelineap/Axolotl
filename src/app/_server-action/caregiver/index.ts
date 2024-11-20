"use server";

import { CaregiverOrder } from "@/app/(pages)/caregiver/type/data";
import createSupabaseServerClient, {
  getUserDataFromSession,
  getUserFromSession
} from "@/lib/server";
import {
  MEDICINE,
  MEDICINE_ORDER,
  MEDICINE_ORDER_DETAIL
} from "@/types/AxolotlMainType";
import { CAREGIVER_MEDICINE_ORDER } from "@/types/AxolotlMultipleTypes";

import { revalidatePath, unstable_noStore } from "next/cache";

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
        `*, patient(*, users (first_name, last_name, address, phone_number, birthdate)), appointment(*), caregiver(*), medicineOrder(*, medicineOrderDetail(*))`
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
              .select("*, medicineOrderDetail(*, medicine(*))")
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

export async function fetchOngoingOrders() {
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
        `*, patient(*, users (first_name, last_name, address, phone_number, birthdate)), appointment(*), caregiver(*), medicineOrder(*, medicineOrderDetail(*))`
      )
      .eq("caregiver_id", caregiver_id)
      .is("medicine_order_id", null)
      .eq("status", "Ongoing");

    if (error) {
      console.error("Error fetching orders:", error.message);

      return [];
    }

    if (!data || data.length === 0) {
      console.warn("No orders found for the caregiver");

      return [];
    }

    const filterOrder = data.filter((order: any) => order.status === "Ongoing");

    // Loop through each order and fetch the medicine order details
    const ordersWithDetails = await Promise.all(
      filterOrder.map(async (order: any) => {
        if (order.medicineOrder && order.medicineOrder.id) {
          const { data: medicineDetail, error: medicineDetailError } =
            await supabase
              .from("medicineOrder")
              .select("*, medicineOrderDetail(*, medicine(*))")
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

    console.log("VALID ORDERS: ", validOrders);

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

export async function fetchOrderDetail(orderId: string) {
  const supabase = await createSupabaseServerClient();

  try {
    const currentUser = await getUserFromSession();
    if (!currentUser || !currentUser.data) {
      throw new Error("Unable to retrieve user session");
    }

    // Fetch the basic order data along with the necessary relationships
    const { data: orderData, error: orderError } = await supabase
      .from("order")
      .select(
        `
        *,
        patient(*, users(*)),
        caregiver(*, users(user_id)),
        appointment(*),
        medicineOrder(*)
      `
      )
      .eq("id", orderId)
      .single(); // Fetch one record

    if (orderError || !orderData) {
      throw new Error(orderError?.message || "Order not found");
    }

    // Check authorization
    const isAuthorized =
      currentUser.data.id === orderData.caregiver?.caregiver_id &&
      currentUser.data.user_id === orderData.caregiver?.users?.user_id;

    if (!isAuthorized) {
      throw new Error("You are not authorized to access this order");
    }

    const user = orderData.patient?.users || {};

    type MedicineDetail = {
      name: string;
      quantity: number;
      price: number;
    };
    // Initialize an empty array for medicine details if there is no `medicineOrder`
    let meds: MedicineDetail[] = [];

    // Check if `medicineOrder` exists and has an ID
    if (orderData.medicineOrder?.id) {
      // Fetch medicine order details
      const { data: medicineOrderDetailData, error: medicineOrderDetailError } =
        await supabase
          .from("medicineOrderDetail")
          .select("*")
          .eq("medicine_order_id", orderData.medicineOrder.id); // Safely access id

      if (medicineOrderDetailError) {
        console.error(
          "Error fetching medicine order details:",
          medicineOrderDetailError.message
        );
      }

      // Fetch associated medicine data only if `medicineOrderDetailData` exists
      if (medicineOrderDetailData) {
        meds = await Promise.all(
          medicineOrderDetailData.map(async (medDetail) => {
            const { data: medicineData, error: medicineError } = await supabase
              .from("medicine")
              .select("*")
              .eq("uuid", medDetail.medicine_id)
              .single();

            if (medicineError || !medicineData) {
              console.error(
                "Error fetching medicine:",
                medicineError?.message || "Medicine not found"
              );

              return {
                name: "Unknown",
                quantity: medDetail.quantity,
                price: 0
              }; // Return default
            }

            return {
              name: medicineData.name,
              quantity: medDetail.quantity,
              price: medicineData.price
            };
          })
        );
      }
    }

    // Construct the full URL for proof_of_service
    let proofOfServiceUrl = orderData.proof_of_service;
    if (proofOfServiceUrl) {
      const { data } = supabase.storage
        .from("proof_of_service") // Make sure to use the correct storage bucket name
        .getPublicUrl(proofOfServiceUrl);
      proofOfServiceUrl = data.publicUrl; // Full public URL
    }

    // Combine the order data, user data, and medicine details
    const combinedData = {
      ...orderData,
      user,
      medicines: meds // This will be an empty array if no medicineOrder exists
    };

    return combinedData; // Return the combined data
  } catch (error) {
    console.error(
      "Error fetching order:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw new Error("Failed to fetch order");
  }
}

export async function cancelAppointment(orderId: string, notes: string) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  const updateData = {
    status: "Canceled",
    notes,
    update_at: new Date()
  };

  try {
    const { error } = await supabase
      .from("order")
      .update(updateData)
      .eq("id", orderId)
      .single();

    if (error) {
      console.error("Error canceling appointment:", error);

      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error:", error);

    return false;
  }
}

export async function medicinePreparation(orderId: string) {
  const supabase = await createSupabaseServerClient();

  try {
    const currentUser = await getUserFromSession();
    if (!currentUser || !currentUser.data) {
      throw new Error("Unable to retrieve user session");
    }

    // Fetch the basic order data along with the necessary relationships, excluding medicineOrder
    const { data: orderData, error: orderError } = await supabase
      .from("order")
      .select(
        `
        *,
        patient(*, users(*)),
        caregiver(*, users(user_id)),
        appointment(*)
      `
      )
      .eq("id", orderId)
      .single(); // Fetch one record

    if (orderError || !orderData) {
      throw new Error(orderError?.message || "Order not found");
    }

    // Check authorization
    const isAuthorized =
      currentUser.data.id === orderData.caregiver?.caregiver_id &&
      currentUser.data.user_id === orderData.caregiver?.users?.user_id;

    if (!isAuthorized) {
      throw new Error("You are not authorized to access this order");
    }

    const user = orderData.patient?.users || {};

    // Combine the order data and user data
    const combinedData = {
      ...orderData,
      user,
      rate: orderData.rate
      // No 'medicines' field since we don't need it here
    };

    return combinedData; // Return the combined data
  } catch (error) {
    console.error(
      "Error fetching order:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw new Error("Failed to fetch order");
  }
}

export async function finishOrder(
  orderId: string,
  proofOfServiceUrl: string | null,
  hasAdditionalMedicine: boolean
) {
  const supabase = await createSupabaseServerClient();

  try {
    const currentUser = await getUserFromSession();
    if (!currentUser || !currentUser.data) {
      throw new Error("Unable to retrieve user session");
    }

    // Determine the status based on hasAdditionalMedicine
    const newStatus = hasAdditionalMedicine ? "Ongoing" : "Completed";

    // Prepare the update data
    const updateData: any = {
      status: newStatus,
      proof_of_service: proofOfServiceUrl
    };

    // If no additional medicine, add completed_at
    if (!hasAdditionalMedicine) {
      updateData.completed_at = new Date(); // Set to the current date/time
    }

    // Update the `order` table with the proof_of_service URL
    const { error: updateOrderError } = await supabase
      .from("order")
      .update(updateData)
      .eq("id", orderId);

    if (updateOrderError) {
      throw new Error(
        "Failed to update order with proof of service: " +
          updateOrderError.message
      );
    }

    revalidatePath(`/caregiver/order/${orderId}`);

    return { success: true, message: "Order finished successfully!" };
  } catch (error) {
    console.error(
      "Error finishing order:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw new Error("Failed to finish order");
  }
}

export async function insertMedicineOrder(
  caregiverOrderDetails: CAREGIVER_MEDICINE_ORDER
): Promise<MEDICINE_ORDER> {
  const supabase = await createSupabaseServerClient();

  // Extract the specific fields needed for medicineOrder insertion
  const {
    total_qty,
    sub_total_medicine,
    delivery_fee,
    total_price,
    is_paid,
    paid_at
  } = caregiverOrderDetails;

  try {
    const { data, error } = await supabase
      .from("medicineOrder")
      .insert({
        total_qty,
        sub_total_medicine,
        delivery_fee,
        total_price,
        is_paid,
        paid_at
      })
      .select("*")
      .single(); // Returns the inserted record as a single object

    if (error) {
      throw new Error("Failed to insert medicine order: " + error.message);
    }

    return data as MEDICINE_ORDER; // Return the inserted record with MEDICINE_ORDER type
  } catch (error) {
    console.error("Error inserting medicine order:", error);
    throw new Error("Error inserting medicine order");
  }
}

export async function insertMedicineOrderDetail(
  caregiverOrderDetails: MEDICINE_ORDER_DETAIL
): Promise<MEDICINE_ORDER_DETAIL> {
  const supabase = await createSupabaseServerClient();
  const { quantity, total_price, medicine_id, medicine_order_id, updated_at } =
    caregiverOrderDetails;
  try {
    const { data, error } = await supabase
      .from("medicineOrderDetail")
      .insert({
        quantity,
        total_price,
        medicine_id,
        medicine_order_id,
        updated_at
      })
      .select("*")
      .single(); // Returns the inserted record as a single object

    if (error) {
      throw new Error("Failed to insert medicine order: " + error.message);
    }

    return data as MEDICINE_ORDER_DETAIL; // Return the inserted record with MEDICINE_ORDER type
  } catch (error) {
    console.error("Error inserting medicine order:", error);
    throw new Error("Error inserting medicine order");
  }
}

export async function updateOrderWithMedicineOrderId(
  orderId: string,
  medicineOrderId: string
) {
  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("order")
      .update({ medicine_order_id: medicineOrderId })
      .eq("id", orderId)
      .select("*")
      .single();
    if (error) {
      throw new Error("Failed to insert medicine order: " + error.message);
    }

    return data;
  } catch (error) {
    console.error("Error inserting medicine order:", error);
    throw new Error("Error inserting medicine order");
  }
}

export async function insertNewMedicine(
  medicineData: MEDICINE,
  orderId: string
) {
  const supabase = await createSupabaseServerClient();
  const { name, type, price, exp_date } = medicineData;
  try {
    const { data, error } = await supabase
      .from("medicine")
      .insert({ name, type, price, exp_date })
      .select("*")
      .single();

    if (error) {
      console.error("Error inserting new medicine:", error);
      throw new Error("Failed to insert new medicine: " + error.message);
    }

    revalidatePath(`/caregiver/order/${orderId}/prepare/${orderId}`);

    return data; // Return the inserted medicine record, including generated ID
  } catch (error) {
    console.error("Error inserting new medicine:", error);
    throw error;
  }
}
