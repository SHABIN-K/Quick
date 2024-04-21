import axios from "../../config/api";

export const signupApi = ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => axios.post("/auth/signup", { name, email, password });
