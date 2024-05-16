"use client";

import { find } from "lodash";
import { FiLock } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

import MessageBox from "./MessageBox";
import GroupMsgBox from "./GroupMsgBox";
import { pusherClient } from "@/config/pusher";
import { FullMessageType } from "@/shared/types";
import usePrivateApi from "@/hooks/usePrivateApi";
import useConversation from "@/hooks/useConversation";

interface BodyProps {
  initialMessages: FullMessageType[];
  chatType: string;
}

const Body: React.FC<BodyProps> = ({ initialMessages, chatType }) => {
  const api = usePrivateApi();
  const { conversationId } = useConversation();

  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get(`/chats/${conversationId}/seen`);
    setMessages(initialMessages);
  }, [api, conversationId, initialMessages]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      api.get(`/chats/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [api, conversationId]);

  return (
    <div className="flex-1 overflow-y-scroll body-scroll">
      <div className="flex flex-col items-center mt-3">
        <div className="bg-sky-100 text-black font-normal text-xs p-1.5 rounded-md tracking-tighter text-center h-14">
          <p className="flex ">
            <FiLock />
            Messages and calls are end-to-end encrypted.
          </p>
          <p>No one outside of this chat,not even Quick,</p>
          <p>can read or listen to them.</p>
        </div>
      </div>
      {chatType === "chat" ? (
        <>
          {messages.map((message, i) => (
            <MessageBox
              isLast={i === messages.length - 1}
              key={message.id}
              data={message}
            />
          ))}
        </>
      ) : (
        <>
          {messages.map((message, i) => (
            <GroupMsgBox
              isLast={i === messages.length - 1}
              key={message.id}
              data={message}
            />
          ))}
        </>
      )}

      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
