import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Atoms/Icon";

interface BottomNavProps {
  activeRoute?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeRoute = "kanji" }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (path) {
      navigate(path);
    }
  };

  const navItems = [
    { key: "home", icon: "home", label: "Beranda", path: "/dashboard" },
    { key: "kanji", icon: "translate", label: "Kanji", path: "/kanji" },
    { key: "vocab", icon: "menu_book", label: "Vocab", path: "/vocabulary" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pb-safe pt-2 px-2 bg-surface border-t border-outline-variant shadow-lg md:hidden select-none">
      {navItems.map((item) => {
        const isActive = activeRoute === item.key;
        return isActive ? (
          <button
            key={item.key}
            onClick={() => handleNavigation(item.path)}
            className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-6 py-1 transition-transform active:scale-90 cursor-pointer border-none"
          >
            <Icon
              name={item.icon}
              className="text-2xl block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ) : (
          <button
            key={item.key}
            onClick={() => handleNavigation(item.path)}
            className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:text-primary transition-transform active:scale-90 cursor-pointer border-none bg-transparent"
          >
            <Icon name={item.icon} className="text-2xl block" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
