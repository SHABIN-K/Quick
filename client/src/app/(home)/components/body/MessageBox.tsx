"use client";

import clsx from "clsx";
import { format } from "date-fns";
import { BiCheckDouble } from "react-icons/bi";

import useAuthStore from "@/store/useAuth";
import { FullMessageType } from "@/shared/types";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const { session } = useAuthStore();

  const isOwn = session?.email === data?.sender?.email;

  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  return (
    <div className={clsx("flex gap-3 p-4", isOwn && "justify-end")}>
      <div
        className={clsx(
          "flex flex-col max-w-[320px] leading-1.5 p-2.5 border-gray-200",
          isOwn
            ? "rounded-s-2xl rounded-b-2xl bg-sky-200"
            : "rounded-e-2xl rounded-es-2xl bg-sky-300"
        )}
      >
        <p className="text-sm font-normal text-gray-900 break-words select-text">
          {data.body}
        </p>
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </span>
          {isLast && isOwn && seenList.length > 0 && (
            <div className="text-xs font-light text-gray-500">
              <BiCheckDouble className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
