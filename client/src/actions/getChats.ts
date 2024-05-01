import axios from "../config/api";

export const getUsers = async ({ email }: { email: string }) => {
  const result = await axios.post(
    "/chats/users",
    { email },
    {
      withCredentials: true,
    }
  );
  return result;
};

export const getChats = async ({
  userId,
  chatId,
}: {
  userId: string;
  chatId: string;
}) => {
  const result = await axios.post(
    "/chats/conversations",
    { userId, chatId },
    {
      withCredentials: true,
    }
  );
  return result;
};
