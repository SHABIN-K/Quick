import { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";

import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";

import useConversation from "./useConversation";
import useLogout from "./useLogout";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/conversations",
        icon: HiChat,
        active: pathname === "/conversations" || !!conversationId,
      },
      {
        label: "Users",
        href: "/chats",
        icon: HiUsers,
        active: pathname === "/chats",
      },
      {
        label: "Logout",
        href: "#",
        onClick: useLogout,
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useRoutes;
