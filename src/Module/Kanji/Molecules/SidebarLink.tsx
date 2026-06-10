import React from "react";
import Icon from "../Atoms/Icon";

interface SidebarLinkProps {
  icon: string;
  label: string;
  isActive?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon,
  label,
  isActive = false,
  href = "#",
  onClick,
}) => {
  const baseClass = "flex items-center gap-4 px-4 py-3 rounded-lg transition-all";
  const activeClass = "sidebar-item-active";
  const inactiveClass = "text-on-surface-variant hover:bg-surface-container transition-colors";

  return (
    <a
      href={href}
      onClick={onClick}
      className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
    >
      <Icon
        name={icon}
        className="text-2xl block"
        style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
      />
      <span className="font-semibold hidden lg:block">{label}</span>
    </a>
  );
};

export default SidebarLink;
