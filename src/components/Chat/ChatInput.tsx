import { sendMessage } from "@/app/_server-action/global/chat";
import { MESSAGES } from "@/types/AxolotlMainType";
import { IconSend } from "@tabler/icons-react";
import { toast } from "react-toastify";
import AxolotlButton from "../Axolotl/Buttons/AxolotlButton";
import CustomInputGroup from "../Axolotl/InputFields/CustomInputGroup";

interface ChatInputProps {
  senderId: string;
  recipientId: string;
}

function ChatInput({ senderId, recipientId }: ChatInputProps) {
  const handleSubmit = async (message: string) => {
    const mappedMessage: MESSAGES = {
      id: "",
      text: message,
      sender: senderId,
      recipient: recipientId,
      is_read: false,
      created_at: new Date()
    };

    const { success } = await sendMessage(mappedMessage);

    if (!success) {
      toast.error("Error sending message", {
        position: "bottom-right"
      });

      return;
    }

    toast.success(`Message sent successfully`, {
      position: "bottom-right"
    });
  };

  return (
    <div className="flex items-center justify-between gap-3 border-t p-5 pb-4">
      <CustomInputGroup
        placeholder="Type your message..."
        type="text"
        name="message"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const inputElement = e.currentTarget as HTMLInputElement;
            handleSubmit(inputElement.value);

            e.currentTarget.value = "";
          }
        }}
        forChat
        required={false}
      />
      <AxolotlButton
        type="submit"
        label=""
        variant="primary"
        customWidth
        onClick={() => {
          const inputElement = document.querySelector(
            'input[name="message"]'
          ) as HTMLInputElement;
          if (inputElement) {
            handleSubmit(inputElement.value);

            inputElement.value = "";
          }
        }}
        customClasses="w-fit"
        endIcon={<IconSend size={20} />}
      />
    </div>
  );
}

export default ChatInput;
