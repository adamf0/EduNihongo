import React from "react";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <span
      className={`font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight ${className}`}
    >
      NihongoZen
    </span>
  );
};

export default Logo;
