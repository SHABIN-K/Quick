import { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";

import useOpenStore from "@/store/useOpen";
import useConversation from "./useConversation";

//icons
import { GrChat } from "react-icons/gr";
import { HiOutlineLogout } from "react-icons/hi";
import { RiSettings5Line, RiUser2Line, RiGroupLine } from "react-icons/ri";

const useRoutes = () => {
  const { setIsOpen } = useOpenStore();
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const handleLogOut = useCallback(() => setIsOpen(true), [setIsOpen]);

  const routes = useMemo(
    () => [
      {
        label: "Chats",
        href: "/chats",
        icon: GrChat,
        active: pathname === "/chats" || !!conversationId,
        mobileOnly: false,
      },
      {
        label: "Groups",
        href: "/users",
        icon: RiGroupLine,
        active: pathname === "/users",
        mobileOnly: false,
      },
      {
        label: "Profile",
        href: "/profile",
        icon: RiUser2Line,
        active: pathname === "/profile",
        mobileOnly: false,
      },
      {
        label: "Settings",
        href: "/users",
        icon: RiSettings5Line,
        active: pathname === "/users",
        mobileOnly: true,
      },
      {
        label: "Logout",
        href: "#",
        onClick: handleLogOut,
        icon: HiOutlineLogout,
        mobileOnly: true,
      },
    ],
    [pathname, conversationId, handleLogOut]
  );

  return routes;
};

export default useRoutes;
