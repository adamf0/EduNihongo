import React from "react";
import Icon from "../Icon";

interface CancelAndReturnButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  iconName?: string;
  size?: "sm" | "md";
}

export const CancelAndReturnButton: React.FC<CancelAndReturnButtonProps> = React.memo(
  ({
    label = "Batal & Kembali",
    iconName = "close",
    size = "sm",
    className = "",
    ...props
  }) => {
    const sizeClasses =
      size === "sm" ? "px-4 py-2 text-sm gap-1.5" : "px-5 py-2.5 text-sm gap-2";
    return (
      <button
        type="button"
        className={`border border-outline hover:bg-surface-container transition-all cursor-pointer font-bold text-on-surface bg-transparent rounded-lg flex items-center whitespace-nowrap active:scale-95 ${sizeClasses} ${className}`}
        {...props}
      >
        <Icon name={iconName} className="text-lg" />
        <span>{label}</span>
      </button>
    );
  }
);
CancelAndReturnButton.displayName = "CancelAndReturnButton";
