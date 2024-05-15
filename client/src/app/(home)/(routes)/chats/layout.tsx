"use client";

import { useEffect, useState } from "react";

import usePrivateApi from "@/hooks/usePrivateApi";
import { FullConversationType } from "@/shared/types";
import ConversationList from "../../components/ConversationList";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const api = usePrivateApi();
  const [feed, setFeed] = useState<FullConversationType[]>();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/chats/get-chats");
        setFeed(res.data.data);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetch();
  }, [api]);

  return (
    <div className="h-full">
      <ConversationList title="Chats" feed={feed} />
      {children}
    </div>
  );
}