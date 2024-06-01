"use client";

import clsx from "clsx";
import { find } from "lodash";
import { MdOutlineGroupAdd } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { db } from "@/database";
import UserBox from "./UserBox";
import SearchBar from "./SearchBar";
import useAuthStore from "@/store/useAuth";
import { pusherClient } from "@/config/pusher";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./modal/GroupChatModal";
import useConversation from "@/hooks/useConversation";
import { FullConversationType, FullMessageType, User } from "@/shared/types";

interface ConversationProps {
  title: string;
  feed?: FullConversationType[] | undefined;
  userData?: User[] | undefined;
}

const ConversationList: React.FC<ConversationProps> = ({
  title,
  feed,
  userData,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { session } = useAuthStore();
  const { conversationId, isOpen } = useConversation();

  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<FullConversationType[]>();

  const [searchText, setSearchText] = useState<string>("");
  const [searchedData, setSearchedData] = useState<
    FullConversationType[] | User[] | undefined
  >();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const otherUser = useCallback(
    (conversation: FullConversationType) => {
      const user = conversation.users.find((user) => user.id !== session.id);
      return user;
    },
    [session.id]
  );

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

    const newHandler = async (conversation: FullConversationType) => {
      // Store new conversation in IndexedDB
      if (conversation.isGroup) {
        await db.groupchat.add(conversation);
      } else {
        await db.chats.add(conversation);

        const user = otherUser(conversation);
        if (user) {
          await db.users.add(user);
        }
      }

      // Update state with the new conversation
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...(current || [])];
      });
    };

    const updateHandler = async (updateData: {
      id: string;
      isGroup: boolean;
      messages: FullMessageType[];
    }) => {
      try {
        let table = updateData.isGroup ? db.groupchat : db.chats;
        const conversation = await table.get(updateData.id);
        if (conversation) {
          const uniqueMessageIds = new Set(
            conversation.messages.map((msg) => msg.id)
          );

          // Add a null check or use optional chaining to safely access filter
          const filteredMessages = updateData.messages?.filter(
            (msg) => !uniqueMessageIds.has(msg.id)
          );

          // Check if filteredMessages is defined before merging
          const mergedMessages = filteredMessages
            ? [...conversation.messages, ...filteredMessages]
            : conversation.messages;

          conversation.messages = mergedMessages;
          await table.put(conversation);
        }

        setItems((current) =>
          current?.map((currentConversation) =>
            currentConversation.id === updateData.id
              ? { ...currentConversation, messages: updateData.messages }
              : currentConversation
          )
        );
      } catch (error) {
        console.error("Failed to update conversation in IndexedDB:", error);
      }
    };

    const removeHandler = async (conversation: FullConversationType) => {
      // Remove conversation from IndexedDB
      if (conversation.isGroup) {
        await db.groupchat.delete(conversation.id);
      } else {
        const user = otherUser(conversation);
        if (user) {
          await db.users.delete(user.id);
        }
        await db.chats.delete(conversation.id);
      }

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
  }, [conversationId, otherUser, pusherKey, router, session.id, title]);

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
          `fixed top-0 inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-hidden bg-sky-50 border-r shadow`,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-2.5">
          <div className="flex justify-between mb-4 pt-4 mt-2">
            <h2 className="text-xl font-semibold text-neutral-800">{title}</h2>
            {title === "Groups" && (
              <div
                onClick={() => setIsModalOpen(true)}
                className="rounded-full p-2 text-gray-600 cursor-pointer hover:opacity-75 transition tooltip tooltip-left mr-4"
                data-tip="Create Group"
              >
                <MdOutlineGroupAdd size={20} />
              </div>
            )}
          </div>
          <div className="flex flex-col mb-3">
            <SearchBar
              value={searchText}
              data={pathname === "/users" ? users : items}
              setSearchText={setSearchText}
              setSearchedData={setSearchedData}
              pathname={pathname}
            />
          </div>
        </div>
        <div
          className="px-2.5 overflow-y-auto scrollbar"
          style={{ maxHeight: "calc(100vh - 64px)" }}
        >
          {searchText && searchedData && searchedData.length === 0 && (
            <div className="pl-6 w-full justify-center">
              <h2>No Result</h2>
            </div>
          )}
          {!searchText && items && items.length === 0 && (
            <div className="pl-6 w-full justify-center">
              <h2>Create new chats</h2>
            </div>
          )}

          {pathname === "/users" ? (
            <>
              {searchText
                ? searchedData?.map((user) => (
                    <UserBox
                      key={user.id}
                      data={user as User}
                      currentUser={session?.email as string}
                    />
                  ))
                : users?.map((user) => (
                    <UserBox
                      key={user.id}
                      data={user}
                      currentUser={session?.email as string}
                    />
                  ))}
            </>
          ) : (
            <>
              {searchText
                ? searchedData?.map((item) => (
                    <ConversationBox
                      key={item.id}
                      data={item as FullConversationType}
                      selected={conversationId === item.id}
                      path={title === "Chats" ? "chats" : "group"}
                    />
                  ))
                : items?.map((item) => (
                    <ConversationBox
                      key={item.id}
                      data={item}
                      selected={conversationId === item.id}
                      path={title === "Chats" ? "chats" : "group"}
                    />
                  ))}
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
