import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Icon from "../Icon";
import { useNavigate, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  showFAB?: boolean;
  fabOnClick?: () => void;
  fabLabel?: string;
  fabIcon?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showFAB = false,
  fabOnClick,
  fabLabel = "Latih Goresan",
  fabIcon = "edit_square",
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const mobileBottomNavItems = [
    { icon: "home", label: "Beranda", route: "/dashboard" },
    { icon: "menu_book", label: "Kanji", route: "/module" },
    { icon: "school", label: "Belajar", route: "/latihan" },
    { icon: "analytics", label: "Stat", route: "/progress" },
    { icon: "person", label: "Profil", route: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col overflow-x-hidden">
      {/* Sidebar Navigation (Desktop and Mobile Drawer) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Layout area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen pb-24 lg:pb-0">
        {/* Top Header / Navigation Bar */}
        <header className="sticky top-0 z-40 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md flex justify-between items-center w-full px-4 md:px-6 py-1 max-w-[1200px] mx-auto border-b border-outline-variant/10">
          <div className="flex items-center gap-md flex-1">
            {/* Hamburger menu trigger for mobile drawer */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors"
              aria-label="Open menu"
            >
              <Icon name="menu" className="block text-2xl" />
            </button>
            <span 
              onClick={() => navigate("/dashboard")} 
              className="font-headline-md text-headline-md font-black text-primary lg:hidden cursor-pointer tracking-tight"
            >
              KANJIGRAPH
            </span>
            
            {/* Search Input Bar (Desktop/Tablet Only) */}
            <div className="relative w-full max-w-md hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-body-md transition-all outline-none"
                placeholder="Cari Kanji atau Jukugo..."
                type="text"
              />
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-md">
            <button className="relative p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all cursor-pointer">
              <Icon name="notifications" className="block text-2xl" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <button 
              onClick={() => navigate("/profile")}
              className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all cursor-pointer"
            >
              <Icon name="settings" className="block text-2xl" />
            </button>
            <img
              onClick={() => navigate("/profile")}
              alt="Avatar Pengguna"
              className="w-8 h-8 rounded-full lg:hidden border-2 border-primary/10 cursor-pointer object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWQF9F4vGMPAveFwMVwKQx2D3civyQVdPz99A6OgbFjuFGIkmYreQ9eZq8NtpiJDILQQIpYXhPuJT1GNyYyTnj7gUm8hjjDcNY52DwpoUww-jai8UAXz-ffYN2dCTfkfsHwqlB2C-0KlEEjA6v27K0SFfNOoX4NR6Q5H3JAtKbwDBxh0-H2CbiuD70I_nTlX9jgZr8oFg67Xet3NrYYIibEXxoY7aCtTd7btVH2xsDD5-fL9UB129xSn3OCFXI8_1VRZONSf22XRk"
            />
          </div>
        </header>

        {/* Main Page Content */}
        {children}
        
        {/* Desktop and Mobile Footer */}
        <footer className="w-full bg-surface-container-lowest py-lg px-md flex flex-col md:flex-row justify-between items-center gap-md border-t border-outline-variant/10 mt-auto">
          <div>
            <p className="font-headline-md font-bold text-on-surface">KANJIGRAPH</p>
            <p className="text-body-md text-on-surface-variant">© 2024 Kanjigraph. Dibuat untuk penguasaan.</p>
          </div>
          <div className="flex gap-md">
            <span onClick={() => navigate("/")} className="text-label-md text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all cursor-pointer">Tentang Kami</span>
            <span onClick={() => navigate("/module")} className="text-label-md text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all cursor-pointer">Dokumentasi</span>
            <span onClick={() => navigate("/")} className="text-label-md text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all cursor-pointer">Kebijakan Privasi</span>
          </div>
        </footer>
      </div>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-4 pt-2 bg-surface dark:bg-surface-dim border-t border-outline-variant/20 z-50 lg:hidden shadow-lg rounded-t-xl">
        {mobileBottomNavItems.map((item) => {
          const isActive = currentPath === item.route;
          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center justify-center px-4 py-1 active:scale-95 transition-all rounded-full cursor-pointer ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <Icon
                name={item.icon}
                className="text-2xl block"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              />
              <span className="text-caption">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Floating Action Button (FAB) */}
      {showFAB && fabOnClick && (
        <button
          onClick={fabOnClick}
          className="fixed bottom-24 right-6 lg:bottom-12 lg:right-12 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-40 group cursor-pointer torii-button-shadow"
        >
          <Icon name={fabIcon} className="text-2xl" />
          <span className="absolute right-full mr-4 px-3 py-1 bg-on-surface text-surface text-caption rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {fabLabel}
          </span>
        </button>
      )}
    </div>
  );
};

export default Layout;
