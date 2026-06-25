import React from "react";
import Icon from "./Icon";
import SidebarLink from "./SidebarLink";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose = () => {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarClasses = `fixed top-0 bottom-0 w-64 bg-surface dark:bg-surface-dim border-r border-outline-variant/30 z-50 flex flex-col transition-all duration-300 ${
    isOpen ? "left-0" : "-left-64 lg:left-0"
  } lg:flex`;

  const menus = [
    { icon: "dashboard", label: "Dashboard", route: "/dashboard" },
    { icon: "layers", label: "Module", route: "/module" },
    { icon: "trending_up", label: "Progress Belajar", route: "/progress" },
    { icon: "person", label: "Profile", route: "/profile" },
  ];

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
        <div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-md">
              <Icon name="star_shine" className="text-white block text-2xl" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary tracking-tight leading-tight">KANJIGRAPH</h1>
              <p className="text-[9px] text-on-surface-variant tracking-[0.15em] uppercase">Master the Stroke</p>
            </div>
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
          {menus.map((item) => (
            <SidebarLink
              key={item.route}
              icon={item.icon}
              label={item.label}
              isActive={currentPath === item.route}
              onClick={() => {
                navigate(item.route);
                onClose();
              }}
            />
          ))}
        </nav>

        {/* User Profile Footer (matching design guidelines) */}
        <div className="p-4 border-t border-outline-variant/10 flex items-center gap-3 bg-surface-container-low/50">
          <img
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border border-outline-variant/30"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWQF9F4vGMPAveFwMVwKQx2D3civyQVdPz99A6OgbFjuFGIkmYreQ9eZq8NtpiJDILQQIpYXhPuJT1GNyYyTnj7gUm8hjjDcNY52DwpoUww-jai8UAXz-ffYN2dCTfkfsHwqlB2C-0KlEEjA6v27K0SFfNOoX4NR6Q5H3JAtKbwDBxh0-H2CbiuD70I_nTlX9jgZr8oFg67Xet3NrYYIibEXxoY7aCtTd7btVH2xsDD5-fL9UB129xSn3OCFXI8_1VRZONSf22XRk"
          />
          <div>
            <p className="font-bold text-sm text-on-surface leading-tight">Haruki Sato</p>
            <p className="text-[10px] text-on-surface-variant">Master Tingkat N3</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
