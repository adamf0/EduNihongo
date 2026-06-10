import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Atoms/Icon";

interface BottomNavProps {
  activeRoute?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeRoute = "home",
}) => {
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    if (path) {
      navigate(path);
    }
  };

  const navItems = [
    { key: "home", icon: "home", label: "Home", path: "/dashboard" },
    { key: "kanji", icon: "translate", label: "Kanji", path: "/kanji" },
    { key: "vocab", icon: "menu_book", label: "Vocab", path: "/vocabulary" },
  ];

  return (
    <nav className="sticky bottom-0 left-0 w-full z-50 flex justify-around items-center pb-safe pt-2 px-2 bg-surface shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl border-t border-outline-variant lg:hidden select-none">
      {navItems.map((item) => {
        const isActive = activeRoute === item.key;
        return (
          <button
            key={item.key}
            onClick={() => handleNavigation(item.path)}
            className={`flex flex-col items-center justify-center px-4 py-2 cursor-pointer border-none bg-transparent ${
              isActive ? "text-primary font-bold" : "text-on-surface-variant font-normal"
            }`}
          >
            <Icon
              name={item.icon}
              className="text-2xl block"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
