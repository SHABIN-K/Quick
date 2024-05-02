import { useSession } from "@/context/AuthContext";
import { FullConversationType, User } from "@/shared/types";
import { useMemo } from "react";

const useOtherUser = (
  conversation: FullConversationType | { users: User[] }
) => {
  const { getSession } = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = getSession?.email;

    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );

    return otherUser[0];
  }, [getSession?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
