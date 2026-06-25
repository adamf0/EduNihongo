import React, { useEffect, useState } from "react";
import HeroSection from "../Component/Organism/HeroSection";
import FeatureSection from "../Component/Organism/FeatureSection";
import Icon from "../../Common/Component/Icon";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="bg-surface font-body-md text-on-surface seigaiha-bg-landing min-h-screen overflow-x-hidden flex flex-col">
      {/* Top Navbar */}
      <header
        className={`bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md sticky top-0 z-40 transition-all duration-300 ${
          hasScrolled ? "shadow-md py-2" : "shadow-sm py-4"
        }`}
      >
        <div className="flex justify-between items-center w-full px-4 md:px-6 lg:px-12 max-w-[1200px] mx-auto">
          {/* Logo block */}
          <div className="flex items-center gap-sm cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-md">
              <Icon name="star_shine" className="text-white block text-xl" />
            </div>
            <span className="font-headline-md text-headline-md font-black text-primary tracking-tight">
              KANJIGRAPH
            </span>
          </div>

          {/* Navigation link / actions */}
          <div className="flex items-center gap-base">
            <div className="hidden md:flex items-center bg-surface-container rounded-full px-3 py-1 ring-1 ring-outline/10 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-on-surface-variant mr-2 text-base">
                search
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 text-xs w-24 outline-none"
                placeholder="Cari Kanji..."
                type="text"
              />
            </div>
            <button 
              onClick={() => navigate("/dashboard")}
              className="material-symbols-outlined text-on-surface-variant hover:text-primary p-2 cursor-pointer transition-colors"
            >
              notifications
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md text-label-md font-bold transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              Mulai
            </button>
          </div>
        </div>
      </header>

      {/* Main Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeatureSection />

        {/* How It Works Section */}
        <section className="py-12 max-w-[1200px] mx-auto px-4 md:px-12 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-xl">
            {/* Steps list */}
            <div className="w-full lg:w-1/2">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-lg">
                Bagaimana Kanjigraph Mengubah Cara Anda Belajar
              </h2>
              <div className="space-y-lg relative">
                {/* Connecting vertical timeline line */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-outline-variant/50 hidden sm:block"></div>

                <div className="flex gap-md relative">
                  <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 z-10 font-bold select-none shadow-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Pilih Kanji Utama</h4>
                    <p className="text-on-surface-variant">Mulai dengan Kanji dasar atau Kanji yang ingin Anda kuasai hari ini.</p>
                  </div>
                </div>

                <div className="flex gap-md relative">
                  <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 z-10 font-bold select-none shadow-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Eksplorasi Semantic Graph</h4>
                    <p className="text-on-surface-variant">Klik pada node untuk melihat relasi kata majemuk yang terkait dengan Kanji tersebut.</p>
                  </div>
                </div>

                <div className="flex gap-md relative">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 z-10 font-bold select-none shadow-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Latihan & Evaluasi</h4>
                    <p className="text-on-surface-variant">Gunakan tool interaktif untuk menulis dan tes pemahaman Anda seketika.</p>
                  </div>
                </div>

                <div className="flex gap-md relative">
                  <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 z-10 font-bold select-none shadow-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Penguasaan (Mastery)</h4>
                    <p className="text-on-surface-variant">Lacak kemajuan Anda melalui dashboard statistik yang komprehensif.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video preview mock image block */}
            <div className="w-full lg:w-1/2 bg-surface-container rounded-3xl p-md aspect-video relative flex items-center justify-center overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-2xl shadow-xl select-none"
                alt="A sleek user interface preview of Kanjigraph learning network."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAWklsQY_N4lcvZVDBg_m9KWGGZHeA8ZlQ6lXyDpLhUOSJwtXmFkjA7RIs87F3AOADM_wADukPHASkhJsTZqlOx_6CRM3LBLVIJ5y6xayMjKXFsu87z2A1cccApVHXMd4gu-zJUkP8hx-inmFRxWR1kXZqoLyozYCGxXunQbRxHMY7yCQhQ8awQS1Dd_WLPpKq2ALijZ0DxDkQ2deqpd4bXfbZdRIfk1tPzcqtsm_HfEiHJMBJt-VlGI_UtROOUyfkblHBtjMJqyk"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent flex items-center justify-center">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                >
                  <Icon name="play_arrow" className="text-4xl block" style={{ fontVariationSettings: "'FILL' 1" }} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Torii Section */}
        <section className="py-xl">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="bg-primary p-xl rounded-[40px] text-center text-on-primary relative overflow-hidden shadow-xl">
              {/* background overlay pattern */}
              <div className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none seigaiha-pattern"></div>
              <div className="relative z-10 space-y-md">
                <h2 className="font-headline-lg text-headline-lg md:text-5xl">Siap Menjadi Master Kanji?</h2>
                <p className="font-body-lg text-body-lg opacity-95 max-w-2xl mx-auto">
                  Bergabunglah dengan ribuan pelajar lainnya dan rasakan cara belajar Kanji yang revolusioner sekarang juga.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-surface text-primary px-12 py-4 rounded-xl font-headline-md text-headline-md hover:bg-surface-container-low transition-all shadow-xl cursor-pointer font-bold"
                >
                  Daftar Sekarang — Gratis
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest py-lg border-t border-outline-variant/10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl mb-xl">
            {/* Branding Column */}
            <div className="space-y-md">
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-md">
                  <Icon name="star_shine" className="text-white block text-xl" />
                </div>
                <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
                  KANJIGRAPH
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Platform pembelajaran Bahasa Jepang berbasis kecerdasan visual dan pemetaan semantik konsep.
              </p>
            </div>

            {/* Links Column 1 */}
            <div>
              <h5 className="font-headline-md text-secondary mb-md">Materi Belajar</h5>
              <ul className="space-y-sm">
                <li><span onClick={() => navigate("/module")} className="text-body-md text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Tingkat Kanji (JLPT)</span></li>
                <li><span onClick={() => navigate("/latihan")} className="text-body-md text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Latihan Goresan Interaktif</span></li>
                <li><span onClick={() => navigate("/module")} className="text-body-md text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Kamus Jukugo</span></li>
              </ul>
            </div>

            {/* Links Column 2 */}
            <div>
              <h5 className="font-headline-md text-secondary mb-md">Fitur Utama</h5>
              <ul className="space-y-sm">
                <li><span onClick={() => navigate("/dashboard")} className="text-body-md text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Dasbor Progres</span></li>
                <li><span onClick={() => navigate("/progress")} className="text-body-md text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Lencana & Prestasi</span></li>
                <li><span onClick={() => navigate("/profile")} className="text-body-md text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Analisis Personal</span></li>
              </ul>
            </div>

            {/* Links Column 3 */}
            <div>
              <h5 className="font-headline-md text-secondary mb-md">Tentang Kanjigraph</h5>
              <ul className="space-y-sm">
                <li><span onClick={() => navigate("/")} className="text-body-md text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Tentang Kami</span></li>
                <li><span onClick={() => navigate("/")} className="text-body-md text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Hubungi Bantuan</span></li>
                <li><span onClick={() => navigate("/")} className="text-body-md text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Kebijakan Layanan</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-outline-variant/10 pt-lg flex flex-col sm:flex-row justify-between items-center gap-md">
            <p className="text-caption text-on-surface-variant">© 2024 Kanjigraph. Dibuat untuk penguasaan Bahasa Jepang.</p>
            <div className="flex gap-md">
              <span className="text-caption text-on-surface-variant hover:text-primary cursor-pointer">Facebook</span>
              <span className="text-caption text-on-surface-variant hover:text-primary cursor-pointer">Twitter</span>
              <span className="text-caption text-on-surface-variant hover:text-primary cursor-pointer">Instagram</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
