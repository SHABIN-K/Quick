"use client";

import { useEffect, useState } from "react";

import useUsersStore from "@/store/useUsers";
import EmptyState from "@/components/EmptyState";
import usePrivateApi from "@/hooks/usePrivateApi";
import { Header, Body, Form } from "@/app/(home)/components/body";

interface IParams {
  chatId: string;
}

const GroupId = ({ params }: { params: IParams }) => {
  const api = usePrivateApi();
  const { addUser } = useUsersStore();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        var chatId = params.chatId;

        //get chats from chat id
        const chat = await api.get(`/chats/get-chats/${chatId}`);
        setConversation(chat.data.data[0]);

        //get messages from chat id
        const msg = await api.get(`/chats/msg/get-messages/${chatId}`);
        setMessages(msg.data.data);

        //get all users
        const user = await api.get("/users/get-users");
     
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
      <div className="h-full flex flex-col">
        <Header conversation={conversation} chatType="group" />
        <Body initialMessages={messages || []} chatType="group" />
        <Form />
      </div>
    </div>
  );
};

export default GroupId;
