import React from "react";

interface ToriiButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const ToriiButton: React.FC<ToriiButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-4 bg-primary text-white font-bold rounded-xl transition-all torii-button active:translate-y-[2px] active:shadow-none shadow-md cursor-pointer select-none text-headline-md ${className}`}
    >
      {children}
    </button>
  );
};

export default ToriiButton;
