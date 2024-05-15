import { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";

import useOpenStore from "@/store/useOpen";

//icons
import { GrChat } from "react-icons/gr";
import { FaUsers } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { RiSettings5Line, RiGroupLine } from "react-icons/ri";

const useRoutes = () => {
  const pathname = usePathname();
  const { setIsLogout, setIsSettings } = useOpenStore();

  const handleLogOut = useCallback(() => setIsLogout(true), [setIsLogout]);
  const handleSettings = useCallback(
    () => setIsSettings(true),
    [setIsSettings]
  );

  const routes = useMemo(
    () => [
      {
        label: "Chats",
        href: "/chats",
        icon: GrChat,
        active: pathname.startsWith("/chats"),
        mobileOnly: false,
      },
      {
        label: "Groups",
        href: "/group",
        icon: RiGroupLine,
        active: pathname.startsWith("/group"),
        mobileOnly: false,
      },
      {
        label: "Global",
        href: "/users",
        icon: FaUsers,
        active: pathname === "/users",
        mobileOnly: false,
      },
      {
        label: "Settings",
        onClick: handleSettings,
        icon: RiSettings5Line,
        active: false,
        mobileOnly: true,
      },
      {
        label: "Logout",
        onClick: handleLogOut,
        icon: HiOutlineLogout,
        active: false,
        mobileOnly: true,
      },
    ],
    [pathname, handleSettings, handleLogOut]
  );

  return routes;
};

export default useRoutes;
