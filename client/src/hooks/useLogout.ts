import toast from "react-hot-toast";
import { logoutApi } from "@/actions/getAuth";

async function useLogout() {
  try {
    const res = await logoutApi();

    if (res.data && res.data.success) {
      // Redirect to the home page
      window.location.href = "/";

      document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
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
