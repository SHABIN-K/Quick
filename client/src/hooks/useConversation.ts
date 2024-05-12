import { useMemo } from "react";
import { useParams } from "next/navigation";

const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(() => {
    if (!params?.chatId) {
      return "";
    }

    return params.chatId as string;
  }, [params.chatId]);

  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return useMemo(
    () => ({
      isOpen,
      conversationId,
    }),
    [isOpen, conversationId]
  );
};

export default useConversation;
