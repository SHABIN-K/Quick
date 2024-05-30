"use client";

import { FC } from "react";
import Image from "next/image";
import { AiOutlineMail } from "react-icons/ai";
import { MdAlternateEmail } from "react-icons/md";
import { RiAccountPinCircleLine } from "react-icons/ri";

import useAuthStore from "@/store/useAuth";
import useActiveListStore from "@/store/useActiveList";

interface ProfileItemProps {
  icon: JSX.Element;
  label: string;
  value?: string;
}

const ProfileItem: FC<ProfileItemProps> = ({ icon, label, value }) => (
  <div className="flex flex-row justify-between hover:bg-sky-50 rounded-lg p-3 items-center text-gray-500 hover:text-sky-500">
    <div className="flex space-x-2 items-center">
      {icon}
      <span>{label}</span>
    </div>
    <span>{value}</span>
  </div>
);

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useAuthStore();
  const { members } = useActiveListStore();
  const isActive = members.indexOf(session?.email!) !== -1;

  return (
    <div className="h-full">
      <aside className="fixed top-0 inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-hidden bg-white border-r shadow block w-full left-0">
        <div className="px-2.5">
          <div className="flex flex-col justify-between mb-4 pt-4 mt-2">
            <div className="text-lg sm:text-xl font-semibold text-neutral-800">
              Profile
            </div>
            <div className="flex flex-col justify-center items-center mt-20 sm:mt-14">
              <div className="relative transition ring-2 ring-sky-500 rounded-full h-32 sm:h-24 w-32 sm:w-24 overflow-hidden">
                <Image
                  alt="Avatar"
                  src={session?.profile || "/images/placeholder.jpg"}
                  fill
                />
              </div>
              <p className="text-lg sm:text-xl font-semibold text-neutral-800 mt-5">
                {session?.name}
              </p>
              <p className="text-sm font-normal italic text-gray-500">
                {isActive ? "online" : "offline"}
              </p>
            </div>
            <div className="flex flex-col border-t-2 mt-5 w-full">
              <div className="mt-2 flex flex-col">
                <ProfileItem
                  icon={<RiAccountPinCircleLine className="w-6 h-6" />}
                  label="Name"
                  value={session?.name}
                />
                <ProfileItem
                  icon={<AiOutlineMail className="w-6 h-6" />}
                  label="Email"
                  value={session?.email}
                />
                <ProfileItem
                  icon={<MdAlternateEmail className="w-6 h-6" />}
                  label="Username"
                  value={`@${session?.username}`}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
      {children}
    </div>
  );
}
