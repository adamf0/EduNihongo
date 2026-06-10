import React, { useState, useEffect } from "react";
import Logo from "../Atoms/Logo";
import NavLinks from "../Molecules/NavLinks";
import StreakStatus from "../Molecules/StreakStatus";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerClass = isScrolled
    ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-outline-variant/30"
    : "bg-surface-container-lowest shadow-sm border-b border-outline-variant/30";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 transition-all duration-300 ${headerClass}`}
    >
      <div className="flex items-center gap-8">
        <Logo />
        <NavLinks />
      </div>
      <div className="flex items-center gap-4">
        <StreakStatus />
      </div>
    </header>
  );
};

export default Header;
