"use client";
import { getUsers } from "@/actions/getChats";
import { useSession } from "@/context/AuthContext";

const UserList = () => {
  const { getSession } = useSession();
  const users = getUsers({ email: getSession?.email as string });
  return <div>UserList</div>;
};

export default UserList;
