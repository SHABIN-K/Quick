"use client";

import { getConversations } from "@/actions/getChats";
import { useSession } from "@/context/AuthContext";
import { FullConversationType, UserType } from "@/shared/types";
import { useEffect, useState } from "react";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: UserType[];
}
const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const { getSession } = useSession();

  const [conversations, setConversations] = useState<[]>([]);

  useEffect(() => {
    const fetchConverstations = async () => {
      try {
        const email = getSession?.email as string;
        if (email) {
          const response = await getConversations({ email });
          setConversations(response.data.data);
        } else {
          console.error("Error: user is undefined");
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConverstations();
  }, [getSession]);

  return <div>ConversationList</div>;
};

export default ConversationList;
