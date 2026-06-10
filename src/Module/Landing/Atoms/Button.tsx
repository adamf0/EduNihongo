import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "text" | "custom";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  let baseStyles = "cursor-pointer active:scale-95 duration-200 transition-all";
  
  if (variant === "primary") {
    baseStyles += " bg-primary text-on-primary hover:bg-primary/90";
  } else if (variant === "secondary") {
    baseStyles += " bg-secondary text-on-secondary hover:shadow-2xl hover:shadow-secondary/20";
  } else if (variant === "outline") {
    baseStyles += " border-2 border-primary/20 text-primary hover:bg-white hover:border-primary";
  }

  return (
    <button
      className={`${baseStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
