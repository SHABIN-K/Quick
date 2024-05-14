"use client";

import { useEffect, useState } from "react";

import usePrivateApi from "@/hooks/usePrivateApi";
import ConversationList from "../../components/ConversationList";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const api = usePrivateApi();
  const [users, setUsers] = useState();

  useEffect(() => {
    const fetch = async () => {
      try {
        const user = await api.get("/users/all");
        setUsers(user.data.data);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetch();
  }, [api]);

  return (
    <div className="h-full">
      <ConversationList title="People" userData={users} />
      {children}
    </div>
  );
}
