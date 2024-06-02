"use client";

import { find } from "lodash";
import { FiLock } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

import MessageBox from "./MessageBox";
import GroupMsgBox from "./GroupMsgBox";
import useAuthStore from "@/store/useAuth";
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
  const { session } = useAuthStore();
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

    const messageHandler = (data: { id: string; message: FullMessageType }) => {
      api.get(`/chats/${conversationId}/seen`);
    
      setMessages((current) => {
        // Find and remove the instant message by its id
        const filteredMessages = current.filter(
          (msg) => !(msg.isInstant && msg.id === data.id)
        );
    
        if (find(filteredMessages, { id: data.message.id })) {
          return filteredMessages;
        }
    
        // Add the new message and sort by createdAt date
        const updatedMessages = [...filteredMessages, data.message].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    
        return updatedMessages;
      });
    

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

    const instantUpdate = (data: { id: string; message: string }) => {
      const message: FullMessageType = {
        id: data.id,
        body: data.message,
        createdAt: new Date().toString(),
        isInstant: true,
        seenIds: [],
        seen: [],
        sender: {
          id: session?.id,
          name: session?.name,
          email: session?.email,
          profile: session?.profile,
          createdAt: new Date().toString(),
        },
      };
    
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        return updatedMessages;
      });
    
      bottomRef?.current?.scrollIntoView();
    };
    

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);
    pusherClient.bind("instant:message", instantUpdate);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
      pusherClient.unbind("instant:message", instantUpdate);
    };
  }, [api, conversationId, session]);

  return (
    <div className="flex-1 overflow-y-scroll body-scroll bg-[url(/background.jpg)]">
      <div className="flex flex-col items-center mt-3">
        <div className="bg-sky-500 text-white font-normal text-xs p-1.5 rounded-md tracking-tighter text-center h-14">
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

      <div ref={bottomRef} className="pt-20" />
    </div>
  );
};

export default Body;
