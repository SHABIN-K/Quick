"use client";

import DisplayItem from "./DisplayItems";
import useNavigation from "@/hooks/useNavigation";
import useConversation from "@/hooks/useConversation";

const MobileFooter = () => {
  const routes = useNavigation();
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
    </div>
  );
};

export default MobileFooter;
