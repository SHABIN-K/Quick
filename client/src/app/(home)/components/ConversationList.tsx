"use client";

import clsx from "clsx";
import { find } from "lodash";
import { useRouter } from "next/navigation";
import { MdOutlineGroupAdd } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";

import SearchBar from "./SearchBar";
import useAuthStore from "@/store/useAuth";
import GroupChatModal from "./GroupChatModal";
import { pusherClient } from "@/config/pusher";
import ConversationBox from "./ConversationBox";
import useConversation from "@/hooks/useConversation";
import { FullConversationType, User } from "@/shared/types";

interface ConversationProps {
  title: string;
  feed: FullConversationType[] | undefined;
  userData?: User[] | undefined;
}

const ConversationList: React.FC<ConversationProps> = ({
  title,
  feed,
  userData,
}) => {
  const router = useRouter();
  const { session } = useAuthStore();
  const { conversationId, isOpen } = useConversation();

  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<FullConversationType[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setUsers(userData || []);
    setItems(feed);
  }, [feed, userData]);

  /**
   * Returns the pusher key based on the session email.
   * @returns The pusher key.
   */
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
        let push = title === "Chats" ? "/chats" : "/group";
        router.push(push);
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
  }, [conversationId, pusherKey, router, title]);

  return (
    <>
      {title === "Groups" && (
        <GroupChatModal
          users={users}
          currentUser={session?.email as string}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <aside
        className={clsx(
          `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto bg-sky-50`,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-2.5">
          <div className="flex justify-between mb-4 pt-4 mt-2">
            <h2 className="text-xl font-semibold text-neutral-800">{title}</h2>
            {title === "Groups" && (
              <div
                onClick={() => setIsModalOpen(true)}
                className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition tooltip tooltip-bottom mr-4"
                data-tip="Create Group"
              >
                <MdOutlineGroupAdd size={20} />
              </div>
            )}
          </div>
          <div className="flex flex-col mb-3">
            <SearchBar />
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
