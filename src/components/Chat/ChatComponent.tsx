"use client";

import { getChatOrder } from "@/app/_server-action/global/chat";
import { getClientPublicStorageURL } from "@/app/_server-action/global/storage/client";
import { createSupabaseClient } from "@/lib/client";
import { MESSAGES } from "@/types/AxolotlMainType";
import { CHAT_ORDER } from "@/types/AxolotlMultipleTypes";
import { IconCheck, IconChecks } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import ChatInput from "./ChatInput";

interface ChatComponentProps {
  senderId: string;
  role: string;
}

// TODO: UPDATE ITS RESPONSIVENESS
const ChatComponent = ({ senderId, role }: ChatComponentProps) => {
  /**
   * * States & Initial Variables
   */
  // const [loading, setLoading] = useState(true);
  const [chatData, setChatData] = useState<MESSAGES[]>([]);
  const [orderData, setOrderData] = useState<CHAT_ORDER[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = senderId;

  /**
   * * Realtime Chat Data Fetching
   */
  useSWR("chatData", () => {
    let subscription: any;

    const supabase = createSupabaseClient();

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender.eq.${currentUserId},recipient.eq.${currentUserId}`);

      if (error) return;

      setChatData(data || []);

      subscription = supabase
        .channel("public:messages")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          (payload) => {
            const newMessage = payload.new as MESSAGES;
            // Check if the new message is relevant to the current user
            if (
              newMessage.sender === currentUserId ||
              newMessage.recipient === currentUserId
            ) {
              setChatData((prevMessages) => {
                if (payload.eventType === "INSERT") {
                  return [...prevMessages, newMessage];
                } else if (payload.eventType === "UPDATE") {
                  return prevMessages.map((msg) =>
                    msg.id === newMessage.id ? newMessage : msg
                  );
                } else {
                  return prevMessages;
                }
              });
            }
          }
        )
        .subscribe();
    };

    fetchMessages();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  });

  /**
   * * Realtime Order Data Fetching
   */
  useSWR("orderData", () => {
    let subscription: any;

    const supabase = createSupabaseClient();

    const fetchMessages = async () => {
      const chatOrderData = await getChatOrder();

      if (!chatOrderData) {
        return;
      }

      setOrderData(Array.isArray(chatOrderData) ? chatOrderData : []);

      subscription = supabase
        .channel("public:order")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "order" },
          async (payload) => {
            const newOrder = payload.new as CHAT_ORDER;

            const { data: fullOrderData, error } = await supabase
              .from("order")
              .select("*, patient(*, users(*)), caregiver(*, users(*))")
              .eq("id", newOrder.id)
              .single();

            if (error) return;

            setOrderData((prevOrderData) => {
              if (payload.eventType === "INSERT") {
                return [...prevOrderData, fullOrderData];
              } else if (payload.eventType === "UPDATE") {
                return prevOrderData.map((order) =>
                  order.id === newOrder.id ? fullOrderData : order
                );
              } else {
                return prevOrderData;
              }
            });
          }
        )
        .subscribe();
    };

    fetchMessages();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  });

  /**
   * * Formatters
   */
  const hourFormatter = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "Asia/Jakarta"
  });

  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Jakarta"
  });

  const formatTime = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        return "Invalid time";
      }

      return hourFormatter.format(dateObj);
    } catch {
      return "Invalid time";
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        return "Invalid date";
      }

      return dateFormatter.format(dateObj);
    } catch {
      return "Invalid date";
    }
  };

  /**
   * * Get Latest Messages for Chat List
   */
  const latestChats = useMemo(() => {
    const contactsMap: Record<
      string,
      {
        otherUserUuid: string;
        otherUserId: string;
        otherUserName: string;
        otherUserPhoto: string;
        lastMessage: MESSAGES | null;
        unreadCount: number;
      }
    > = {};

    orderData.forEach((order) => {
      let otherUserUuid = "";
      let otherUserId = "";
      let otherUserName = "";
      let otherUserPhoto = "";

      if (["Nurse", "Midwife"].includes(role)) {
        otherUserUuid = order.patient.users.user_id;
        otherUserId = order.patient_id;
        otherUserName = order.patient.user_full_name;
        otherUserPhoto = "/images/user/Default Patient Photo.png";
      } else {
        otherUserUuid = order.caregiver.users.user_id;
        otherUserId = order.caregiver_id;
        otherUserName = order.caregiver.user_full_name;
        otherUserPhoto = getClientPublicStorageURL(
          "profile_photo",
          order.caregiver.profile_photo
        );
      }

      contactsMap[otherUserUuid] = {
        otherUserUuid,
        otherUserId,
        otherUserName,
        otherUserPhoto,
        lastMessage: null,
        unreadCount: 0
      };
    });

    chatData.forEach((chat) => {
      const otherUserId =
        chat.sender === currentUserId ? chat.recipient : chat.sender;

      if (contactsMap[otherUserId]) {
        if (
          !contactsMap[otherUserId].lastMessage ||
          new Date(chat.created_at) >
            new Date(contactsMap[otherUserId].lastMessage!.created_at)
        ) {
          contactsMap[otherUserId].lastMessage = chat;
        }

        if (
          chat.recipient === currentUserId &&
          chat.sender === otherUserId &&
          !chat.is_read
        ) {
          contactsMap[otherUserId].unreadCount += 1;
        }
      }
    });

    const contactsArray = Object.values(contactsMap);

    // Sort contacts by lastMessage time
    contactsArray.sort((a, b) => {
      const timeA = a.lastMessage
        ? new Date(a.lastMessage.created_at).getTime()
        : 0;
      const timeB = b.lastMessage
        ? new Date(b.lastMessage.created_at).getTime()
        : 0;

      return timeB - timeA;
    });

    return contactsArray;
  }, [orderData, chatData, currentUserId, role]);

  /**
   * * Messages to display in Chat Panel
   */
  const messagesToDisplay = useMemo(() => {
    if (!activeChat) return [];

    return chatData
      .filter(
        (chat) =>
          (chat.sender === currentUserId && chat.recipient === activeChat) ||
          (chat.sender === activeChat && chat.recipient === currentUserId)
      )
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
  }, [activeChat, currentUserId, chatData]);

  /**
   * * Auto-scroll to bottom when messages change
   */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesToDisplay]);

  /**
   * * Mark messages as read when chat is active or window is focused
   */
  useEffect(() => {
    if (!activeChat) return;

    const supabase = createSupabaseClient();

    const markMessagesAsRead = async () => {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender", activeChat)
        .eq("recipient", currentUserId)
        .eq("is_read", false);

      if (error) {
        console.error("Error updating messages:", error.message);
      } else {
        // Update local chatData to reflect the changes
        setChatData((prevChatData) =>
          prevChatData.map((message) => {
            if (
              message.sender === activeChat &&
              message.recipient === currentUserId &&
              !message.is_read
            ) {
              return { ...message, is_read: true };
            }

            return message;
          })
        );
      }
    };

    markMessagesAsRead();

    const handleWindowFocus = () => {
      markMessagesAsRead();
    };

    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [activeChat, currentUserId]);

  return (
    <div className="flex max-h-150 min-h-150 w-full flex-col rounded-xl bg-white md:flex-row">
      {/* Chat List */}
      <div className="w-1/3 border-r p-5">
        <h1 className="mb-5 text-heading-5 font-bold">Chats</h1>
        <div className="flex flex-col gap-1">
          {latestChats.map((chat) => {
            const {
              otherUserUuid,
              otherUserName,
              otherUserPhoto,
              lastMessage,
              unreadCount
            } = chat;

            return (
              <div
                key={otherUserUuid}
                className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition ${
                  activeChat === otherUserUuid
                    ? "bg-kalbe-ultraLight hover:bg-kalbe-proLight"
                    : "hover:bg-kalbe-ultraLight"
                }`}
                onClick={() => setActiveChat(otherUserUuid)}
              >
                <div className="relative h-12 w-12 flex-shrink-0">
                  <Image
                    width={200}
                    height={200}
                    src={otherUserPhoto}
                    alt="User"
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="flex w-full justify-between">
                    <div className="flex flex-col items-start">
                      <h1 className="font-medium">{otherUserName}</h1>
                      <p className="truncate text-sm text-dark-secondary sm:max-w-20 lg:max-w-70">
                        {lastMessage ? (
                          lastMessage.sender === currentUserId ? (
                            <div className="flex w-full items-center justify-start gap-2">
                              {lastMessage.is_read ? (
                                <IconChecks stroke={1} size={20} />
                              ) : (
                                <IconCheck stroke={1} size={20} />
                              )}
                              <span className="block truncate text-ellipsis whitespace-nowrap text-dark-secondary md:text-sm">
                                {lastMessage.text}
                              </span>
                            </div>
                          ) : (
                            <span className="block truncate text-ellipsis whitespace-nowrap text-dark-secondary md:text-sm">
                              {lastMessage.text}
                            </span>
                          )
                        ) : (
                          ""
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-dark-secondary">
                        {lastMessage
                          ? new Date(lastMessage.created_at).toDateString() ===
                            new Date().toDateString()
                            ? formatTime(lastMessage.created_at)
                            : formatDate(lastMessage.created_at)
                          : ""}
                      </p>
                      {unreadCount > 0 && (
                        <div className="flex-shrink-0">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                            {unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        {activeChat && (
          <div className="flex items-center gap-3 border-b p-5">
            <div className="relative h-12 w-12">
              <Image
                width={200}
                height={200}
                src={
                  latestChats.find((chat) => chat.otherUserUuid === activeChat)
                    ?.otherUserPhoto || "/images/user/Default Patient Photo.png"
                }
                alt="User"
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h5 className="text-lg font-medium">
                {
                  latestChats.find((chat) => chat.otherUserUuid === activeChat)
                    ?.otherUserName
                }
              </h5>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeChat ? (
            <>
              {messagesToDisplay.map((chat, index) => {
                const showDate =
                  index === 0 ||
                  new Date(chat.created_at).toDateString() !==
                    new Date(
                      messagesToDisplay[index - 1].created_at
                    ).toDateString();

                return (
                  <div key={chat.id} className="mb-5 flex flex-col gap-2">
                    {showDate && (
                      <div className="mb-3 flex justify-center">
                        <span className="rounded-lg bg-gray-200 px-3 py-1 text-xs">
                          {formatDate(chat.created_at)}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex ${
                        chat.sender === currentUserId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-sm rounded-lg p-3 ${
                          chat.sender === currentUserId
                            ? "rounded-br-none bg-kalbe-proLight"
                            : "rounded-tl-none bg-gray"
                        }`}
                      >
                        <p className="pr-10">{chat.text}</p>
                        {chat.sender === currentUserId && (
                          <div className={`flex w-full justify-end`}>
                            {chat.is_read ? (
                              <IconChecks stroke={1} size={20} />
                            ) : (
                              <IconCheck stroke={1} size={20} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <p
                      className={`${
                        chat.sender === currentUserId
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {formatTime(chat.created_at)}
                    </p>
                  </div>
                );
              })}
              {/* Reference div for auto-scroll */}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          )}
        </div>

        {/* Input Field */}
        {activeChat && (
          <ChatInput senderId={currentUserId} recipientId={activeChat} />
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
