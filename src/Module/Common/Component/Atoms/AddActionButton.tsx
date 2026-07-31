import React from "react";
import Icon from "../Icon";

interface AddActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  iconName?: string;
  variant?: "primary" | "indigo" | "maroon";
  size?: "sm" | "md";
}

export const AddActionButton: React.FC<AddActionButtonProps> = React.memo(
  ({
    label,
    iconName = "add",
    variant = "primary",
    size = "md",
    className = "",
    ...props
  }) => {
    let colorClasses = "bg-primary text-on-primary hover:brightness-110";
    if (variant === "indigo") {
      colorClasses = "bg-indigo-600 hover:bg-indigo-500 text-white";
    } else if (variant === "maroon") {
      colorClasses = "bg-[#8f0020] text-white hover:brightness-110";
    }

    let sizeClasses = "px-5 py-2.5 text-sm gap-2";
    if (size === "sm") {
      sizeClasses = "px-4 py-2 text-xs gap-1.5 rounded-xl";
    } else {
      sizeClasses = "px-5 py-2.5 text-sm gap-2 rounded-lg";
    }

    return (
      <button
        type="button"
        className={`font-bold shadow-md cursor-pointer active:scale-95 transition-all border-none flex items-center whitespace-nowrap ${colorClasses} ${sizeClasses} ${className}`}
        {...props}
      >
        <Icon name={iconName} className={size === "sm" ? "text-base" : "text-lg"} />
        <span>{label}</span>
      </button>
    );
  }
);
AddActionButton.displayName = "AddActionButton";
