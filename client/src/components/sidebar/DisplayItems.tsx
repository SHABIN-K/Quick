"use client";

import clsx from "clsx";
import Link from "next/link";

interface DisplayItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
  mobileOnly?: boolean;
}

const DisplayItem: React.FC<DisplayItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
  mobileOnly,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        `group flex p-4 text-sm leading-6 font-semibold text-gray-500 hover:text-sky-500 hover:bg-sky-50 rounded-lg`,
        active && "bg-sky-50 text-sky-500",
        mobileOnly ? "w-full justify-center" : "tooltip tooltip-bottom"
      )}
      data-tip={label}
    >
      <Icon className="h-6 w-6 shrink-0" />
      <span className="sr-only">{label}</span>
    </Link>
  );
};

export default DisplayItem;
