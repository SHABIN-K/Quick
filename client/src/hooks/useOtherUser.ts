import { useMemo } from "react";
import useAuthStore from "@/store/useAuth";

import { FullConversationType, User } from "@/shared/types";

const useOtherUser = (
  conversation: FullConversationType | { users: User[] }
) => {
  const { session } = useAuthStore();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.email;

    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );

    return otherUser[0];
  }, [session?.email, conversation?.users]);

  return otherUser;
};

export default useOtherUser;
