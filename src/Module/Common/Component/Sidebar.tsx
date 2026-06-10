import React from "react";
import Icon from "./Icon";
import SidebarLink from "./SidebarLink";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeRoute?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose = () => {},
  activeRoute = "home",
}) => {
  const navigate = useNavigate();

  const sidebarClasses = `fixed top-0 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant z-50 flex flex-col transition-all duration-300 ${
    isOpen ? "left-0" : "-left-64 lg:left-0"
  } lg:flex`;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary/20 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        ></div>
      )}

      <aside className={sidebarClasses}>
        {/* Logo block */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center border border-outline-variant">
              <Icon name="potted_plant" className="text-primary block text-2xl" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight text-on-surface select-none">NihongoZen</span>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer focus:outline-none border-none"
            aria-label="Close menu"
          >
            <Icon name="close" className="block text-2xl" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-grow px-4 py-4 space-y-1 sidebar-scroll overflow-y-auto">
          <SidebarLink icon="home" label="Home" isActive={activeRoute === "home"} onClick={()=>navigate("/dashboard")} />
          <SidebarLink icon="translate" label="Kanji" isActive={activeRoute === "kanji"} onClick={()=>navigate("/kanji")} />
          <SidebarLink icon="menu_book" label="Vocab" isActive={activeRoute === "vocab"} onClick={()=>navigate("/vocabulary")} />
        </nav>

        {/* Footer options */}
        {/* <div className="p-4 border-t border-outline-variant">
          <SidebarLink icon="settings" label="Pengaturan" isActive={activeRoute === "settings"} href="#" />
        </div> */}
      </aside>
    </>
  );
};

export default Sidebar;
