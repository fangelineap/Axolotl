"use server";

import { CaregiverOrder } from "@/app/(pages)/caregiver/type/data";
import createSupabaseServerClient, {
  getUserDataFromSession,
  getUserFromSession
} from "@/lib/server";
import { MEDICINE_ORDER_DETAIL } from "@/types/AxolotlMainType";

import { unstable_noStore } from "next/cache";

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
      .eq("caregiver_id", caregiver_id);

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
      user
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
  proofOfServiceFile: File | null,
  medicine: { id: string; quantity: number; price: number }[]
) {
  const supabase = await createSupabaseServerClient();

  try {
    const currentUser = await getUserFromSession();
    if (!currentUser || !currentUser.data) {
      throw new Error("Unable to retrieve user session");
    }

    // Step 1: Upload the proof_of_service image to Supabase storage (if provided)
    let proofOfServiceUrl = null;
    if (proofOfServiceFile) {
      const { data: imageData, error: imageError } = await supabase.storage
        .from("proofs_of_service") // Replace with your actual storage bucket
        .upload(
          `order_${orderId}/${proofOfServiceFile.name}`,
          proofOfServiceFile
        );

      if (imageError) {
        throw new Error(
          "Failed to upload proof of service image: " + imageError.message
        );
      }

      proofOfServiceUrl = imageData?.path || null; // Save the file path for storing in the database
    }
    // Step 2: Update the `order` table with the proof_of_service URL
    const { error: updateOrderError } = await supabase
      .from("order")
      .update({
        proof_of_service: proofOfServiceUrl
      })
      .eq("id", orderId);

    if (updateOrderError) {
      throw new Error(
        "Failed to update order with proof of service: " +
          updateOrderError.message
      );
    }

    // Step 3: Insert a new record into the `medicine_order` table
    const totalQty = medicine.reduce((sum, med) => sum + med.quantity, 0); // Total quantity of medicines
    const subTotal = medicine.reduce(
      (sum, med) => sum + med.price * med.quantity,
      0
    ); // Subtotal of medicine prices
    const deliveryFee = 10000; // Example delivery fee, you can change this
    const totalPrice = subTotal + deliveryFee; // Total price

    const { data: medicineOrderData, error: medicineOrderError } =
      await supabase
        .from("medicine_order")
        .insert({
          total_qty: totalQty,
          sub_total_medicine: subTotal,
          delivery_fee: deliveryFee,
          total_price: totalPrice,
          is_paid: false, // Set payment status as unpaid initially
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select("id")
        .single(); // Return the newly inserted record's ID

    if (medicineOrderError) {
      throw new Error(
        "Failed to create medicine order: " + medicineOrderError.message
      );
    }

    const medicineOrderId = medicineOrderData?.id;

    // Step 4: Update the `order` table with the `medicine_order_id`
    const { error: updateMedicineOrderIdError } = await supabase
      .from("order")
      .update({
        medicine_order_id: medicineOrderId
      })
      .eq("id", orderId);

    if (updateMedicineOrderIdError) {
      throw new Error(
        "Failed to update order with medicine order ID: " +
          updateMedicineOrderIdError.message
      );
    }

    // Step 5: Insert ordered medicines into the `medicine_order_detail` table
    const medicineOrderDetails = medicine.map((med) => ({
      quantity: med.quantity,
      total_price: med.price * med.quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      medicine_id: med.id, // Reference to the medicine table
      medicine_order_id: medicineOrderId // Reference to the newly created medicine_order
    }));

    const { error: medicineOrderDetailsError } = await supabase
      .from("medicine_order_detail")
      .insert(medicineOrderDetails);

    if (medicineOrderDetailsError) {
      throw new Error(
        "Failed to insert medicine order details: " +
          medicineOrderDetailsError.message
      );
    }

    return { success: true, message: "Order finished successfully!" };
  } catch (error) {
    console.error(
      "Error finishing order:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw new Error("Failed to finish order");
  }
}
