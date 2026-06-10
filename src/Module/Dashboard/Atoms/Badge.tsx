import React from "react";

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  children,
}) => {
  return (
    <div className={`inline-flex items-center font-label-sm text-label-sm ${className}`}>
      {children}
    </div>
  );
};

export default Badge;
