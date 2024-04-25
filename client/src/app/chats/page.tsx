"use client";

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
    <div className="justify-center align-middle pl-10 w-1/2">
      <button className="border" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Chats;
