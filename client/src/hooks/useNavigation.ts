import { useMemo } from "react";
import { usePathname } from "next/navigation";

import useLogout from "./useLogout";
import useConversation from "./useConversation";
import { GrChat } from "react-icons/gr";
import { HiOutlineLogout } from "react-icons/hi";
import { RiSettings5Line, RiUser2Line, RiGroupLine } from "react-icons/ri";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

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
        href: "/users",
        icon: RiUser2Line,
        active: pathname === "/users",
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
        onClick: useLogout,
        icon: HiOutlineLogout,
        mobileOnly: true,
      },
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useRoutes;
