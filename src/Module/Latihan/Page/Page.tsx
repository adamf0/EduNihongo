import React, { useRef, useState, useEffect } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import DrawingCanvas, {
  type DrawingCanvasRef,
} from "../Component/Atoms/DrawingCanvas";
import Icon from "../../Common/Component/Icon";
import { useNavigate, useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";
import KanjiStrokeVisualizer from "../../Module/Component/Atom/KanjiStrokeVisualizer";
import { createWorker, PSM } from "tesseract.js";
import KanjiAtlasFlow from "../../Module/Component/Atom/KanjiAtlasFlow";
import Breadcrumbs from "../Component/Atoms/Breadcrumbs";

import KanjiEtymology from "../Component/Atoms/KanjiEtymology";
import ExampleSentence from "../Component/Atoms/ExampleSentence";
import { api } from "../../Common/Utility/api";
import StrokeByStroke from "../Component/Atoms/StrokeByStroke";

const worker = await createWorker("jpn");

await worker.setParameters({
  tessedit_pageseg_mode: PSM.SINGLE_CHAR,
  tessedit_char_whitelist: "一二三四五六七八九十",
} as any);

export const LatihanPage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<DrawingCanvasRef>(null);

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [kanjiData, setKanjiData] = useState<any>(null);
  const [verification, setVerificationInfo] = useState<any | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const [searchParams] = useSearchParams();
  const charParam = searchParams.get("char") || "情報";

  useEffect(() => {
    const fetchKanji = async () => {
      try {
        setLoading(true);
        const data = await api.latihan.get(charParam);
        setKanjiData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal memuat detail latihan.");
        if (err.message?.includes("Token") || err.message?.includes("Akses ditolak")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchKanji();
  }, [navigate, charParam]);

  const handleClear = () => {
    canvasRef.current?.clear();
    setVerificationInfo(null);
  };

  const handleVerify = async () => {
    if (!canvasRef.current || !kanjiData) return;
    
    setVerifying(true);
    setVerificationInfo(null);

    // 1. Run local Stroke Order validation
    const validation = canvasRef.current.validateStrokeOrder();

    if (!validation) {
      setVerificationInfo({
        stars: 0,
        accuracy: 0,
        correctCount: 0,
        totalStrokes: 0,
        incorrectStrokes: [],
        feedbackMessage: "Gagal menganalisa goresan. Silakan coba lagi.",
        infoText: "",
        backendMessage: "Validasi gagal dijalankan",
        isSaved: false
      });
      setVerifying(false);
      return;
    }

    // 2. Grade stars based on accuracy (similar to writejapanese.com)
    let stars = 1;
    if (validation.accuracy >= 90) stars = 5;
    else if (validation.accuracy >= 75) stars = 4;
    else if (validation.accuracy >= 60) stars = 3;
    else if (validation.accuracy >= 40) stars = 2;

    let feedbackMessage = "";
    if (stars === 5) {
      feedbackMessage = "Sempurna! Urutan dan arah goresan Anda sangat akurat.";
    } else if (stars === 4) {
      feedbackMessage = "Sangat bagus! Coretan ditulis dengan urutan yang benar.";
    } else if (stars === 3) {
      feedbackMessage = "Kerja bagus! Tulisan Anda sudah cukup baik.";
    } else if (stars === 2) {
      feedbackMessage = "Coba lagi! Perhatikan urutan goresan yang salah.";
    } else {
      feedbackMessage = "Periksa kembali jumlah goresan dan arah penulisan Anda.";
    }

    const infoText = `Akurasi: ${validation.accuracy}%. Goresan benar: ${validation.correctCount}/${validation.totalStrokes}.${
      validation.incorrectStrokes.length > 0
        ? ` Goresan salah pada urutan ke: ${validation.incorrectStrokes.join(", ")}.`
        : ""
    }`;

    // Threshold to submit progress is 45% (matches writejapanese.com threshold n = 0.45)
    if (validation.accuracy >= 45) {
      try {
        // Call backend verify endpoint to sync mastery percent to accuracy score
        const response = await api.latihan.verify(kanjiData.kanji, validation.accuracy);
        setVerificationInfo({
          stars,
          accuracy: validation.accuracy,
          correctCount: validation.correctCount,
          totalStrokes: validation.totalStrokes,
          incorrectStrokes: validation.incorrectStrokes,
          feedbackMessage,
          infoText,
          backendMessage: response.message,
          isSaved: true
        });
        
        if (stars >= 4) {
          confetti();
        }
        
        // Reload kanji data to update mastery percent in UI
        const updatedData = await api.latihan.get(kanjiData.kanji);
        setKanjiData(updatedData);
      } catch (err: any) {
        setVerificationInfo({
          stars,
          accuracy: validation.accuracy,
          correctCount: validation.correctCount,
          totalStrokes: validation.totalStrokes,
          incorrectStrokes: validation.incorrectStrokes,
          feedbackMessage,
          infoText,
          backendMessage: `Gagal menyimpan progress: ${err.message}`,
          isSaved: false
        });
      }
    } else {
      setVerificationInfo({
        stars,
        accuracy: validation.accuracy,
        correctCount: validation.correctCount,
        totalStrokes: validation.totalStrokes,
        incorrectStrokes: validation.incorrectStrokes,
        feedbackMessage,
        infoText,
        backendMessage: "Urutan goresan belum sesuai target (min. 45%). Progres belum disimpan.",
        isSaved: false
      });
    }

    setVerifying(false);
  };

  const playAudio = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech Synthesis not supported in this browser.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-[#8f0020] font-bold animate-pulse text-lg">Memuat detail latihan...</div>
        </div>
      </Layout>
    );
  }

  if (error || !kanjiData) {
    return (
      <Layout>
        <div className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6">
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-bold">
            {error || "Karakter tidak ditemukan"}
            <button 
              onClick={() => window.location.reload()} 
              className="block mx-auto mt-4 px-6 py-2 bg-[#8f0020] text-white rounded-full text-sm font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const {
    kanji,
    romaji: kanjiRomaji,
    meaning: kanjiMeaning,
    masteryPercent,
    examples,
    jukugos = [],
    etymologies,
    graph
  } = kanjiData;

  return (
    <Layout>
      <div className="w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-md py-md select-none">
        {/* Background Texture */}
        <div className="absolute inset-0 seigaiha-bg pointer-events-none opacity-20 -z-10"></div>

        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Dasbor", path: "/dashboard" },
            { label: "Kanji & Kosakata", path: "/module" },
            { label: `Detail & Latihan: ${kanji} (${kanjiData.moduleTitle || "Kanji"})` }
          ]}
        />

        {/* Combined Details and Drawing Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
          {/* Left Column: Kanji/Vocab Details + Examples + Etymology */}
          <div className="lg:col-span-6 space-y-8">
            {/* Primary Kanji Card display */}
            <div className="bg-surface-container-lowest seigaiha-pattern p-lg rounded-xl soft-shadow border border-surface-container relative overflow-hidden">
              <div className="absolute top-0 right-0 p-md flex flex-col items-end gap-2">
                <span className="px-4 py-1 bg-secondary text-on-secondary rounded-full font-label-md font-bold">
                  Modul 1
                </span>
                <span className="px-3 py-1 bg-matcha-container text-matcha-green rounded-full font-label-md font-bold">
                  {masteryPercent}% Dikuasai
                </span>
              </div>

              <div className="flex flex-col items-center text-center py-16">
                <h2 className="font-display-kanji text-[72px] lg:text-[80px] text-on-surface mb-2 tracking-widest leading-none select-none">
                  {kanji}
                </h2>
                <p className="font-headline-lg text-headline-lg text-on-surface-variant mb-6 font-light">
                  {kanjiRomaji}
                </p>

                <div className="flex flex-wrap-reverse items-center gap-4 mb-4">
                  <button
                    onClick={() => playAudio(kanji)}
                    className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md cursor-pointer border-none"
                  >
                    <Icon name="volume_up" className="text-[32px] block" />
                  </button>
                  <div className="text-left">
                    <h3 className="font-headline-md text-headline-md text-primary font-semibold">
                      {kanjiMeaning}
                    </h3>
                    <p className="font-body-md text-on-surface-variant">
                      Kamus kosakata interaktif tingkat {kanjiData.difficulty || "N4"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Jukugo List */}
            <div className="space-y-4">
              <h4 className="font-headline-md text-headline-md text-on-surface font-semibold px-2 flex items-center gap-2">
                <Icon name="translate" className="text-[#8f0020] text-2xl animate-pulse" />
                Daftar Jukugo (Kata Majemuk)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jukugos.map((j: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display-kanji text-2xl font-bold text-slate-800 tracking-wide select-all">
                          {j.word}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          ({j.reading})
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[#8f0020]">
                        {j.meaning}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => playAudio(j.word)}
                      className="w-10 h-10 rounded-full bg-slate-50 hover:bg-[#8f0020]/10 text-slate-500 hover:text-[#8f0020] flex items-center justify-center transition-colors cursor-pointer border-none"
                      title="Putar Suara"
                    >
                      <Icon name="volume_up" className="text-xl" />
                    </button>
                  </div>
                ))}
                {jukugos.length === 0 && (
                  <p className="text-sm text-slate-400 italic px-2">Belum ada jukugo yang ditambahkan untuk kanji ini.</p>
                )}
              </div>
            </div>

            {/* Context sentences list */}
            <div className="space-y-4">
              <h4 className="font-headline-md text-headline-md text-on-surface font-semibold px-2">
                Contoh Penggunaan
              </h4>
              <div className="space-y-4">
                {examples.map((item: any, idx: number) => (
                  <ExampleSentence
                    key={idx}
                    japanese={item.japanese}
                    romaji={item.romaji}
                    translation={item.translation}
                  />
                ))}
              </div>
            </div>

            {/* Composite Kanji Etymology Breakdown */}
            <KanjiEtymology etymologies={etymologies}/>
          </div>

          {/* Right Column: Writing Canvas + Semantic Graph */}
          <div className="lg:col-span-6 space-y-8">
            {/* Interactive Writing Card */}
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant flex flex-col">
              <div className="flex justify-between items-center mb-md">
                <h2 className="font-headline-md text-on-surface flex items-center gap-2 font-semibold">
                  <Icon
                    name="edit_note"
                    className="text-primary block text-2xl"
                  />
                  Latihan Menulis
                </h2>
              </div>

              <div className="flex flex-col gap-md">
                {/* Stroke Visualizer (SVG animated) */}
                <KanjiStrokeVisualizer kanji={kanji.charAt(0)} />

                {/* Drawing pad component */}
                <div className="flex-grow flex flex-col sm:flex-row items-center justify-center gap-md w-full">
                  <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-sm w-full max-w-[400px] aspect-square overflow-hidden flex-shrink-0">
                    <DrawingCanvas
                      ref={canvasRef}
                      strokeColor="#0f172a"
                      lineWidth={8.5}
                      kanji={kanji.charAt(0)}
                      showGuide={showGuide}
                    />
                  </div>

                  <div className="flex flex-row sm:flex-col gap-2 z-20">
                    <button
                      onClick={handleClear}
                      className="w-12 h-12 bg-white border border-slate-200 text-slate-600 rounded-full shadow-md flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all cursor-pointer"
                      title="Clear pad"
                    >
                      <Icon name="delete" className="block text-2xl" />
                    </button>
                    <button
                      onClick={handleUndo}
                      className="w-12 h-12 bg-white border border-slate-200 text-slate-600 rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
                      title="Undo"
                    >
                      <Icon name="undo" className="block text-2xl" />
                    </button>
                    <button
                      onClick={() => setShowGuide(!showGuide)}
                      className={`w-12 h-12 border rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer ${showGuide ? 'bg-primary border-primary text-white hover:brightness-110' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      title={showGuide ? "Sembunyikan panduan" : "Tampilkan panduan"}
                    >
                      <Icon name={showGuide ? "visibility" : "visibility_off"} className="block text-2xl" />
                    </button>
                  </div>
                </div>

                  {verifying && (
                    <div className="mt-md p-md bg-surface-container-low rounded-xl border border-outline-variant/30 text-center font-label-md text-on-surface flex items-center justify-center gap-2 select-none">
                      <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Menganalisa goresan & urutan menulis...
                    </div>
                  )}

                  {verification && !verifying && (
                    <div className="mt-md p-md bg-surface-container-low rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-md text-left select-text">
                      {/* Title & Stars */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-sm">
                        <span className="font-title-md text-on-surface font-semibold">
                          Hasil Akurasi Goresan
                        </span>
                        {/* Rating Stars */}
                        <div className="flex gap-1 text-2xl select-none">
                          {Array.from({ length: 5 }, (_, idx) => {
                            const isFilled = idx < verification.stars;
                            return (
                              <span 
                                key={idx} 
                                className={`${isFilled ? "text-amber-500 drop-shadow-md animate-pulse" : "text-slate-300"}`}
                              >
                                ★
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Main Message */}
                      <div className="text-on-surface font-semibold text-sm leading-relaxed">
                        {verification.feedbackMessage}
                      </div>

                      {/* Accuracy Progress Bar */}
                      <div className="flex flex-col gap-xs">
                        <div className="flex justify-between text-xs font-semibold text-slate-500">
                          <span>Akurasi Goresan</span>
                          <span>{verification.accuracy}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              verification.accuracy >= 80 ? "bg-emerald-500" :
                              verification.accuracy >= 60 ? "bg-blue-500" :
                              verification.accuracy >= 45 ? "bg-amber-500" : "bg-rose-500"
                            }`}
                            style={{ width: `${verification.accuracy}%` }}
                          />
                        </div>
                      </div>

                      {/* Stroke Breakdown (Visual Grid) */}
                      <div className="flex flex-col gap-xs mt-xs">
                        <span className="text-xs font-semibold text-slate-500">Detail Status Goresan:</span>
                        <div className="flex flex-wrap gap-xs mt-1">
                          {Array.from({ length: verification.totalStrokes }, (_, idx) => {
                            const strokeNum = idx + 1;
                            const isIncorrect = verification.incorrectStrokes.includes(strokeNum);
                            return (
                              <div 
                                key={strokeNum} 
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                                  isIncorrect 
                                    ? "bg-rose-50 border-rose-200 text-rose-700" 
                                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                                }`}
                                title={`Goresan ${strokeNum}: ${isIncorrect ? "Salah/Kurang Akurat" : "Benar"}`}
                              >
                                {strokeNum}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Backend Save Banner */}
                      {verification.backendMessage && (
                        <div className={`p-sm rounded-lg flex items-start gap-2 border text-xs font-semibold mt-xs ${
                          verification.isSaved 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                            : "bg-rose-50 border-rose-100 text-rose-800"
                        }`}>
                          <Icon 
                            name={verification.isSaved ? "check_circle" : "info"} 
                            className={`text-lg ${verification.isSaved ? "text-emerald-600" : "text-rose-600"}`} 
                          />
                          <div className="flex-1 leading-normal">
                            {verification.backendMessage}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleVerify}
                      disabled={verifying}
                      className="bg-primary text-white px-8 py-3 rounded-full hover:brightness-110 active:scale-95 transition-all cursor-pointer font-bold border-none"
                    >
                      {verifying ? "Menganalisa..." : "Cek Akurasi"}
                    </button>
                  </div>
                </div>
              </div>

            {/* Stroke-by-Stroke Order */}
            <StrokeByStroke kanji={kanji.charAt(0)} />

            {/* Semantic Relationship Network Graph */}
            <div className="bg-surface rounded-xl p-md soft-shadow border border-surface-container overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Grafik Semantik
                </h4>
                <button
                  type="button"
                  onClick={() => setShowInfoModal(true)}
                  className="p-1 hover:bg-slate-100 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center transition-all"
                  title="Tampilkan Informasi Grafik Semantik"
                >
                  <Icon
                    name="info"
                    className="text-on-surface-variant text-xl"
                  />
                </button>
              </div>

              {/* Semantic Graph Info Modal */}
              {showInfoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-fade-in">
                  <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl max-w-[500px] w-full p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                        <Icon name="info" />
                        Petunjuk Grafik Semantik
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowInfoModal(false)}
                        className="p-1 hover:bg-slate-100 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center"
                      >
                        <Icon name="close" className="text-slate-400" />
                      </button>
                    </div>

                    <div className="text-sm text-slate-600 space-y-4 text-left">
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">Apa itu Grafik Semantik?</h4>
                        <p>
                          Peta visual interaktif yang menggambarkan relasi etimologis dan pembentukan kata gabungan (Jukugo) dari Kanji yang sedang dipelajari.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">Arti Warna Simpul (Node):</h4>
                        <ul className="space-y-2 mt-2">
                          <li className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-dashed border-red-500 rounded-md shrink-0 bg-white"></span>
                            <span><strong>ROOT (Garis Putus Merah)</strong>: Simpul Kanji utama/inti yang sedang dipelajari.</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-blue-500 rounded-md shrink-0 bg-white"></span>
                            <span><strong>TOP (Biru)</strong>: Karakter radikal pembentuk bagian atas dari kanji utama.</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-emerald-500 rounded-md shrink-0 bg-white"></span>
                            <span><strong>BOTTOM (Hijau)</strong>: Kata gabungan Jukugo (kosakata) tingkat pertama.</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border border-amber-500 rounded-md shrink-0 bg-amber-50"></span>
                            <span><strong>SUB-BOTTOM (Kuning / Oranye)</strong>: Kosakata turunan lebih lanjut dari kata gabungan di atasnya.</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">Manfaat Pembelajaran:</h4>
                        <p>
                          Membantu Anda membangun pemetaan kosakata secara asosiatif dan terintegrasi untuk memperkuat ingatan visual secara jangka panjang.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowInfoModal(false)}
                        className="px-5 py-2 bg-primary text-on-primary font-bold rounded-lg border-none hover:brightness-110 active:scale-95 transition-all cursor-pointer text-sm"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative h-80 w-full flex items-center justify-center bg-surface-container-low/30 rounded-xl overflow-hidden">
                {graph && graph.nodes && graph.nodes.length > 0 && (
                  <KanjiAtlasFlow
                    initialRawEdges={graph.edges}
                    initialRawNodes={graph.nodes}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LatihanPage;
