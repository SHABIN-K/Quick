import axios from "../config/api";

export const getUsers = async ({ email }: { email: string }) => {
  const result = await axios.post(
    "/users/get-users",
    { email },
    {
      withCredentials: true,
    }
  );
  return result;
};
