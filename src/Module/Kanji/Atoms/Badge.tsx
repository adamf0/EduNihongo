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
    <span className={`inline-block font-bold text-center ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
