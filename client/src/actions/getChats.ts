import axios from "../config/api";

export const getUsers = ({ email }: { email: string }) =>
  axios.post("/chats/users", { email }, { withCredentials: true });
