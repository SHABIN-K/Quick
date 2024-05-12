"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import Avatar from "../Avatar";
import DisplayItem from "./DisplayItems";
import useAuthStore from "@/store/useAuth";
import SettingsModal from "./SettingsModal";
import useNavigation from "@/hooks/useNavigation";

const DesktopSidebar = () => {
  const { session } = useAuthStore();
  const routes = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {session && (
        <SettingsModal
          currentUser={session}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
        <nav className="mt-4 flex flex-col justify-between">
          <Link
            href="/chats"
            className="flex flex-col items-center justify-between"
          >
            <Image
              alt="Logo"
              height="48"
              width="48"
              src="/images/quick-logo.png"
            />
          </Link>
          <ul role="list" className="flex flex-col items-center mt-2 space-y-1">
            {routes.slice(0, 3).map((item) => (
              <DisplayItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
                mobileOnly={item.mobileOnly}
              />
            ))}
          </ul>
        </nav>
        <nav className="flex flex-col justify-between items-center">
          {routes.slice(3, 5).map((item) => (
            <DisplayItem
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={item.active}
              onClick={item.onClick}
              mobileOnly={item.mobileOnly}
            />
          ))}
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hover:opacity-75 transition ring-2 ring-sky-500 rounded-full p-1"
          >
            {session && <Avatar user={session} />}
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
