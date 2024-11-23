"use server";

import createSupabaseServerClient, {
  getUserDataFromSession
} from "@/lib/server";
import { MESSAGES } from "@/types/AxolotlMainType";
import { CHAT_ORDER } from "@/types/AxolotlMultipleTypes";
import { ServerFormValidation } from "@/utils/Validation/form/ServerFormValidation";
import { revalidatePath, unstable_noStore } from "next/cache";

/**
 * * Get all users corresponding to the chat order
 * @returns
 */
export async function getChatOrder() {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  try {
    const currentUser = await getUserDataFromSession();

    let supabaseQuery = supabase
      .from("order")
      .select("*, patient(*, users(*)), caregiver(*, users(*))")
      .eq("status", "Ongoing")
      .not("proof_of_service", "is", null);

    if (currentUser.role === "Patient") {
      supabaseQuery = supabaseQuery.eq("patient_id", currentUser.patient.id);
    } else if (["Nurse", "Midwife"].includes(currentUser.role)) {
      supabaseQuery = supabaseQuery.eq(
        "caregiver_id",
        currentUser.caregiver.id
      );
    }

    const { data: orderData, error: orderDataError } = await supabaseQuery;

    if (orderDataError) {
      console.error("Error fetching order data:", orderDataError.message);

      return orderDataError;
    }

    const mappedChatOrderData: CHAT_ORDER[] = orderData.map((order) => {
      return {
        ...order,
        patient: {
          ...order.patient,
          users: order.patient.users,
          user_full_name:
            order.patient.users.first_name + " " + order.patient.users.last_name
        },
        caregiver: {
          ...order.caregiver,
          users: order.caregiver.users,
          user_full_name:
            order.caregiver.users.first_name +
            " " +
            order.caregiver.users.last_name
        }
      };
    });

    return mappedChatOrderData as CHAT_ORDER[];
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return error;
  }
}

/**
 * * Send the message to the recipient
 * @param message
 * @returns
 */
export async function sendMessage(message: MESSAGES) {
  unstable_noStore();

  const supabase = await createSupabaseServerClient();

  const { text, sender, recipient, created_at } = message;
  const validationError = ServerFormValidation({
    text,
    sender,
    recipient,
    created_at
  });

  if (validationError) {
    console.error("Validation Error:", validationError);

    return { success: false, message: validationError };
  }

  try {
    const mappedMessage = {
      text,
      sender,
      recipient,
      created_at: new Date()
    };

    const { error } = await supabase.from("messages").insert(mappedMessage);

    if (error) {
      console.error("Error sending message:", error);

      return { success: false, message: "Error sending message" };
    }

    revalidatePath("/chat");

    return { success: true, message: "Message sent successfully" };
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return { success: false, message: "An unexpected error occurred" };
  }
}

/**
 * * Update the status of the message to read
 * @param messageId
 * @param recipientId
 * @returns
 */
export async function markMessagesAsRead(
  messageId: string,
  recipientId: string
) {
  const supabase = await createSupabaseServerClient();

  try {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", messageId)
      .eq("recipient", recipientId);

    if (error) {
      console.error("Error marking messages as read:", error);

      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);

    return { success: false };
  }
}
