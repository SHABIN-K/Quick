import { pusherClient } from "./../config/pusher";
import axios from "../config/api";

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
}) => axios.post("/auth/signup", { name, username, email, password });

export const signInApi = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => axios.post("/auth/login", { email, password }, { withCredentials: true });

export const logoutApi = () =>
  axios.get("/auth/logout", { withCredentials: true });
