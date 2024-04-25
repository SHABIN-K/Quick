"use client";

import { useState } from "react";

import Avatar from "../Avatar";
import DesktopItem from "./DesktopItem";
import SettingsModal from "./SettingsModal";
import useNavigation from "@/hooks/useNavigation";

const DesktopSidebar = () => {
  const routes = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const userData = localStorage.getItem("user.profile");
  const currentUser = JSON.parse(userData as string);
  console.log(currentUser);

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
        <nav className="mt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col justify-between items-center">
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hover:opacity-75 transition"
          >
            {/* <Avatar user={currentUser} />*/}
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
