"use client";

import clsx from "clsx";
import { format } from "date-fns";

import Avatar from "@/components/Avatar";
import { FullMessageType } from "@/shared/types";
import { useSession } from "@/context/AuthContext";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const { getSession } = useSession();

  const isOwn = getSession?.email === data?.sender?.email;
  
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  return (
    <div className={clsx("flex gap-3 p-4", isOwn && "justify-end")}>
      <div className={clsx(isOwn && "order-2")}>
        <Avatar user={data.sender} />
      </div>
      <div className={clsx("flex flex-col gap-2", isOwn && "items-end")}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div
          className={clsx(
            "text-sm w-fit overflow-hidden",
            isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
            data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
          )}
        >
          <div>{data.body}</div>
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
