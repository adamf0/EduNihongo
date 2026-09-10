import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, Network, Edit3, BarChart2, ArrowRight, Award, Database, Briefcase } from "lucide-react";

export const FeatureSection: React.FC = () => {
  const navigate = useNavigate();

  const quickFeatures = [
    {
      icon: <BookOpen className="w-6 h-6 text-[#EC6C9A]" />,
      title: "Modul Pembelajaran",
      desc: "Materi tematik dengan semantic graph",
      bg: "bg-[#FDE8F0]",
      link: "/module",
    },
    {
      icon: <span className="font-serif font-black text-lg text-[#0D47A1]">漢</span>,
      title: "Daftar Kanji",
      desc: "Pelajari makna dan penggunaan kanji",
      bg: "bg-[#e3f2fd]",
      link: "/kanji",
    },
    {
      icon: <Network className="w-6 h-6 text-[#0D47A1]" />,
      title: "Jukugo Explorer",
      desc: "Temukan hubungan makna antar kanji",
      bg: "bg-[#e8eaf6]",
      link: "/jukugo",
    },
    {
      icon: <Edit3 className="w-6 h-6 text-[#40c4ff]" />,
      title: "Latihan Interaktif",
      desc: "Uji pemahaman dengan latihan",
      bg: "bg-[#e0f7fa]",
      link: "/latihan",
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-[#00b0ff]" />,
      title: "Pantau Progress",
      desc: "Lihat perkembangan belajarmu",
      bg: "bg-[#e1f5fe]",
      link: "/progress",
    },
  ];

  const modules = [
    {
      id: 1,
      title: "Modul 1",
      subtitle: "Akademik dan Evaluasi",
      kanjis: "試・験・問・題・答",
      icon: <Award className="w-8 h-8 text-[#0D47A1]" />,
      bg: "bg-[#e3f2fd]/80 border-[#A8D5FF]/40",
      accentColor: "text-[#0D47A1]",
      kanjiChar: "試",
    },
    {
      id: 2,
      title: "Modul 2",
      subtitle: "Penelitian dan Pembuktian Ilmiah",
      kanjis: "研・究・集・調・査",
      icon: <Search className="w-8 h-8 text-[#00796b]" />,
      bg: "bg-[#e0f2f1]/80 border-[#80cbc4]/40",
      accentColor: "text-[#00796b]",
      kanjiChar: "研",
    },
    {
      id: 3,
      title: "Modul 3",
      subtitle: "Informasi dan Data",
      kanjis: "情・報・伝・信・送",
      icon: <Database className="w-8 h-8 text-[#f57f17]" />,
      bg: "bg-[#fff8e1]/80 border-[#ffe082]/40",
      accentColor: "text-[#f57f17]",
      kanjiChar: "情",
    },
    {
      id: 4,
      title: "Modul 4",
      subtitle: "Profesi dan Dunia Kerja",
      kanjis: "職・業・商・務・術",
      icon: <Briefcase className="w-8 h-8 text-[#c2185b]" />,
      bg: "bg-[#fce4ec]/80 border-[#f48fb1]/40",
      accentColor: "text-[#c2185b]",
      kanjiChar: "職",
    },
  ];

  return (
    <section className="py-12 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-12">
        {/* Quick Feature Access Cards (5 Horizontal Tiles) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickFeatures.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.link)}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
            >
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                {item.icon}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-[#0D47A1] transition-colors leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 mt-1 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Module Cards Grid ("Modul Pembelajaran") */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-black text-[#0D47A1]">
              Modul Pembelajaran
            </h2>
            <button
              onClick={() => navigate("/module")}
              className="text-xs font-extrabold text-[#EC6C9A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modules.map((mod) => (
              <div
                key={mod.id}
                onClick={() => navigate(`/latihan/${mod.kanjiChar}`)}
                className={`${mod.bg} border p-5 rounded-3xl shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[160px] relative overflow-hidden group`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {mod.title}
                    </span>
                    <h3 className={`font-black text-sm md:text-base mt-1 ${mod.accentColor} leading-snug`}>
                      {mod.subtitle}
                    </h3>
                  </div>
                  <div className="p-2 rounded-2xl bg-white/80 shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                    {mod.icon}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900/5 flex justify-between items-center">
                  <span className="font-serif font-extrabold text-sm tracking-widest text-slate-700">
                    {mod.kanjis}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${mod.accentColor} opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
