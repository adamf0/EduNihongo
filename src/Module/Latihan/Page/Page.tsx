import React, { useRef, useState } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import DrawingCanvas, {
  type DrawingCanvasRef,
} from "../Component/Atoms/DrawingCanvas";
import Icon from "../../Common/Component/Icon";
// import { useNavigate } from "react-router-dom";
// import confetti from "canvas-confetti";
import KanjiStrokeVisualizer from "../../Module/Component/Atom/KanjiStrokeVisualizer";
import { createWorker, PSM } from "tesseract.js";
import KanjiAtlasFlow from "../../Module/Component/Atom/KanjiAtlasFlow";
import Breadcrumbs from "../Component/Atoms/Breadcrumbs";
import KanjiReadings from "../Component/Atoms/KanjiReadings";
import KanjiEtymology from "../Component/Atoms/KanjiEtymology";
import ExampleSentence from "../Component/Atoms/ExampleSentence";

const worker = await createWorker("jpn");

await worker.setParameters({
  tessedit_pageseg_mode: PSM.SINGLE_CHAR,
  tessedit_char_whitelist: "一二三四五六七八九十",
} as any);

export const LatihanPage: React.FC = () => {
  // const navigate = useNavigate();
  const canvasRef = useRef<DrawingCanvasRef>(null);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState("");
  console.log(result);

  const handleClear = () => {
    canvasRef.current?.clear();
    setResult("");
  };

  // const handleUndo = () => {
  //   canvasRef.current?.undo();
  // };

  const handleVerify = async () => {
    const image = canvasRef.current?.getImage();

    if (!image) return;

    try {
      setLoading(true);

      const {
        data: { text },
      } = await worker.recognize(image);

      setResult(text.trim());
      await worker.terminate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    {
      japanese: "正確な情報が必要です。",
      romaji: "Seikaku na jouhou ga hitsuyou desu.",
      translation: "Informasi yang akurat sangat diperlukan.",
    },
    {
      japanese: "インターネットで情報を集める。",
      romaji: "Intaanetto de jouhou wo atsumeru.",
      translation: "Kumpulkan informasi di internet.",
    },
  ];

  const etymologies = [
    {
      character: "情",
      romaji: "JOU • Perasaan, Keadaan",
      detail:
        '"keadaan" atau "perasaan" dari segala hal. Mencerminkan kenyataan atau esensi yang mendasari.',
    },
    {
      character: "報",
      romaji: "HOU • Laporan, Berita",
      detail:
        "Mengumumkan atau memberi imbalan. Tindakan menyampaikan atau mengembalikan berita.",
    },
  ];

  const initialRawNodes = [
    { id: "root", kanji: "情報", meaning: "INTI", isRoot: true, type: "root" },

    // Node Atas (Menggunakan parameter warna border-blue-500)
    {
      id: "top-1",
      kanji: "情",
      meaning: "Perasaan",
      type: "top",
      borderColor: "border-blue-500",
    },
    {
      id: "top-2",
      kanji: "報",
      meaning: "Laporan",
      type: "top",
      borderColor: "border-blue-500",
    },

    // Node Tengah/Pill (Menggunakan parameter warna border-green-500)
    {
      id: "bot-1",
      kanji: "感情",
      meaning: "Emosi",
      isPill: true,
      type: "bottom",
      borderColor: "border-green-500",
    },
    {
      id: "bot-2",
      kanji: "報告",
      meaning: "Laporan",
      isPill: true,
      type: "bottom",
      borderColor: "border-green-500",
    },

    // Node Paling Bawah / Sub-bottom
    {
      id: "sub-1",
      kanji: "愛着",
      meaning: "Keterikatan",
      type: "sub-bottom",
      parentPill: "bot-1",
    },
    {
      id: "sub-2",
      kanji: "理性を失う",
      meaning: "Hilang Akal",
      type: "sub-bottom",
      parentPill: "bot-1",
    },
    {
      id: "sub-3",
      kanji: "週報",
      meaning: "Laporan Mingguan",
      type: "sub-bottom",
      parentPill: "bot-2",
    },
    {
      id: "sub-4",
      kanji: "月報",
      meaning: "Laporan Bulanan",
      type: "sub-bottom",
      parentPill: "bot-2",
    },
    {
      id: "sub-5",
      kanji: "日報",
      meaning: "Laporan Harian",
      type: "sub-bottom",
      parentPill: "bot-1",
    },
    {
      id: "sub-6",
      kanji: "年報",
      meaning: "Laporan Tahunan",
      type: "sub-bottom",
      parentPill: "bot-2",
    },
  ];

  const initialRawEdges = [
    { id: "e-top1-root", source: "top-1", target: "root" },
    { id: "e-top2-root", source: "top-2", target: "root" },
    { id: "e-root-bot1", source: "root", target: "bot-1" },
    { id: "e-root-bot2", source: "root", target: "bot-2" },

    { id: "e-bot1-sub1", source: "bot-1", target: "sub-1" },
    { id: "e-bot1-sub2", source: "bot-1", target: "sub-2" },
    { id: "e-bot2-sub3", source: "bot-2", target: "sub-3" },
    { id: "e-bot2-sub4", source: "bot-2", target: "sub-4" },
    { id: "e-bot1-sub5", source: "bot-1", target: "sub-5" }, // Perbaikan source e-bot1
    { id: "e-bot2-sub6", source: "bot-2", target: "sub-6" },
  ];

  const playAudio = (textToSpeak) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "ja-JP"; 
    utterance.rate = 0.9; 
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <Layout>
      <div className="w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-md py-md select-none">
        {/* Background Texture */}
        <div className="absolute inset-0 seigaiha-bg pointer-events-none opacity-20 -z-10"></div>

        {/* Breadcrumbs */}
        <Breadcrumbs/>

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
                  84% Dikuasai
                </span>
              </div>

              <div className="flex flex-col items-center text-center py-16">
                <h2 className="font-display-kanji text-[72px] lg:text-[80px] text-on-surface mb-2 tracking-widest leading-none select-none">
                  情報
                </h2>
                <p className="font-headline-lg text-headline-lg text-on-surface-variant mb-6 font-light">
                  じょうほう • Jouhou (Core Kanji: 学)
                </p>

                <div className="flex flex-wrap-reverse items-center gap-4 mb-4">
                  <button
                    onClick={() => playAudio("情報")}
                    className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md cursor-pointer border-none"
                  >
                    <Icon name="volume_up" className="text-[32px] block" />
                  </button>
                  <div className="text-left">
                    <h3 className="font-headline-md text-headline-md text-primary font-semibold">
                      Informasi / Berita
                    </h3>
                    <p className="font-body-md text-on-surface-variant">
                      Info umum, data, atau ilmu belajar
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="mt-6">
                <div className="flex flex-wrap gap-2 justify-between items-end mb-2">
                  <span className="font-label-md text-on-surface-variant uppercase">
                    PROGRES PENGUASAAN
                  </span>
                  <span className="font-label-md text-tertiary font-bold">
                    Tingkat Emas
                  </span>
                </div>
                <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tertiary-fixed-dim rounded-full transition-all duration-500"
                    style={{ width: "84%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Onyomi / Kunyomi Details */}
            <KanjiReadings />

            {/* Context sentences list */}
            <div className="space-y-4">
              <h4 className="font-headline-md text-headline-md text-on-surface font-semibold px-2">
                Contoh Penggunaan
              </h4>
              <div className="space-y-4">
                {examples.map((item, idx) => (
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
                <KanjiStrokeVisualizer kanji="漢" />

                {/* Drawing pad component */}
                <div className="flex-grow flex flex-col h-64 h-[400px]">
                  <div className="relative bg-white rounded-lg border-2 border-primary/20 flex-grow japanese-texture aspect-video sm:aspect-auto">
                    <DrawingCanvas
                      ref={canvasRef}
                      strokeColor="#2D486D"
                      lineWidth={5}
                    />

                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                      <button
                        onClick={handleClear}
                        className="w-10 h-10 bg-surface-container-lowest border border-outline-variant/30 rounded-full shadow-md flex items-center justify-center hover:bg-error hover:text-white transition-all cursor-pointer"
                        title="Clear pad"
                      >
                        <Icon name="delete" className="block text-xl" />
                      </button>
                      <button
                        onClick={handleClear}
                        className="w-10 h-10 bg-surface-container-lowest border border-outline-variant/30 rounded-full shadow-md flex items-center justify-center hover:bg-japanese-indigo hover:text-white transition-all cursor-pointer"
                        title="Undo"
                      >
                        <Icon name="undo" className="block text-xl" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleVerify}
                      disabled={loading}
                      className="bg-primary text-white px-8 py-3 rounded-full"
                    >
                      {loading ? "Menganalisa..." : "Cek Akurasi"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Semantic Relationship Network Graph */}
            <div className="bg-surface rounded-xl p-md soft-shadow border border-surface-container overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Grafik Semantik
                </h4>
                <Icon
                  name="info"
                  className="text-on-surface-variant cursor-help block text-xl"
                />
              </div>

              <div className="relative h-80 w-full flex items-center justify-center bg-surface-container-low/30 rounded-xl overflow-hidden">
                <KanjiAtlasFlow
                  initialRawEdges={initialRawEdges}
                  initialRawNodes={initialRawNodes}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LatihanPage;
