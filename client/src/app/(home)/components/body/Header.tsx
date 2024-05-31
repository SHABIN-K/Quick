"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IoVideocamOutline } from "react-icons/io5";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";

import Avatar from "@/components/Avatar";
import useOpenStore from "@/store/useOpen";
import VideoCall from "../modal/VideoCall";
import ProfileDrawer from "./ProfileDrawer";
import useOtherUser from "@/hooks/useOtherUser";
import AvatarGroup from "@/components/AvatarGroup";
import { User, Conversation } from "@/shared/types";
import useActiveListStore from "@/store/useActiveList";

interface HeaderProps {
  conversation: Conversation & { users: User[] };
  chatType: string;
}

const Header: React.FC<HeaderProps> = ({ conversation, chatType }) => {
  const otherUser = useOtherUser(conversation);
  const { setIsVideoCall } = useOpenStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveListStore();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? "Active" : "Offline";
  }, [conversation, isActive]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <VideoCall data={conversation} />
      <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-4 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <Link
            href={chatType === "chats" ? "/chats" : "/group"}
            className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className="flex flex-col">
            <span>{conversation.name || otherUser?.name}</span>
            <span className="text-sm font-light text-neutral-500">
              {statusText}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-x-3 flex-row-reverse">
          <HiEllipsisHorizontal
            size={32}
            onClick={() => setDrawerOpen(true)}
            className="text-gray-500 cursor-pointer hover:text-sky-600 transition"
          />
          {chatType === "chats" && (
            <IoVideocamOutline
              onClick={() => setIsVideoCall(true)}
              className="w-7 h-6 text-gray-500 cursor-pointer hover:text-sky-600 transition"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
