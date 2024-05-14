"use client";

import clsx from "clsx";
import { find } from "lodash";
import { useRouter } from "next/navigation";
import { MdOutlineGroupAdd } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";

import useAuthStore from "@/store/useAuth";
import GroupChatModal from "./GroupChatModal";
import { getUsers } from "@/actions/getUsers";
import { pusherClient } from "@/config/pusher";
import ConversationBox from "./ConversationBox";
import { getConversations } from "@/actions/getChats";
import useConversation from "@/hooks/useConversation";
import { FullConversationType, User } from "@/shared/types";

const ConversationList = () => {
  const router = useRouter();
  const { session } = useAuthStore();
  const { conversationId, isOpen } = useConversation();

  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<FullConversationType[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchConverstations = async () => {
      try {
        const email = session?.email as string;
        if (email) {
          const users = await getUsers({ email });
          setUsers(users.data.data);
          const conversation = await getConversations({ email });
          setItems(conversation.data.data);
        } else {
          console.error("Error: user is undefined");
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConverstations();
  }, [session]);

  const pusherKey = useMemo(() => {
    return session?.email;
  }, [session?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...(current as FullConversationType[])];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current?.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        })
      );
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [
          ...(current ?? []).filter((convo) => convo.id !== conversation.id),
        ];
      });

      if (conversationId === conversation.id) {
        router.push("/chats");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [conversationId, pusherKey, router]);

  return (
    <>
      <GroupChatModal
        users={users}
        currentUser={session?.email as string}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
            >
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
