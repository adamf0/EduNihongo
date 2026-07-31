import React from "react";

interface CancelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  size?: "sm" | "md";
}

export const CancelButton: React.FC<CancelButtonProps> = React.memo(
  ({ label = "Batal", size = "md", className = "", ...props }) => {
    const sizeClasses =
      size === "sm" ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm";
    return (
      <button
        type="button"
        className={`rounded-lg border border-outline hover:bg-surface-container transition-all cursor-pointer font-bold text-on-surface bg-transparent active:scale-95 whitespace-nowrap ${sizeClasses} ${className}`}
        {...props}
      >
        {label}
      </button>
    );
  }
);
CancelButton.displayName = "CancelButton";
