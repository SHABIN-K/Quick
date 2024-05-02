import axios from "../config/api";

export const getChats = async ({
  userId,
  chatId,
}: {
  userId: string;
  chatId: string;
}) => {
  const result = await axios.post(
    "/chats/get-chat",
    { userId, chatId },
    {
      withCredentials: true,
    }
  );
  return result;
};

export const getConversations = async ({ email }: { email: string }) => {
  const result = await axios.post(
    "/chats/conversations",
    { email },
    {
      withCredentials: true,
    }
  );
  return result;
};


export const getConversationById = async ({ chatId }: { chatId: string }) => {
  const result = await axios.post(
    "/chats/get-conversations",
    { chatId },
    {
      withCredentials: true,
    }
  );
  return result;
};
