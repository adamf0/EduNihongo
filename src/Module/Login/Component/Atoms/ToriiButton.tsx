import React from "react";

interface ToriiButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export const ToriiButton: React.FC<ToriiButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 bg-primary text-white font-bold rounded-xl transition-all torii-button active:translate-y-[2px] active:shadow-none shadow-md cursor-pointer select-none text-headline-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export default ToriiButton;
