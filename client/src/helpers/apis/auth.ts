import axios from "../../config/api";

export const signupApi = ({
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
