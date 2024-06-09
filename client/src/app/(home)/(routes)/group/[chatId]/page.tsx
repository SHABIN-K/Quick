"use client";

import { useEffect, useState } from "react";

import { db } from "@/database";
import useUsersStore from "@/store/useUsers";
import EmptyState from "@/components/EmptyState";
import usePrivateApi from "@/hooks/usePrivateApi";
import LoadingModal from "@/components/LoadingModal";
import { Header, Body, Form } from "@/app/(home)/components/body";
import { FullConversationType, FullMessageType } from "@/shared/types";

interface IParams {
  chatId: string;
}

const GroupId = ({ params }: { params: IParams }) => {
  const api = usePrivateApi();
  const { addUser } = useUsersStore();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<FullMessageType[]>();
  const [conversation, setConversation] = useState<FullConversationType>();

  useEffect(() => {
    const fetch = async () => {
      try {
        const chatId = params.chatId;
        let chat = await db.groupchat.get(chatId);
        api.get(`/chats/${chatId}/seen`);
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
        //get all users
        const user = await api.get("/users/get-users");

        setConversation(chat);
        setIsLoading(false);
        addUser(user.data.data);
      } catch (err: any) {
        console.error("Error fetching:", err);
        setError(err.message);
      }
    };

    fetch();
  }, [addUser, api, params.chatId]);

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
        <Header conversation={conversation} chatType="group" />
        <Body initialMessages={messages || []} chatType="group" />
        <Form />
      </div>
    </div>
  );
};

export default GroupId;
