import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`cursor-pointer active:scale-[0.98] transition-all focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
