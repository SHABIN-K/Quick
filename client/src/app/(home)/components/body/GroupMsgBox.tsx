"use client";

import clsx from "clsx";
import { format } from "date-fns";

import Avatar from "@/components/Avatar";
import useAuthStore from "@/store/useAuth";
import { FullMessageType } from "@/shared/types";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const GroupMsgBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const { session } = useAuthStore();

  const isOwn = session?.email === data?.sender?.email;

  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  return (
    <div className={clsx("flex gap-3 p-4", isOwn && "justify-end")}>
      <div className={clsx(isOwn && "hidden")}>
        <Avatar user={data.sender} />
      </div>
      <div
        className={clsx(
          "flex flex-col w-full max-w-[320px] leading-1.5 p-2.5 border-gray-200",
          isOwn
            ? "rounded-s-2xl rounded-b-2xl bg-sky-100"
            : "rounded-e-2xl rounded-es-2xl bg-sky-200"
        )}
      >
        <div className={clsx("flex items-center", isOwn && "hidden")}>
          <span className="text-sm font-semibold text-gray-900">
            {data.sender.name}
          </span>
        </div>

        <p className="text-sm font-normal py-2.5 text-gray-900 ">{data.body}</p>
        <span className="text-xs text-gray-400">
          {format(new Date(data.createdAt), "p")}
        </span>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupMsgBox;
