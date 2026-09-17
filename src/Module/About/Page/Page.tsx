import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MusubiLogo from "../../Common/Component/MusubiLogo";
import {
  Home,
  BookOpen,
  Layers,
  Edit3,
  BarChart2,
  HelpCircle,
  Network,
  Target,
  Compass,
  Award,
  CheckCircle2,
  Sparkles,
  Brain,
  PenTool,
  CheckSquare,
  FileText,
  MessageSquare,
  ArrowRight,
  GraduationCap,
  Users,
  BookMarked,
  ShieldCheck,
} from "lucide-react";

export const AboutPage: React.FC = () => {
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
    { label: "Kanji", icon: <span className="font-serif font-black text-sm">漢</span>, path: "/module" },
    { label: "Jukugo", icon: <Layers className="w-4 h-4" />, path: "/module" },
    { label: "Latihan", icon: <Edit3 className="w-4 h-4" />, path: "/latihan" },
    { label: "Evaluasi", icon: <BarChart2 className="w-4 h-4" />, path: "/progress" },
    { label: "Tentang", icon: <HelpCircle className="w-4 h-4" />, path: "/about" },
  ];

  const targetUsers = [
    {
      title: "Mahasiswa / Siswa Pembelajar N4",
      icon: <GraduationCap className="w-7 h-7 text-[#0D47A1]" />,
      desc: "Pembelajar Bahasa Jepang yang sedang mempersiapkan ujian JLPT N4 atau menempuh mata kuliah kanji dasar-menengah.",
      badge: "Utama",
    },
    {
      title: "Pengajar & Dosen Bahasa Jepang",
      icon: <Users className="w-7 h-7 text-[#0D47A1]" />,
      desc: "Pendidik yang membutuhkan media visual grafis interaktif serta sistem LMS untuk penugasan, evaluasi, dan umpan balik.",
      badge: "LMS Facilitator",
    },
    {
      title: "Pembelajar Mandiri (Autodidakt)",
      icon: <BookMarked className="w-7 h-7 text-[#0D47A1]" />,
      desc: "Pembelajar independen yang ingin memahami kanji secara kontekstual melalui visualisasi relasi jaringan makna tanpa rasa bosan.",
      badge: "Self-Learner",
    },
  ];

  const learningMethods = [
    {
      step: "01",
      icon: <Network className="w-6 h-6 text-white" />,
      title: "Visual Semantic Graph & Kanji Atlas",
      subtitle: "Navigasi Jaringan Makna Interaktif",
      desc: "Menghubungkan Kanji tunggal dan Jukugo (kombinasi kanji) ke dalam peta graf semantik interaktif 2D. Pembelajar dapat melihat keterhubungan konsep secara langsung.",
      color: "bg-[#0D47A1]",
    },
    {
      step: "02",
      icon: <Brain className="w-6 h-6 text-white" />,
      title: "2-Level Rumusan Pembangun & Breakdown Jukugo",
      subtitle: "Pembongkaran Kata Secara Hierarkis",
      desc: "Membongkar struktur kata majemuk (contoh: Dual Sub-Jukugo 原因究明 atau Root Kanji Compound 研修旅行) menjadi komponen kanji dasar dan makna pembentuknya.",
      color: "bg-[#EC6C9A]",
    },
    {
      step: "03",
      icon: <PenTool className="w-6 h-6 text-white" />,
      title: "Stroke Order & Real-Time OCR Practice",
      subtitle: "Latihan Menulis Goresan Kanji",
      desc: "Visualisasi animasi urutan goresan (stroke order) dan kanvas latihan menulis interaktif yang dilengkapi teknologi AI/OCR Tesseract untuk evaluasi akurasi tulisan tangan.",
      color: "bg-[#0D47A1]",
    },
    {
      step: "04",
      icon: <CheckSquare className="w-6 h-6 text-white" />,
      title: "6 Varian Kuis Evaluation Engine",
      subtitle: "Uji Pemahaman Multi-Dimensi",
      desc: "Mendukung 6 jenis evaluasi kuis interaktif: Pilihan Ganda, Isian Singkat, Menyusun Kata (Unscramble), Pasangan Kata (Matching), Pengelompokan Kategori (Grouping), dan Essay.",
      color: "bg-[#EC6C9A]",
    },
    {
      step: "05",
      icon: <FileText className="w-6 h-6 text-white" />,
      title: "Integrasi Penugasan & Feedback LMS",
      subtitle: "Kolaborasi Pengajar & Pembelajar",
      desc: "Fasilitas pengumpulan tugas dalam bentuk teks, tautan Drive/YouTube, maupun lampiran berkas, yang dapat dinilai langsung oleh dosen/pengajar beserta umpan balik tertulis.",
      color: "bg-[#0D47A1]",
    },
    {
      step: "06",
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      title: "Dynamic Reflection System",
      subtitle: "Penguatan Memori Jangka Panjang",
      desc: "Menyajikan 5 pertanyaan refleksi mandiri terstruktur untuk setiap kanji yang dipelajari guna melatih metakognisi dan retensi ingatan pembelajar.",
      color: "bg-[#EC6C9A]",
    },
  ];

  return (
    <div className="bg-slate-50 font-sans text-slate-800 min-h-screen flex flex-col overflow-x-hidden">
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

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                  item.path === "/about"
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#e3f2fd]/60 via-white to-slate-50 py-16 md:py-24 border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D47A1]/10 text-[#0D47A1] text-xs font-extrabold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-[#EC6C9A]" />
              <span>Platform Pembelajaran Kanji & Kosakata N4</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              Tentang <span className="text-[#0D47A1]">EduNihongo</span>{" "}
              <span className="text-[#EC6C9A] font-serif font-normal">(KanGraph)</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed">
              Solusi pembelajaran Kanji & Jukugo Bahasa Jepang tingkat <b>JLPT N4</b> dengan pendekatan <b>Graf Semantik Interaktif</b>, visualisasi pembongkaran kata, serta integrasi penugasan LMS terpadu.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={() => navigate("/module")}
                className="px-6 py-3 rounded-2xl bg-[#0D47A1] text-white font-bold text-sm hover:bg-[#0a3880] transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Mulai Belajar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/latihan")}
                className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Coba Latihan Kanji</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Apa Itu EduNihongo (Overview) */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EC6C9A]">
                <ShieldCheck className="w-4 h-4" />
                <span>Pengenalan Platform</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-snug">
                Menghubungkan Titik-Titik Kemahiran Kanji Jepang
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Selama ini, banyak pembelajar menghadapi kendala besar dalam menghafal kanji secara terpisah tanpa memahami relasi makna antar-karakter. <b>KanGraph</b> hadir untuk mengubah metode hafalan mati menjadi <b>pemahaman visual konseptual</b>.
              </p>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Dengan menghubungkan Kanji tunggal ke dalam <b>Jukugo (kata majemuk)</b> dan mengelompokkannya secara semantik, aplikasi ini membantu pembelajar memahami alasan logis di balik pembentukan setiap kata dalam Bahasa Jepang.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#e3f2fd]/40 border border-[#0D47A1]/10">
                  <div className="text-2xl font-black text-[#0D47A1]">100%</div>
                  <div className="text-xs text-slate-600 font-medium">Dynamic Data Architecture</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#fde8f0]/40 border border-[#EC6C9A]/10">
                  <div className="text-2xl font-black text-[#EC6C9A]">JLPT N4</div>
                  <div className="text-xs text-slate-600 font-medium">Fokus Tingkat Pembelajaran</div>
                </div>
              </div>
            </div>

            {/* Illustration / Feature Box */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-[#0D47A1] text-white shadow-xl space-y-6 relative overflow-hidden">
                {/* Background decorative element */}
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#EC6C9A]/20 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-serif font-black text-xl text-[#EC6C9A]">
                      漢
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">KanGraph Concept</h4>
                      <p className="text-[11px] text-slate-300">Semantic Graph Model</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    Aktif
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-slate-200">Contoh Pembongkaran Dual Sub-Jukugo:</div>
                  <div className="text-lg font-bold text-amber-300 font-mono">
                    原因究明 <span className="text-xs text-slate-300 font-sans font-normal">(げんいんきゅうめい)</span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-2">
                    <strong className="text-white">Sub-Jukugo 1:</strong> 原因 (げんいん) : penyebab <br />
                    <strong className="text-white">Sub-Jukugo 2:</strong> 究明 (きゅうめい) : menyelidiki hingga jelas <br />
                    <em className="text-slate-400">Hubungan Makna:</em> Menyelidiki hingga jelas faktor penyebab suatu masalah.
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Visualisasi hubungan antar-kanji tanpa keraguan logic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Integrasi otomatis backend Prisma & MySQL database</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section className="py-16 bg-slate-50 border-t border-b border-slate-200/60">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D47A1]">
              <Compass className="w-4 h-4" />
              <span>Arah & Tujuan Kami</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900">
              Visi & Misi KanGraph
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Berkomitmen menghadirkan ekosistem pembelajaran bahasa Jepang yang terstruktur dan bermakna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visi Card */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-[#0D47A1]/10 flex items-center justify-center text-[#0D47A1]">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Visi Utama</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Menjadi platform pembelajaran Kanji & Kosakata Bahasa Jepang berbasis graf semantik terdepan di Indonesia yang mengintegrasikan aspek visual, interaktif, kontekstual, dan evaluasi terpadu untuk efisiensi belajar maksimal.
              </p>
            </div>

            {/* Misi Card */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EC6C9A]/10 flex items-center justify-center text-[#EC6C9A]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Misi Platform</h3>
              <ul className="space-y-3 text-slate-600 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0D47A1] shrink-0 mt-0.5" />
                  <span><strong>Metodologi Graf Semantik:</strong> Menyajikan pembelajaran kanji secara kontekstual melalui pemetaan hubungan makna antar-kata.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0D47A1] shrink-0 mt-0.5" />
                  <span><strong>Pembelajaran Multi-Sensori:</strong> Menggabungkan visualisasi stroke goresan, audio TTS, kanvas OCR, kuis interaktif, dan pertanyaan refleksi.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0D47A1] shrink-0 mt-0.5" />
                  <span><strong>Fasilitasi LMS Terpadu:</strong> Memungkinkan pengajar mengelola modul, memberikan tugas, dan menilai hasil belajar peserta didik secara real-time.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Target Pengguna */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EC6C9A]">
              <Users className="w-4 h-4" />
              <span>Sasaran Pengguna</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900">
              Untuk Siapa Platform Ini Dirancang?
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              KanGraph dirancang untuk memenuhi kebutuhan berbagai tipe pengakses pembelajaran Bahasa Jepang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {targetUsers.map((user, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70 hover:border-[#0D47A1]/30 hover:bg-white transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-white shadow-xs border border-slate-100">
                      {user.icon}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#0D47A1]/10 text-[#0D47A1] text-[11px] font-bold">
                      {user.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 leading-snug">
                    {user.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {user.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Level Pembelajaran & Kurikulum N4 */}
      <section className="py-16 bg-gradient-to-br from-[#0D47A1] to-slate-900 text-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
              JLPT N4 Level Curriculum
            </span>
            <h2 className="text-2xl md:text-4xl font-black">
              Fokus Level Pembelajaran N4
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Materi disusun secara bertahap mulai dari kanji utama ujian hingga ratusan jukugo penyusun yang sering muncul dalam konteks kehidupan sehari-hari dan akademis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Modul 1 Box */}
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">Modul 1 Utama</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">6 Kanji Utama</span>
              </div>
              <h3 className="text-xl font-bold">Kanji Evaluasi & Ujian</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Berfokus pada kanji dasar yang berkaitan dengan ujian, pertanyaan, jawaban, dan nilai.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["試", "験", "問", "題", "答", "点"].map((k, i) => (
                  <span
                    key={i}
                    className="w-10 h-10 rounded-xl bg-white text-slate-900 font-serif font-extrabold text-lg flex items-center justify-center shadow-xs"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Modul 2 Box */}
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">Modul 2 Utama</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">Kanji Riset & Investigasi</span>
              </div>
              <h3 className="text-xl font-bold">Kanji Penelitian & Studi</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Berfokus pada kanji <span className="text-amber-300 font-bold">研</span> (mempelajari/mengasah) & <span className="text-amber-300 font-bold">究</span> (meneliti/menyelidiki hingga mendalam).
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["研", "究"].map((k, i) => (
                  <span
                    key={i}
                    className="w-10 h-10 rounded-xl bg-[#EC6C9A] text-white font-serif font-extrabold text-lg flex items-center justify-center shadow-xs"
                  >
                    {k}
                  </span>
                ))}
                <span className="px-3 py-2 rounded-xl bg-white/10 text-slate-200 text-xs font-medium flex items-center">
                  + Ratusan Jukugo & Kanji Penyusun (調査, 報告書, 原因究明, 研修旅行...)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Metode Pembelajaran */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D47A1]">
              <Sparkles className="w-4 h-4 text-[#EC6C9A]" />
              <span>Metodologi Pembelajaran</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900">
              6 Metode & Fitur Keunggulan
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Pendekatan ilmiah dan teknologis yang mempermudah pemahaman kanji secara menyeluruh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningMethods.map((m, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-[#0D47A1]/30 transition-all duration-300 shadow-xs hover:shadow-md space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl ${m.color} shadow-xs`}>
                      {m.icon}
                    </div>
                    <span className="text-2xl font-black text-slate-300 font-mono">
                      {m.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {m.title}
                    </h3>
                    <p className="text-[11px] font-bold text-[#0D47A1] mt-0.5">
                      {m.subtitle}
                    </p>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="py-12 bg-[#e3f2fd]/40 border-t border-b border-slate-200/60 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-3">
          <p className="text-lg md:text-xl font-medium text-slate-700 italic leading-relaxed">
            "Belajar kanji bukan hanya mengingat urutan goresan, melainkan memahami jaringan makna yang saling terhubung."
          </p>
          <div className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider">
            — Tim Pengembangan EduNihongo (KanGraph)
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <MusubiLogo size={36} showText textColor="text-white" />
          </div>
          <p className="text-xs text-slate-400">
            © 2026 KanGraph. All rights reserved. JLPT N4 Japanese Learning Platform.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <button onClick={() => navigate("/")} className="hover:text-[#EC6C9A] transition-all">
              Beranda
            </button>
            <button onClick={() => navigate("/module")} className="hover:text-[#EC6C9A] transition-all">
              Modul
            </button>
            <button onClick={() => navigate("/about")} className="hover:text-[#EC6C9A] font-bold text-white">
              Tentang
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
