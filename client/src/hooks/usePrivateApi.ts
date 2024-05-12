import { useEffect } from "react";

import { privateApi } from "@/config/api";
import useAuthStore from "@/store/useAuth";
import useRefreshToken from "./useRefreshToken";

const usePrivateApi = () => {
  const refresh = useRefreshToken();
  const { session } = useAuthStore();

  useEffect(() => {
    // Add a request interceptor
    const requestIntercept = privateApi.interceptors.request.use(
      (config) => {
        console.log("config request::", config);

        if (!config.headers.Authorization) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `Bearer ${session?.confirmToken}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    // Add a response interceptor
    const responseIntercept = privateApi.interceptors.response.use(
      (response) => response,
      async (err) => {
        console.log("response::", err);

        const prvsRequest = err?.config;
        if (
          err?.response &&
          (err.response.status === 403 || err.response.status === 401) &&
          prvsRequest &&
          !prvsRequest.sent &&
          !prvsRequest._retry
        ) {
          prvsRequest._retry = true;
          const { confirmToken } = await refresh();
          prvsRequest.headers.Authorization = `Bearer ${confirmToken}`;
          return privateApi(prvsRequest);
        }

        return Promise.reject(err);
      }
    );
    return () => {
      privateApi.interceptors.request.eject(requestIntercept);
      privateApi.interceptors.response.eject(responseIntercept);
    };
  }, [refresh, session?.confirmToken]);

  return privateApi;
};

export default usePrivateApi;
