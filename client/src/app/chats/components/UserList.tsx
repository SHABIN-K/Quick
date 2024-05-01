"use client";
import { useEffect, useState } from "react";

import UserBox from "./UserBox";
import { UserType } from "@/shared/types";
import { getUsers } from "@/actions/getChats";
import { useSession } from "@/context/AuthContext";

const UserList = () => {
  const { getSession } = useSession();
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const email = getSession?.email as string;
        if (email) {
          const response = await getUsers({ email });
          setUsers(response.data.data);
        } else {
          console.error("Error: user is undefined");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [getSession]);

  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0">
      <div className="px-5">
        <div className="flex-col">
          <div className="text-2xl font-bold text-neutral-800 py-4">People</div>
        </div>
        {users.map((user) => (
          <UserBox
            key={user.id}
            data={user}
            currentUser={getSession?.email as string}
          />
        ))}
      </div>
    </aside>
  );
};

export default UserList;
