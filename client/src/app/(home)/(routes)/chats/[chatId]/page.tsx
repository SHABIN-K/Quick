"use client";

import { useEffect, useState } from "react";

import { db } from "@/database";
import EmptyState from "@/components/EmptyState";
import usePrivateApi from "@/hooks/usePrivateApi";
import LoadingModal from "@/components/LoadingModal";
import { Header, Body, Form } from "@/app/(home)/components/body";
import { FullConversationType, FullMessageType } from "@/shared/types";

interface IParams {
  chatId: string;
}

const ConversationId = ({ params }: { params: IParams }) => {
  const api = usePrivateApi();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<FullMessageType[]>();
  const [conversation, setConversation] = useState<FullConversationType>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatId = params.chatId;
        let chat = await db.chats.get(chatId);

        if (!chat) {
          const [resChat, resMsg] = await Promise.all([
            api.get(`/chats/get-chats/${chatId}`),
            api.get(`/chats/msg/get-messages/${chatId}`),
          ]);
          chat = resChat.data.data[0];
          setMessages(resMsg.data.data);
        } else {
          setMessages(chat.messages);
        }

        setConversation(chat);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error fetching:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, [api, params.chatId]);

  if (error || !conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      {isLoading && <LoadingModal />}
      <div className="h-full flex flex-col">
        <Header conversation={conversation} chatType="chats" />
        <Body initialMessages={messages || []} chatType="chat" />
        <Form />
      </div>
    </div>
  );
};

export default ConversationId;
