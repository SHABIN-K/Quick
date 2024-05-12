import { useMemo } from "react";
import { HiChat } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";

import useLogout from "./useLogout";
import useConversation from "./useConversation";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/chats",
        icon: HiChat,
        active: pathname === "/chats" || !!conversationId,
      },
      {
        label: "Users",
        href: "/users",
        icon: HiUsers,
        active: pathname === "/users",
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
