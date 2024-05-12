import clientApi from "../config/api";

export const signUpApi = ({
  name,
  username,
  email,
  password,
}: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => clientApi.post("/auth/signup", { name, username, email, password });

export const signInApi = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) =>
  clientApi.post("/auth/login", { email, password }, { withCredentials: true });

export const resetPassApi = ({
  password,
  token,
}: {
  password: string;
  token: String;
}) =>
  clientApi.post(
    "/auth/reset-password",
    { password, token },
    { withCredentials: true }
  );

export const logoutApi = ({ id }: { id: string }) =>
  clientApi.post("/auth/logout", { id }, { withCredentials: true });

export const forgetPassApi = ({ email }: { email: string }) =>
  clientApi.get(`/auth/forgot-password/${email}`);

export const refreshTokenApi = () =>
  clientApi.get("/auth/refresh-token", { withCredentials: true });
