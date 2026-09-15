import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Icon from "../Icon";
import MusubiLogo from "../MusubiLogo";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../Utility/api";

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
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.profile.get();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load layout profile:", err);
      }
    };
    if (api.auth.isAuthenticated()) {
      fetchProfile();
    }
  }, [currentPath]);

  const role = profile?.role || api.auth.getRole();

  const adminBottomNavItems = [
    { icon: "dashboard", label: "Dashboard", route: "/dashboard" },
    { icon: "layers", label: "Modul", route: "/admin" },
    { icon: "draw", label: "Kanji", route: "/admin/kanji" },
    { icon: "menu_book", label: "Jukugo", route: "/admin/jukugo" },
    { icon: "category", label: "Kategori", route: "/admin/categories" },
  ];

  const userBottomNavItems = [
    { icon: "home", label: "Beranda", route: "/dashboard" },
    { icon: "menu_book", label: "Kanji", route: "/module" },
    { icon: "school", label: "Belajar", route: "/latihan" },
    { icon: "analytics", label: "Stat", route: "/progress" },
    { icon: "person", label: "Profil", route: "/profile" },
  ];

  const mobileBottomNavItems = role === "ADMIN" ? adminBottomNavItems : userBottomNavItems;

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col overflow-x-hidden">
      {/* Sidebar Navigation (Desktop Only) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Layout area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen pb-24 lg:pb-0">
        {/* Top Header / Navigation Bar */}
        <header className="sticky top-0 z-40 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md flex justify-between items-center w-full px-4 md:px-6 py-2 max-w-[1200px] mx-auto border-b border-outline-variant/10">
          <div className="flex items-center gap-md flex-1">
            {/* Mobile Brand Logo */}
            <div
              onClick={() => navigate("/dashboard")}
              className="lg:hidden cursor-pointer transition-transform hover:scale-105"
            >
              <MusubiLogo mode="standalone" size={32} showText={true} />
            </div>
            
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
              src={profile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150"}
            />
          </div>
        </header>

        {/* Main Page Content */}
        {children}
        
        {/* Desktop and Mobile Footer */}
        <footer className="w-full bg-surface-container-lowest py-lg px-md flex flex-col md:flex-row justify-between items-center gap-md border-t border-outline-variant/10 mt-auto">
          <div>
            <p className="font-headline-md font-bold text-on-surface">KanGraph</p>
            <p className="text-body-md text-on-surface-variant">© 2024 KanGraph. Connect the Dots of Japanese Mastery.</p>
          </div>
          <div className="flex flex-wrap gap-md">
            <span onClick={() => navigate("/about")} className="text-label-md text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all cursor-pointer">Tentang Kami</span>
            <span onClick={() => navigate("/module")} className="text-label-md text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all cursor-pointer">Dokumentasi</span>
            <span onClick={() => navigate("/")} className="text-label-md text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all cursor-pointer">Kebijakan Privasi</span>
          </div>
        </footer>
      </div>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-1 sm:px-3 pb-3 pt-1.5 bg-surface dark:bg-surface-dim border-t border-outline-variant/20 z-50 lg:hidden shadow-lg rounded-t-2xl">
        {mobileBottomNavItems.map((item) => {
          const isActive =
            currentPath === item.route ||
            (item.route === "/admin" && currentPath === "/admin") ||
            (item.route === "/admin/kanji" && (currentPath.startsWith("/admin/kanji") || currentPath.startsWith("/admin/kanji-form"))) ||
            (item.route === "/admin/jukugo" && currentPath.startsWith("/admin/jukugo")) ||
            (item.route === "/admin/categories" && currentPath.startsWith("/admin/categories"));

          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center justify-center px-1 sm:px-2.5 py-1 active:scale-95 transition-all rounded-xl cursor-pointer min-w-0 flex-1 ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <Icon
                name={item.icon}
                className="text-xl sm:text-2xl block"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              />
              <span className="text-[10px] leading-tight tracking-tight truncate max-w-[56px] sm:max-w-none text-center">
                {item.label}
              </span>
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
