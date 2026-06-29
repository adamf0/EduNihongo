import React, { useState, useEffect } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import { useNavigate } from "react-router-dom";
import { api } from "../../Common/Utility/api";
import { CheckCircle2, Lock, BookOpen, ChevronRight } from "lucide-react";

export const ModulePage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const result = await api.modules.get();
        setData(result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal memuat modul belajar.");
        if (err.message?.includes("Token") || err.message?.includes("Akses ditolak")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, [navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center min-h-[400px]">
          <div className="text-[#8f0020] font-bold animate-pulse text-lg">Memuat kurikulum belajar...</div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="w-full px-4 md:px-6 max-w-[1200px] mx-auto py-12">
          <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center font-semibold max-w-md mx-auto">
            <p className="mb-4">{error || "Terjadi kesalahan koneksi"}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-[#8f0020] text-white rounded-full text-sm font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { overallProgress, modules } = data;

  return (
    <Layout>
      <div className="w-full min-h-screen text-[#191c1e] antialiased relative pb-20">
        
        {/* Custom style for background & animations */}
        <style>{`
          .seigaiha-bg {
            background-image: radial-gradient(circle at 100% 150%, #edeef0 24%, white 25%, white 28%, #edeef0 29%, #edeef0 36%, white 36%, white 40%, transparent 40%, transparent);
            background-size: 40px 20px;
          }
        `}</style>

        {/* Background Texture */}
        <div className="absolute inset-0 seigaiha-bg pointer-events-none opacity-20 z-0"></div>
        
        <div className="w-full mx-auto px-4 md:px-8 py-8 relative z-10">
          
          {/* Header Section */}
          <section className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#edeef0] pb-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#191c1e] mb-3">Alur Belajar Anda</h2>
              <p className="text-base text-[#5c403f] leading-relaxed">
                Pelajari karakter Kanji Jepang secara modular selangkah demi selangkah. Selesaikan latihan goresan untuk membuka modul berikutnya.
              </p>
            </div>
            <div className="flex flex-col items-center shrink-0 self-start md:self-end">
              <div className="w-16 h-16 rounded-full border-4 border-[#8f0020] flex items-center justify-center bg-white shadow-sm">
                <span className="text-xl font-bold text-[#8f0020]">{overallProgress}%</span>
              </div>
              <span className="text-[10px] mt-1 font-bold uppercase tracking-wider text-[#8f0020]">PROGRES TOTAL</span>
            </div>
          </section>

          {/* Learning Modules Flow */}
          <div className="relative w-full max-w-3xl mx-auto flex flex-col gap-10 my-10">
            
            {/* Vertical Connector Line */}
            <div className="absolute left-6 md:left-1/2 top-8 bottom-8 w-[2px] bg-repeat-y -translate-x-1/2 z-0"
                 style={{ backgroundImage: 'linear-gradient(to bottom, #8f0020 50%, transparent 50%)', backgroundSize: '2px 16px' }}></div>

            {modules.map((mod: any, idx: number) => {
              const isEven = idx % 2 === 0;
              
              // Determine layout alignment for desktop
              const leftSideClass = isEven 
                ? "w-full md:w-[46%] flex justify-start md:justify-end order-2 md:order-1 pl-12 md:pl-0"
                : "md:w-[46%] hidden md:block order-1";
              
              const rightSideClass = isEven
                ? "md:w-[46%] hidden md:block order-3"
                : "w-full md:w-[46%] flex justify-start order-2 md:order-3 pl-12 md:pl-0";

              // Find first incomplete kanji or fallback to first
              const targetKanji = mod.kanjis.find((k: any) => !k.isCompleted)?.character || mod.kanjis[0]?.character || "";

              return (
                <div key={mod.id} className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 justify-between group ${mod.isLocked ? 'opacity-65' : ''}`}>
                  
                  {/* Left side card or placeholder */}
                  <div className={leftSideClass}>
                    {isEven && (
                      <ModuleCard 
                        mod={mod} 
                        targetKanji={targetKanji} 
                        navigate={navigate} 
                      />
                    )}
                  </div>

                  {/* Timeline Dot in the Center */}
                  <div className="absolute left-6 md:relative md:left-0 z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 bg-white shadow-md order-1 md:order-2 shrink-0 -translate-x-1/2 md:translate-x-0 transition-colors duration-300"
                       style={{ borderColor: mod.isLocked ? '#e2e8f0' : (mod.isCompleted ? '#4F7942' : '#8f0020') }}>
                    {mod.isLocked ? (
                      <Lock className="w-4 h-4 text-slate-400" />
                    ) : mod.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 fill-white text-[#4F7942] stroke-[#4F7942]" />
                    ) : (
                      <span className="text-sm font-bold text-[#8f0020]">{idx + 1}</span>
                    )}
                  </div>

                  {/* Right side card or placeholder */}
                  <div className={rightSideClass}>
                    {!isEven && (
                      <ModuleCard 
                        mod={mod} 
                        targetKanji={targetKanji} 
                        navigate={navigate} 
                      />
                    )}
                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </div>
    </Layout>
  );
};

// Helper ModuleCard component for rendering modular cards
const ModuleCard = ({ mod, targetKanji, navigate }: { mod: any; targetKanji: string; navigate: any }) => {
  return (
    <div className={`ml-4 md:ml-0 bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-sm hover:shadow-md w-full border border-slate-100 border-l-4 transition-all duration-300 hover:-translate-y-0.5 ${mod.isLocked ? 'border-l-slate-300' : (mod.isCompleted ? 'border-l-[#4F7942]' : 'border-l-[#8f0020]')}`}>
      
      {/* Title and Lock Status */}
      <div className="flex flex-wrap justify-between items-start gap-2 mb-3.5">
        <h3 className={`text-lg font-bold ${mod.isLocked ? 'text-slate-500' : 'text-slate-900'}`}>
          {mod.title}
        </h3>
        {mod.isLocked ? (
          <span className="bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 select-none">
            <Lock className="w-3 h-3" /> Terkunci
          </span>
        ) : mod.isCompleted ? (
          <span className="bg-[#e2f0d9] text-[#385723] px-2.5 py-0.5 rounded-full text-xs font-semibold select-none">
            Selesai
          </span>
        ) : (
          <span className="bg-[#fcebeb] text-[#8f0020] px-2.5 py-0.5 rounded-full text-xs font-semibold animate-pulse select-none">
            Aktif
          </span>
        )}
      </div>

      {/* Kanji Sub-Lessons Grid */}
      <div className="mb-4">
        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">Materi Kanji</p>
        <div className="flex flex-wrap gap-2">
          {mod.kanjis.map((k: any) => {
            const isKanjiCompleted = k.isCompleted;
            const isLocked = mod.isLocked;
            return (
              <div 
                key={k.character}
                onClick={() => !isLocked && navigate(`/latihan?char=${k.character}`)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 ${isLocked ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : (isKanjiCompleted ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800 hover:bg-emerald-50 cursor-pointer' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#8f0020] hover:text-[#8f0020] cursor-pointer')}`}
                title={`${k.meaning} (${isKanjiCompleted ? 'Selesai' : 'Belum selesai'})`}
              >
                <span className="font-serif font-bold text-base">{k.character}</span>
                {isKanjiCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Progress Bar */}
      {!mod.isLocked && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 mr-4">
            <div className="h-2 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${mod.isCompleted ? 'bg-[#4F7942]' : 'bg-[#8f0020]'}`} style={{ width: `${mod.progressPercent}%` }}></div>
            </div>
          </div>
          <span className={`text-xs font-bold ${mod.isCompleted ? 'text-[#4F7942]' : 'text-[#8f0020]'}`}>{mod.progressPercent}%</span>
        </div>
      )}

      {/* Action Button */}
      {!mod.isLocked && (
        <button 
          onClick={() => navigate(`/latihan?char=${targetKanji}`)} 
          className={`w-full py-2.5 rounded-xl font-bold shadow-sm transition-all duration-200 active:scale-[0.98] border-none text-sm text-white flex items-center justify-center gap-1.5 cursor-pointer ${mod.isCompleted ? 'bg-[#4F7942] hover:brightness-105' : 'bg-[#8f0020] hover:brightness-105'}`}
        >
          <BookOpen className="w-4 h-4" />
          {mod.isCompleted ? "Ulas Kembali" : "Mulai Belajar"}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

    </div>
  );
};

export default ModulePage;