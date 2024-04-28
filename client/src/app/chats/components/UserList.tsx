"use client";
import { getUsers } from "@/actions/getChats";
import { useSession } from "@/context/AuthContext";
import { useCookies } from "react-cookie";

const UserList = () => {
  const [cookies] = useCookies(["token"]);
  const { getSession } = useSession();

  const users = getUsers({
    email: getSession?.email as string,
    token: cookies.token,
  });
  return <div>UserList</div>;
};

export default UserList;
