import React from "react";
import Icon from "./Icon";

interface BadgeProps {
  icon?: string;
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  icon,
  className = "",
  children,
}) => {
  return (
    <div className={`inline-flex items-center gap-2 font-label-sm text-label-sm ${className}`}>
      {icon && <Icon name={icon} className="text-[16px]" />}
      {children}
    </div>
  );
};

export default Badge;
