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
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left";

  const activeClass =
    "text-on-primary bg-secondary-fixed shadow-md";

  const inactiveClass =
    "text-on-surface-variant hover:bg-surface-container transition-colors";

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

      <span className="font-medium">
        {label}
      </span>
    </button>
  );
};

export default SidebarLink;