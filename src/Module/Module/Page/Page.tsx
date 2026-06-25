import React from "react";
import Layout from "../../Common/Component/Organism/Layout";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  Lock, 
  GraduationCap 
} from "lucide-react"; 

export const ModulePage: React.FC = () => {
  const navigate = useNavigate();

  const radicalItems = [
    { text: "Komponen Radikal", isCompleted: true, isLocked: false },
    { text: "Masterclass Urutan Goresan", isCompleted: true, isLocked: false },
    { text: "Mnemonik Visual (Terkunci)", isCompleted: false, isLocked: true },
  ];

  const kanjiItems = [
    { text: "24 Kanji Gerbang Besi Esensial", isCompleted: true, isLocked: false },
    { text: "Variasi Kunyomi Tahap 1", isCompleted: false, isLocked: false },
    { text: "Latihan Audio Onyomi", isCompleted: false, isLocked: false },
  ];

  const vocabItems = [
    { text: "Kata Kerja Majemuk", isCompleted: false, isLocked: true },
    { text: "Konsep Abstrak dalam Teks", isCompleted: false, isLocked: true },
  ];

  return (
    <Layout>
      {/* Pembungkus utama disesuaikan agar flexibel dan mengikuti ruang dari komponen <Layout> */}
      <div className="w-full min-h-screen text-[#191c1e] antialiased relative pb-12">
        
        {/* Kustom Style untuk Pola Seigaiha & Animasi */}
        <style>{`
          .seigaiha-bg {
            background-image: radial-gradient(circle at 100% 150%, #edeef0 24%, white 25%, white 28%, #edeef0 29%, #edeef0 36%, white 36%, white 40%, transparent 40%, transparent);
            background-size: 40px 20px;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}</style>

        {/* Background Texture (Diatur agar berada di belakang konten utama) */}
        <div className="absolute inset-0 seigaiha-bg pointer-events-none opacity-20 z-0"></div>
        
        {/* Kontainer Konten Utama */}
        <div className="w-full mx-auto px-4 md:px-8 py-8 relative z-10">
          
          {/* Header Section */}
          <section className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#edeef0] pb-6">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 bg-[#b5d0fd] text-[#3e5980] rounded-full text-xs font-bold mb-3">
                Level 12: Gerbang Besi
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#191c1e] mb-3">Alur Belajar Anda</h2>
              <p className="text-base text-[#5c403f] leading-relaxed">
                Fokus pada transisi dari radikal dasar ke kanji yang kompleks. Selesaikan langkah-langkah ini untuk membuka kosakata tingkat tinggi.
              </p>
            </div>
            <div className="flex flex-col items-center shrink-0 self-start md:self-end">
              <div className="w-16 h-16 rounded-full border-4 border-[#4F7942] flex items-center justify-center bg-white shadow-sm">
                <span className="text-xl font-bold text-[#4F7942]">64%</span>
              </div>
              <span className="text-[10px] mt-1 font-bold uppercase tracking-wider text-[#4F7942]">KESELURUHAN</span>
            </div>
          </section>

          {/* Learning Path Flow */}
          <div className="relative w-full max-w-3xl mx-auto flex flex-col gap-12 md:gap-16 my-12">
            
            {/* Vertical Connector Line */}
            <div className="absolute left-6 md:left-1/2 top-6 bottom-6 w-1 bg-repeat-y -translate-x-1/2 z-0"
                 style={{ backgroundImage: 'linear-gradient(to bottom, #edeef0 50%, transparent 50%)', backgroundSize: '4px 20px' }}></div>

            {/* 1. Category: Radicals */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 group">
              {/* Sisi Kiri (Desktop) */}
              <div className="w-full md:w-1/2 flex justify-start md:justify-end order-2 md:order-1 pl-12 md:pl-0">
                <div className="ml-4 md:ml-0 bg-white/90 backdrop-blur-xl p-5 rounded-xl shadow-sm w-full border border-[#edeef0] border-l-4 border-l-[#2E4482] transition-all hover:-translate-y-1">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                    <h3 className="text-lg font-bold text-[#2E4482]">Radikal</h3>
                    <span className="bg-[#d5e3ff] text-[#001c3b] px-2.5 py-0.5 rounded-full text-xs font-bold">Kesulitan N4</span>
                  </div>
                  <ul className="space-y-3 mb-4">
                    {radicalItems.map((item, idx) => (
                      <li key={idx} className={`flex items-center gap-3 text-sm ${item.isLocked ? 'opacity-60 italic' : ''}`}>
                        <span className={`w-2 h-2 rounded-full ${item.isCompleted ? 'bg-[#4F7942]' : 'bg-[#e4bdbc]'}`}></span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="h-2 w-full bg-[#e1e2e4] rounded-full overflow-hidden">
                        <div className="h-full bg-[#4F7942] w-[85%] rounded-full"></div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#4F7942]">85%</span>
                  </div>
                </div>
              </div>
              
              {/* Node Lingkaran Tengah */}
              <div className="absolute left-6 md:relative md:left-0 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-[#4F7942] text-white shadow-lg order-1 md:order-2 shrink-0 -translate-x-1/2 md:translate-x-0">
                <CheckCircle2 className="w-6 h-6 fill-white stroke-[#4F7942]" />
              </div>
              
              {/* Penyeimbang Sisi Kanan (Desktop) */}
              <div className="md:w-1/2 hidden md:block order-3"></div>
            </div>

            {/* 2. Category: Kanji */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 group">
              {/* Penyeimbang Sisi Kiri (Desktop) */}
              <div className="md:w-1/2 hidden md:block order-1"></div>
              
              {/* Node Lingkaran Tengah */}
              <div className="absolute left-6 md:relative md:left-0 z-10 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border-4 border-[#8f0020] text-[#8f0020] shadow-xl animate-float order-1 md:order-2 shrink-0 -translate-x-1/2 md:translate-x-0">
                <span className="text-xl md:text-2xl font-serif font-black">漢</span>
              </div>
              
              {/* Sisi Kanan (Desktop) */}
              <div className="w-full md:w-1/2 flex justify-start order-2 md:order-3 pl-12 md:pl-0">
                <div className="ml-4 md:ml-0 bg-white/90 backdrop-blur-xl p-5 rounded-xl shadow-sm w-full border border-[#edeef0] border-l-4 border-l-[#8f0020] transition-all hover:-translate-y-1">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                    <h3 className="text-lg font-bold text-[#8f0020]">Inti Kanji</h3>
                    <span className="bg-[#ffdad9] text-[#400009] px-2.5 py-0.5 rounded-full text-xs font-bold">Kesulitan N3</span>
                  </div>
                  <ul className="space-y-3 mb-4">
                    {kanjiItems.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        <span className={`w-2 h-2 rounded-full ${item.isCompleted ? 'bg-[#8f0020]' : 'bg-[#e4bdbc]'}`}></span>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 mr-4">
                      <div className="h-2 w-full bg-[#e1e2e4] rounded-full overflow-hidden">
                        <div className="h-full bg-[#8f0020] w-[32%] rounded-full"></div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#8f0020]">32%</span>
                  </div>
                  <button 
                    onClick={() => navigate('/learn')} 
                    className="w-full py-2 bg-[#8f0020] text-white rounded-xl font-bold shadow-md hover:brightness-110 active:scale-[0.98] transition-all text-sm"
                  >
                    Lanjutkan Belajar
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Category: Vocabulary */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 group opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              {/* Sisi Kiri (Desktop) */}
              <div className="w-full md:w-1/2 flex justify-start md:justify-end order-2 md:order-1 pl-12 md:pl-0">
                <div className="ml-4 md:ml-0 bg-white/90 backdrop-blur-xl p-5 rounded-xl shadow-sm w-full border border-[#edeef0] border-l-4 border-l-[#4F7942]">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                    <h3 className="text-lg font-bold text-[#4F7942]">Kosakata</h3>
                    <span className="bg-[#edeef0] text-[#5c403f] px-2.5 py-0.5 rounded-full text-xs font-bold">Terkunci</span>
                  </div>
                  <p className="text-xs italic text-[#5c403f] mb-4">Kuasai Inti Kanji untuk membuka frasa kosakata kontekstual.</p>
                  <ul className="space-y-3 opacity-40">
                    {vocabItems.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        <Lock className="w-3.5 h-3.5" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Node Lingkaran Tengah */}
              <div className="absolute left-6 md:relative md:left-0 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-[#e1e2e4] text-[#5c403f] shadow-md order-1 md:order-2 shrink-0 -translate-x-1/2 md:translate-x-0">
                <Lock className="w-5 h-5" />
              </div>
              
              {/* Penyeimbang Sisi Kanan (Desktop) */}
              <div className="md:w-1/2 hidden md:block order-3"></div>
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default ModulePage;