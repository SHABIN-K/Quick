"use client";

import { useEffect, useState } from "react";

import { db } from "@/database";
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
    const fetchData = async () => {
      try {
        let data = null;

        // Check if data exists in IndexedDB
        const indexedDBData = await db.chats.toArray();
        if (indexedDBData.length > 0) {
          // Data exists in IndexedDB, use it
          data = indexedDBData;
        } else {
          // Data doesn't exist in IndexedDB, fetch from API
          const res = await api.get("/chats/get-chats");
          data = res.data.data;

          // Store data in IndexedDB
          await db.chats.clear();
          await db.chats.bulkAdd(data);
        }

        // Set data as state
        setFeed(data);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetchData();
  }, [api]);

  return (
    <div className="h-full">
      <ConversationList title="Chats" feed={feed} />
      {children}
    </div>
  );
}
