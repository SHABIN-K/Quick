"use client";

import Link from "next/link";
import { Fragment } from "react";
import { Menu } from "@headlessui/react";
import { CgProfile } from "react-icons/cg";

import Avatar from "../Avatar";
import DisplayItem from "./DisplayItems";
import useAuthStore from "@/store/useAuth";
import useNavigation from "@/hooks/useNavigation";
import useConversation from "@/hooks/useConversation";

const MobileFooter = () => {
  const routes = useNavigation();
  const { session } = useAuthStore();
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }

  return (
    <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden px-5 ">
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
      <Menu>
        <Menu.Button>
          <div className="relative cursor-pointer hover:opacity-75 transition ring-2 ring-sky-500 rounded-full mt-2">
            {session && <Avatar user={session} />}
          </div>
        </Menu.Button>
        <Menu.Items className="absolute right-2 bottom-[60px] w-48 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/profile"
                  className={`${
                    active
                      ? "bg-sky-50 text-sky-500"
                      : "text-gray-500 hover:text-sky-500 hover:bg-sky-50"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <CgProfile className="mr-2 h-5 w-5" />
                  <span>Profile</span>
                </Link>
              )}
            </Menu.Item>
            {routes.slice(3, 5).map((item) => (
              <Menu.Item key={item.label} as={Fragment}>
                {({ active }) => (
                  <Link
                    href={item.href || ""}
                    onClick={item.onClick}
                    className={`${
                      active
                        ? "bg-sky-50 text-sky-500"
                        : "text-gray-500 hover:text-sky-500 hover:bg-sky-50"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default MobileFooter;
