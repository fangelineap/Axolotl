"use client";

import { MESSAGES } from "@/types/AxolotlMainType";
import { IconCheck, IconChecks, IconSend } from "@tabler/icons-react";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import AxolotlButton from "../Axolotl/Buttons/AxolotlButton";
import CustomInputGroup from "../Axolotl/InputFields/CustomInputGroup";

const chatData: MESSAGES[] = [
  {
    id: "1",
    text: "Hello, how are you?",
    sender: "1",
    recipient: "2",
    is_read: false,
    created_at: new Date("2024-11-20T10:00:00Z")
  },
  {
    id: "2",
    text: "I am waiting for you",
    sender: "2",
    recipient: "1",
    is_read: false,
    created_at: new Date("2024-11-20T19:00:00Z")
  },
  {
    id: "7",
    text: "Great, see you soon!",
    sender: "1",
    recipient: "2",
    is_read: true,
    created_at: new Date("2024-11-21T08:15:00Z")
  },
  {
    id: "8",
    text: "I'm here, where are you?",
    sender: "2",
    recipient: "1",
    is_read: false,
    created_at: new Date("2024-11-21T08:20:00Z")
  },
  {
    id: "9",
    text: "Did you finish the report?",
    sender: "3",
    recipient: "1",
    is_read: false,
    created_at: new Date("2024-11-21T09:00:00Z")
  },
  {
    id: "10",
    text: "Yes, I sent it to your email.",
    sender: "2",
    recipient: "3",
    is_read: true,
    created_at: new Date("2024-11-21T09:05:00Z")
  },
  {
    id: "11",
    text: "Thank you!",
    sender: "3",
    recipient: "2",
    is_read: true,
    created_at: new Date("2024-11-21T09:10:00Z")
  },
  {
    id: "12",
    text: "Are we still on for the meeting?",
    sender: "4",
    recipient: "1",
    is_read: false,
    created_at: new Date("2024-11-21T09:15:00Z")
  },
  {
    id: "13",
    text: "Yes, see you at 10.",
    sender: "1",
    recipient: "4",
    is_read: false,
    created_at: new Date("2024-11-21T09:20:00Z")
  },
  {
    id: "14",
    text: "Don't forget to bring the documents.",
    sender: "4",
    recipient: "1",
    is_read: false,
    created_at: new Date("2024-11-21T09:25:00Z")
  },
  {
    id: "15",
    text: "Got it, thanks!",
    sender: "1",
    recipient: "4",
    is_read: false,
    created_at: new Date("2024-11-21T09:30:00Z")
  }
];

const ChatCard = () => {
  /**
   * * States & Initial Variables
   */
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const currentUserId = "1";

  /**
   * * Refs
   */
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * * Formatters
   */
  const hourFormatter = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "Asia/Jakarta"
  });

  const dateFormatter = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const formatTime = (date: Date) => hourFormatter.format(date);
  const formatDate = (date: Date) => dateFormatter.format(date);

  /**
   * * Get Latest Messages for Chat List
   */
  const latestChats = useMemo(() => {
    const filteredChatData = chatData.filter(
      (chat) =>
        chat.sender === currentUserId || chat.recipient === currentUserId
    );

    const conversations = filteredChatData.reduce(
      (acc, chat) => {
        const otherUserId =
          chat.sender === currentUserId ? chat.recipient : chat.sender;

        if (
          !acc[otherUserId] ||
          new Date(chat.created_at).getTime() >
            new Date(acc[otherUserId].created_at).getTime()
        ) {
          acc[otherUserId] = chat;
        }

        return acc;
      },
      {} as Record<string, MESSAGES>
    );

    return Object.values(conversations).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [currentUserId]);

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
  }, [activeChat, currentUserId]);

  /**
   * * Auto-scroll to bottom when messages change
   */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesToDisplay]);

  return (
    <div className="flex max-h-125 min-h-125 w-full rounded-xl bg-white">
      {/* Chat List */}
      <div className="w-1/3 border-r p-5">
        <h1 className="mb-5 text-heading-5 font-bold">Chats</h1>
        <div className="flex flex-col gap-1">
          {latestChats.map((chat) => {
            const otherUserId =
              chat.sender === currentUserId ? chat.recipient : chat.sender;

            return (
              <div
                key={otherUserId}
                className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition ${
                  activeChat === otherUserId
                    ? "bg-kalbe-ultraLight hover:bg-kalbe-proLight"
                    : "hover:bg-kalbe-ultraLight"
                }`}
                onClick={() => setActiveChat(otherUserId)}
              >
                <div className="relative h-12 w-12">
                  <Image
                    width={200}
                    height={200}
                    src="/images/user/Default Caregiver Photo.png"
                    alt="User"
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="w-[90%]">
                  <div className="flex items-center justify-between">
                    <h1 className="font-medium">User {otherUserId || ""}</h1>
                    <p className="text-sm text-dark-secondary">
                      {new Date(chat.created_at).toDateString() ===
                      new Date().toDateString()
                        ? formatTime(chat.created_at)
                        : formatDate(chat.created_at)}
                    </p>
                  </div>
                  <p className="truncate text-sm text-dark-secondary">
                    {chat.sender === currentUserId ? (
                      <div className="flex w-full items-center justify-start gap-2">
                        {chat.is_read ? (
                          <IconChecks stroke={1} size={20} />
                        ) : (
                          <IconCheck stroke={1} size={20} />
                        )}
                        <span>{chat.text}</span>
                      </div>
                    ) : (
                      chat.text
                    )}
                  </p>
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
                src="/images/user/Default Caregiver Photo.png"
                alt="User"
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h5 className="text-lg font-medium">User {activeChat}</h5>
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
          <div className="flex items-center justify-between gap-3 border-t p-5 pb-4">
            <CustomInputGroup
              placeholder="Type your message..."
              type="text"
              name="message"
              forChat
              required={false}
            />
            <AxolotlButton
              type="submit"
              label=""
              variant="primary"
              customWidth
              customClasses="w-fit"
              endIcon={<IconSend size={20} />}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatCard;
