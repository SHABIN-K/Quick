"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";

import ConversationBox from "./ConversationBox";
import { useSession } from "@/context/AuthContext";
import { getConversations } from "@/actions/getChats";
import useConversation from "@/hooks/useConversation";
import { FullConversationType } from "@/shared/types";

const ConversationList = () => {
  const router = useRouter();
  const { getSession } = useSession();
  const { conversationId, isOpen } = useConversation();

  const [items, setItems] = useState<FullConversationType[]>();

  useEffect(() => {
    const fetchConverstations = async () => {
      try {
        const email = getSession?.email as string;
        if (email) {
          const response = await getConversations({ email });
          setItems(response.data.data);
        } else {
          console.error("Error: user is undefined");
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConverstations();
  }, [getSession]);

  return (
    <>
      <aside
        className={clsx(
          `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition">
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items?.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
