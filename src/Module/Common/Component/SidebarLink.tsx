import React from "react";
import Icon from "./Icon";

interface SidebarLinkProps {
  icon: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
}) => {
  const baseClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left cursor-pointer";

  const activeClass =
    "text-primary font-bold border-r-4 border-primary bg-primary-container/10 scale-[0.98]";

  const inactiveClass =
    "text-on-surface-variant hover:text-primary hover:bg-surface-container-highest";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClass} ${
        isActive ? activeClass : inactiveClass
      }`}
    >
      <Icon
        name={icon}
        className="text-2xl block"
        style={
          isActive
            ? {
                fontVariationSettings:
                  "'FILL' 1",
              }
            : undefined
        }
      />

      <span className="font-label-md">
        {label}
      </span>
    </button>
  );
};

export default SidebarLink;