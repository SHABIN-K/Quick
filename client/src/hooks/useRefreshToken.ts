import useAuthStore from "@/store/useAuth";
import { refreshTokenApi } from "@/actions/getAuth";

function useRefreshToken() {
  const { setUser } = useAuthStore();

  const refresh = async () => {
    const response = await refreshTokenApi();
    const { id, name, email, username, profile, confirmToken } =
      response?.data?.data;
    setUser({ id, name, email, username, profile, confirmToken });
    return response.data;
  };

  return refresh;
}

export default useRefreshToken;
