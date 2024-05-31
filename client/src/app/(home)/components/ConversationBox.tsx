"use client";

import clsx from "clsx";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import Avatar from "@/components/Avatar";
import useAuthStore from "@/store/useAuth";
import useOtherUser from "@/hooks/useOtherUser";
import AvatarGroup from "@/components/AvatarGroup";
import { FullConversationType } from "@/shared/types";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
  path?: string;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
  path,
}) => {
  const router = useRouter();
  const { session } = useAuthStore();
  const otherUser = useOtherUser(data);

  const handleClick = useCallback(() => {
    router.push(`/${path}/${data.id}`);
  }, [data.id, path, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session?.email;
  }, [session?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);
  return (
    <div
      onClick={handleClick}
      className={clsx(
        `w-full, relative flex items-center space-x-3 hover:bg-sky-100 rounded-lg transition cursor-pointer p-3`,
        selected ? "bg-sky-100" : ""
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-900">
              {data.name || otherUser?.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `truncate text-sm`,
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
