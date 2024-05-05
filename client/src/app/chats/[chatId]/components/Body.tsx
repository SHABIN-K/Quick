"use client";

import { useEffect, useRef, useState } from "react";
import useConversation from "@/hooks/useConversation";
import { FullMessageType } from "@/shared/types";
import MessageBox from "./MessageBox";
import axios from "@/config/api";
import { useSession } from "@/context/AuthContext";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { getSession } = useSession();
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/chats/conversations/${conversationId}`, {
      email: getSession?.email,
    });
  }, [conversationId, getSession?.email]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
