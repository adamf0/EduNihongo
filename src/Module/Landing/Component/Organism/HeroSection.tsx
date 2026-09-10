import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#e3f2fd]/60 via-[#fde8f0]/40 to-white pt-8 pb-16 border-b border-slate-100">
      {/* Subtle Sakura Blossom & Fuji Silhouette Overlay Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#EC6C9A]/10 to-[#A8D5FF]/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row items-center justify-between gap-10 relative">
        {/* Left Hero Content */}
        <div className="flex-1 space-y-6 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 bg-[#FDE8F0] border border-[#EC6C9A]/20 text-[#EC6C9A] px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide">
            <span>つながる、ひろがる、漢字の世界へ</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0D47A1] leading-tight tracking-tight">
            Menghubungkan Kanji, <br />
            Memperluas Makna, <br />
            <span className="text-[#EC6C9A]">Melangkah Lebih Jauh</span>
          </h1>

          <p className="text-slate-600 font-medium text-base md:text-lg w-full mx-auto lg:mx-0 leading-relaxed">
            Belajar kanji melalui semantic graph untuk memahami jukugo secara lebih sistematis dan terstruktur.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#EC6C9A] hover:bg-[#d85b88] text-white px-8 py-3.5 rounded-full font-extrabold text-base shadow-lg shadow-[#EC6C9A]/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Mulai Belajar</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white border-2 border-[#0D47A1]/20 text-[#0D47A1] hover:bg-[#0D47A1]/5 px-8 py-3.5 rounded-full font-bold text-base transition-all cursor-pointer"
            >
              Jelajahi Graph
            </button>
          </div>
        </div>

        {/* Right Content: Interactive Semantic Graph Node Visual (学) */}
        <div className="flex-1 relative w-full aspect-square max-w-[480px] flex items-center justify-center">
          {/* Central Background Ring & Connecting Edge Lines */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
              <line x1="160" y1="160" x2="160" y2="40" stroke="#A8D5FF" strokeWidth="2.5" strokeDasharray="4 4" />
              <line x1="160" y1="160" x2="270" y2="100" stroke="#A8D5FF" strokeWidth="2.5" strokeDasharray="4 4" />
              <line x1="160" y1="160" x2="250" y2="240" stroke="#A8D5FF" strokeWidth="2.5" strokeDasharray="4 4" />
              <line x1="160" y1="160" x2="70" y2="240" stroke="#A8D5FF" strokeWidth="2.5" strokeDasharray="4 4" />
              <line x1="160" y1="160" x2="50" y2="100" stroke="#A8D5FF" strokeWidth="2.5" strokeDasharray="4 4" />
            </svg>

            {/* Central Node (学) */}
            <div className="w-28 h-28 rounded-full bg-[#FDE8F0] border-4 border-[#EC6C9A] shadow-xl flex flex-col items-center justify-center z-10 animate-pulse">
              <span className="font-serif font-black text-4xl text-[#EC6C9A]">学</span>
            </div>

            {/* Satellite Node 1: 学校 (sekolah) - Top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white border border-slate-100 p-2.5 rounded-2xl shadow-md flex flex-col items-center select-none hover:scale-110 transition-transform">
              <span className="font-serif font-bold text-lg text-slate-800">学校</span>
              <span className="text-[10px] text-slate-400 font-semibold">(sekolah)</span>
            </div>

            {/* Satellite Node 2: 学習 (belajar) - Top Right */}
            <div className="absolute top-12 right-0 bg-white border border-slate-100 p-2.5 rounded-2xl shadow-md flex flex-col items-center select-none hover:scale-110 transition-transform">
              <span className="font-serif font-bold text-lg text-slate-800">学習</span>
              <span className="text-[10px] text-slate-400 font-semibold">(belajar)</span>
            </div>

            {/* Satellite Node 3: 科学 (ilmu pengetahuan) - Bottom Right */}
            <div className="absolute bottom-6 right-4 bg-white border border-slate-100 p-2.5 rounded-2xl shadow-md flex flex-col items-center select-none hover:scale-110 transition-transform">
              <span className="font-serif font-bold text-lg text-slate-800">科学</span>
              <span className="text-[10px] text-slate-400 font-semibold">(ilmu pengetahuan)</span>
            </div>

            {/* Satellite Node 4: 文学 (sastra) - Bottom Left */}
            <div className="absolute bottom-6 left-4 bg-white border border-slate-100 p-2.5 rounded-2xl shadow-md flex flex-col items-center select-none hover:scale-110 transition-transform">
              <span className="font-serif font-bold text-lg text-slate-800">文学</span>
              <span className="text-[10px] text-slate-400 font-semibold">(sastra)</span>
            </div>

            {/* Satellite Node 5: 学生 (mahasiswa) - Top Left */}
            <div className="absolute top-12 left-0 bg-white border border-slate-100 p-2.5 rounded-2xl shadow-md flex flex-col items-center select-none hover:scale-110 transition-transform">
              <span className="font-serif font-bold text-lg text-slate-800">学生</span>
              <span className="text-[10px] text-slate-400 font-semibold">(mahasiswa)</span>
            </div>
          </div>

          {/* Japanese Quote Badge */}
          <div className="absolute -bottom-4 right-2 bg-white/90 backdrop-blur-xs p-3 rounded-2xl shadow-md border border-slate-100 text-right text-xs">
            <p className="font-serif font-bold text-[#0D47A1]">一つの漢字から、もっと広い世界へ</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Satu kanji, banyak koneksi, makna tak terbatas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
