"use client";
import { getConversationById, getMessages } from "@/actions/getChats";
import EmptyState from "@/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import { useEffect, useState } from "react";

interface IParams {
  chatId: string;
}

const ConversationId = ({ params }: { params: IParams }) => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const conversationData = await getConversationById({
          chatId: params.chatId,
        });
        const messagesData = await getMessages({ chatId: params.chatId });
        setConversation(conversationData.data.data[0]);
        setMessages(messagesData.data.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, [params.chatId]);

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
        <Header conversation={conversation} />
        <Body initialMessages={messages || []} />
        <Form />
      </div>
    </div>
  );
};

export default ConversationId;
