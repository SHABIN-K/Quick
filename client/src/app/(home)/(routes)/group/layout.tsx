"use client";

import { useEffect, useState } from "react";

import usePrivateApi from "@/hooks/usePrivateApi";
import ConversationList from "../../components/ConversationList";

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const api = usePrivateApi();
  const [feed, setFeed] = useState();
  const [users, setUsers] = useState();

  useEffect(() => {
    const fetch = async () => {
      try {
        const chat = await api.get("/chats/get-groupchats");
        setFeed(chat.data.data);
        const user = await api.get("/users/get-users");
        setUsers(user.data.data);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetch();
  }, [api]);

  return (
    <div className="h-full">
      <ConversationList title="Groups" feed={feed} userData={users} />
      {children}
    </div>
  );
}
