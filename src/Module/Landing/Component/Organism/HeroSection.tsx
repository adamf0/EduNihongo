import React from "react";
import Icon from "../../../Common/Component/Icon";
import { useNavigate } from "react-router-dom";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: "menu_book", value: "2000+", label: "Kanji Utama", color: "text-primary" },
    { icon: "translate", value: "5000+", label: "Kosakata Jukugo", color: "text-secondary" },
    { icon: "verified_user", value: "JLPT N5-N1", label: "Materi Lengkap", color: "text-tertiary" },
    { icon: "mood", value: "98%", label: "Tingkat Kelulusan", color: "text-primary" },
  ];

  return (
    <div className="relative overflow-hidden pt-12 pb-24">
      {/* Background radial gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10"></div>

      <section className="max-w-[1200px] mx-auto px-4 md:px-12 py-12 flex flex-col lg:flex-row items-center gap-12 relative">
        {/* Left content: Hero text */}
        <div className="flex-1 space-y-md text-center lg:text-left z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-4 py-1.5 rounded-full mb-xs border border-outline-variant/30">
            <Icon name="auto_awesome" className="text-base text-primary block" />
            <span className="font-label-md text-label-md">Pembelajaran Berbasis Graph Terdepan</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg lg:text-7xl lg:leading-[1.1] text-on-surface">
            Belajar <span className="text-primary kanji-glow">Jukugo Kanji</span> Melalui Semantic Graph
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto lg:mx-0">
            Visualisasi interaktif, animasi urutan guratan, dan audio native untuk menguasai Kanji dengan cara yang lebih alami dan menyenangkan.
          </p>
          <div className="flex flex-col sm:flex-row gap-base pt-md justify-center lg:justify-start">
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-on-primary px-10 py-4 rounded-xl font-headline-md text-headline-md button-shadow transition-all hover:brightness-110 active:scale-95 cursor-pointer"
            >
              Mulai Belajar
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-surface-container-lowest border-2 border-primary/20 text-primary px-10 py-4 rounded-xl font-headline-md text-headline-md hover:bg-primary/5 transition-all cursor-pointer"
            >
              Coba Demo
            </button>
          </div>
        </div>

        {/* Right content: Floating Kanji Card illustration */}
        <div className="flex-1 relative w-full aspect-square max-w-[500px] flex items-center justify-center">
          <div className="w-72 h-72 lg:w-96 lg:h-96 glass-card rounded-[40px] shadow-2xl flex flex-col items-center justify-center relative animate-float">
            <span className="font-display-kanji text-[120px] lg:text-[140px] text-primary select-none">学</span>
            <div className="absolute bottom-10 text-center select-none">
              <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Learn • Belajar</p>
              <p className="font-headline-md text-headline-md text-secondary mt-1">GAKU</p>
            </div>
          </div>

          {/* Floating Semantic Connections (Nodes) */}
          <div className="absolute top-4 right-4 p-4 glass-card rounded-2xl shadow-lg border-l-4 border-primary translate-x-4 -translate-y-4 lg:translate-x-12 lg:-translate-y-8 select-none transition-transform hover:scale-105">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-display-kanji">校</span>
              <div>
                <p className="text-xs font-bold text-primary">Sekolah</p>
                <p className="text-[10px] text-on-surface-variant">Gakkou (学校)</p>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-12 left-4 p-4 glass-card rounded-2xl shadow-lg border-l-4 border-secondary -translate-x-4 translate-y-4 lg:-translate-x-12 lg:translate-y-8 select-none transition-transform hover:scale-105">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-display-kanji">生</span>
              <div>
                <p className="text-xs font-bold text-secondary">Siswa</p>
                <p className="text-[10px] text-on-surface-variant">Gakusei (学生)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-base md:gap-md">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest p-md rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all"
            >
              <Icon name={stat.icon} className={`${stat.color} text-3xl mb-2 block`} />
              <h3 className="font-headline-lg text-headline-lg text-primary">{stat.value}</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
