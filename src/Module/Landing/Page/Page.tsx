import React, { useEffect, useState } from "react";
import HeroSection from "../Component/Organism/HeroSection";
import FeatureSection from "../Component/Organism/FeatureSection";
import MusubiLogo from "../../Common/Component/MusubiLogo";
import { useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  Layers,
  Edit3,
  BarChart2,
  HelpCircle,
  Network,
  Lightbulb,
  Settings,
  TrendingUp,
  Heart,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Beranda", icon: <Home className="w-4 h-4" />, path: "/" },
    { label: "Modul", icon: <BookOpen className="w-4 h-4" />, path: "/module" },
    { label: "Kanji", icon: <span className="font-serif font-black text-sm">漢</span>, path: "/kanji" },
    { label: "Jukugo", icon: <Layers className="w-4 h-4" />, path: "/jukugo" },
    { label: "Latihan", icon: <Edit3 className="w-4 h-4" />, path: "/latihan" },
    { label: "Evaluasi", icon: <BarChart2 className="w-4 h-4" />, path: "/progress" },
    { label: "Tentang", icon: <HelpCircle className="w-4 h-4" />, path: "/about" },
  ];

  const valueProps = [
    {
      icon: <Network className="w-6 h-6 text-[#0D47A1]" />,
      title: "Visual & Sistematis",
      desc: "Memahami makna melalui jaringan semantik",
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-[#0D47A1]" />,
      title: "Kontekstual",
      desc: "Jukugo dalam kehidupan nyata",
    },
    {
      icon: <Settings className="w-6 h-6 text-[#0D47A1]" />,
      title: "Interaktif",
      desc: "Latihan dan umpan balik langsung",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#0D47A1]" />,
      title: "Terukur",
      desc: "Pantau progress belajar",
    },
    {
      icon: <Heart className="w-6 h-6 text-[#EC6C9A]" />,
      title: "Menyenangkan",
      desc: "Belajar kanji jadi lebih bermakna",
    },
  ];

  return (
    <div className="bg-white font-sans text-slate-800 min-h-screen overflow-x-hidden flex flex-col">
      {/* Top Header Navbar */}
      <header
        className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 transition-all duration-300 ${
          hasScrolled ? "shadow-md py-2" : "py-3"
        }`}
      >
        <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-[1200px] mx-auto">
          {/* Logo block */}
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => navigate("/")}
          >
            <MusubiLogo showText showSubtitle size={36} textColor="text-[#0D47A1]" />
          </div>

          {/* Navigation Links with Icons Above Text */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                  idx === 0
                    ? "text-[#EC6C9A]"
                    : "text-slate-600 hover:text-[#0D47A1]"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Features & Modules Section */}
        <FeatureSection />

        {/* Value Proposition Highlights Footer Bar */}
        <section className="bg-[#e3f2fd]/30 border-t border-b border-slate-100 py-10">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {valueProps.map((vp, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-white/70 border border-slate-100/80 shadow-xs"
                >
                  <div className="shrink-0 p-2 rounded-xl bg-white shadow-xs">
                    {vp.icon}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-800 leading-snug">
                      {vp.title}
                    </h5>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-snug">
                      {vp.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inspirational Quote Block */}
        <section className="py-12 bg-white text-center">
          <div className="max-w-2xl mx-auto px-4 space-y-3">
            <p className="text-lg md:text-xl font-medium text-slate-700 italic leading-relaxed">
              "Belajar kanji bukan hanya mengingat, tetapi menghubungkan makna."
            </p>
            <p className="font-extrabold text-sm text-[#0D47A1] tracking-wider uppercase">
              — KanGraph
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 border-t border-slate-800">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider">KanGraph</span>
            <span>|</span>
            <span>Connect the Meaning, Expand Your World</span>
          </div>
          <p>© 2024 KanGraph. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
