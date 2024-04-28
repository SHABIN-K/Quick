import axios from "../config/api";

export const getUsers = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const result = await axios.post(
    "/chats/users",
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
  console.log(result);

  return result;
};
