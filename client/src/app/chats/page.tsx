"use client";

import EmptyState from "@/components/EmptyState";
import { logoutApi } from "@/helpers/apis/auth";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";

const Chats = () => {
  const router = useRouter();
  const [, , removeCookie] = useCookies(["token"]);

  const handleLogout = async () => {
    try {
      const res = await logoutApi();
      // Call logout API

      if (res.data.success) {
        // Remove token cookie
        removeCookie("token");

        // Clear local storage
        localStorage.clear();
        toast.success("Come back and Quick chat soon!");
        router.push("/");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyState />
    </div>
  );
};

export default Chats;
