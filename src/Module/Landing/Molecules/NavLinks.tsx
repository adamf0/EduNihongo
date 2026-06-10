import React from "react";

export const NavLinks: React.FC = () => {
  return (
    <nav className="hidden md:flex items-center gap-6">
      <a
        className="text-primary font-bold font-label-sm text-label-sm"
        href="#"
      >
        Home
      </a>
      <a
        className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm"
        href="#features"
      >
        Fitur
      </a>
      <a
        className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm"
        href="#goals"
      >
        Tujuan
      </a>
    </nav>
  );
};

export default NavLinks;
