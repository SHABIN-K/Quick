"use client";

import React, { useEffect, useState } from "react";

import { db } from "@/database";
import usePrivateApi from "@/hooks/usePrivateApi";
import { FullConversationType, User } from "@/shared/types";
import ConversationList from "../../components/ConversationList";

const GroupLayout = ({ children }: { children: React.ReactNode }) => {
  const api = usePrivateApi();
  const [users, setUsers] = useState<User[]>([]);
  const [groupChats, setGroupChats] = useState<FullConversationType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cachedGroupChats, cachedUsers] = await Promise.all([
          db.groupchat.toArray(),
          db.users.toArray(),
        ]);

        if (cachedGroupChats.length > 0 && cachedUsers.length > 0) {
          setGroupChats(cachedGroupChats);
          setUsers(cachedUsers);
        } else {
          const [groupChatsRes, usersRes] = await Promise.all([
            api.get("/chats/get-groupchats"),
            api.get("/users/get-users"),
          ]);

          const newGroupChats = groupChatsRes.data.data;
          const newUsers = usersRes.data.data;

          await Promise.all([
            db.groupchat.bulkAdd(newGroupChats),
            db.users.bulkAdd(newUsers),
          ]);

          setGroupChats(newGroupChats);
          setUsers(newUsers);
        }
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetchData();
  }, [api]);

  return (
    <div className="h-full">
      <ConversationList title="Groups" feed={groupChats} userData={users} />
      {children}
    </div>
  );
};

export default GroupLayout;
