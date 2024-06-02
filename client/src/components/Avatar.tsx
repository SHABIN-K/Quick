"use client";

import Image from "next/image";

import { User, UserType } from "@/shared/types";
import useActiveListStore from "../store/useActiveList";

interface AvatarProps {
  user?: User | UserType;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const { members } = useActiveListStore();
  const isActive = members.indexOf(user?.email!) !== -1;

  return (
    <div className="relative">
      <div className="relative rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
        <Image
          alt="Avatar"
          src={user?.profile || "/images/placeholder.jpg"}
          fill
        />
      </div>
      {isActive && (
        <span className="absolute flex h-2 w-2 md:h-3 md:w-3 top-0 right-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-green-500"></span>
        </span>
      )}
    </div>
  );
};

export default Avatar;
