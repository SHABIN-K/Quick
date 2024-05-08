import { useEffect } from "react";

function useRefreshToken() {
  const dispatch = useDispatch();

  const refresh = async () => {
    const response = await refreshTokenApi();
    dispatch(setAuth(response.data?.data));
    return response.data?.data;
  };

  return refresh;
}

const usePrivateApi = () => {
  const refresh = useRefreshToken();
  return <div>usePrivateApi</div>;
};

export default usePrivateApi;
