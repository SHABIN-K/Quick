import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { logoutApi } from "@/api/Auth";

async function useLogout() {
  const data = window.localStorage.getItem("user.profile");
  const user = JSON.parse(data as string);
  try {
    const res = await logoutApi({ id: user?.id });
    if (res.data && res.data.success) {
      // Redirect to the home page
      window.location.href = "/";
      Cookies.remove("-secure-node-authToken");
      localStorage.clear();
    } else {
      // Handle unsuccessful logout
      toast.error("Logout failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    toast.error("An error occurred during logout. Please try again later.");
  }
}

export default useLogout;
