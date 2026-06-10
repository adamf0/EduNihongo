import React, { useState } from "react";
import confetti from "canvas-confetti";
import Sidebar from "../../Common/Component/Sidebar";
import MobileHeader from "../Organism/MobileHeader";
import HeaderBlock from "../Organism/HeaderBlock";
import InfoCard from "../Organism/InfoCard";
import MnemonicBox from "../Molecules/MnemonicBox";
import CanvasPractice from "../Organism/CanvasPractice";
import QuizCard from "../Organism/QuizCard";
import BottomNav from "../Organism/BottomNav";

export const Page: React.FC = () => {
  const kanjiData = {
    kanji: "水",
    meaning: "Air",
    jlptText: "JLPT N5",
    levelText: "Level 1",
    onyomiJp: "スイ",
    onyomiRomaji: "Sui",
    kunyomiJp: "みず",
    kunyomiRomaji: "Mizu",
    definition: "Sesuatu yang cair dan jernih. Merujuk pada air secara umum.",
    radicalChar: "水",
    radicalName: "Air (Shui)",
    pronounceText: "みず",
    mnemonicHtml:
      'Karakter ini terlihat seperti <span class="font-bold border-b-2 border-on-secondary-fixed">aliran sungai</span> yang mengalir di antara bebatuan di tengah hutan.',
    strokes: ["亅", "フ", "丿", "乀"],
  };

  const breadcrumbs = [
    { label: "Kanji", href: "#" },
    { label: "Level 1", href: "#" },
    { label: "水 (Air)", isCurrent: true },
  ];

  const [quizAccuracy, setQuizAccuracy] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string>(
    "Klik tombol mikrofon dan ucapkan lafal Kanji untuk menguji kemiripan."
  );

  const handleSavePractice = (accuracyScore: number) => {
    console.log("Goresan disimpan dengan akurasi:", accuracyScore);
  };

  const computeStringSimilarity = (s1: string, s2: string): number => {
    const clean = (str: string) => str.toLowerCase().trim().replace(/[\s.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    const a = clean(s1);
    const b = clean(s2);
    if (a === b) return 100;
    if (!a || !b) return 0;

    const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
      Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1, // deletion
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j - 1] + 1 // substitution
          );
        }
      }
    }

    const distance = matrix[a.length][b.length];
    const maxLength = Math.max(a.length, b.length);
    return Math.round(((maxLength - distance) / maxLength) * 100);
  };

  const handleQuizSubmit = (recordedText: string) => {
    const targets = [
      kanjiData.kanji,
      kanjiData.pronounceText,
      kanjiData.onyomiJp,
      kanjiData.kunyomiJp,
    ];
    let maxSim = 0;
    targets.forEach((target) => {
      const sim = computeStringSimilarity(recordedText, target);
      if (sim > maxSim) {
        maxSim = sim;
      }
    });

    setQuizAccuracy(maxSim);
    
    let feedback = "";
    if (maxSim >= 90) {
      feedback = `Lafal luar biasa! Terbaca "${recordedText}".`;
    } else if (maxSim >= 75) {
      feedback = `Lafal cukup bagus! Terbaca "${recordedText}". Coba artikulasikan lebih jelas.`;
    } else {
      feedback = `Lafal kurang mirip (Terbaca "${recordedText}"). Coba lafalkan "${kanjiData.pronounceText}".`;
    }
    setQuizFeedback(feedback);

    if (maxSim >= 75) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-body">
      {/* Sidebar (Desktop) */}
      <Sidebar activeRoute="kanji" />

      {/* Mobile Header */}
      <MobileHeader userInitials="JD" streakText="🔥 12 Hari" />

      {/* Main Content Area */}
      <main className="pt-16 md:pt-0 md:pl-20 lg:pl-64 min-h-screen flex flex-col flex-grow">
        {/* Header Block / Breadcrumbs */}
        <HeaderBlock
          kanji={kanjiData.kanji}
          meaning={kanjiData.meaning}
          jlptText={kanjiData.jlptText}
          levelText={kanjiData.levelText}
          breadcrumbItems={breadcrumbs}
        />

        {/* Content body wrapper */}
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 w-full flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left main info column */}
            <div className="lg:col-span-8 space-y-8">
              <InfoCard
                onyomiTextJp={kanjiData.onyomiJp}
                onyomiTextRomaji={kanjiData.onyomiRomaji}
                kunyomiTextJp={kanjiData.kunyomiJp}
                kunyomiTextRomaji={kanjiData.kunyomiRomaji}
                definitionText={kanjiData.definition}
                radicalChar={kanjiData.radicalChar}
                radicalName={kanjiData.radicalName}
                pronounceText={kanjiData.pronounceText}
              />
              
              <MnemonicBox htmlContent={kanjiData.mnemonicHtml} />

              <CanvasPractice
                kanjiChar={kanjiData.kanji}
                strokes={kanjiData.strokes}
                onSavePractice={handleSavePractice}
              />
            </div>

            {/* Right side column */}
            <div className="lg:col-span-4 space-y-8">
              <QuizCard
                kanjiChar={kanjiData.kanji}
                pronounceText={kanjiData.pronounceText}
                accuracyPercentage={quizAccuracy}
                feedbackText={quizFeedback}
                onSubmitAnswer={handleQuizSubmit}
              />
              
            </div>
          </div>
        </div>

        {/* Spacing for mobile nav */}
        <div className="h-20 md:hidden"></div>

        {/* Sticky Mobile Bottom Navigation */}
        <BottomNav activeRoute="kanji" />
      </main>
    </div>
  );
};

export default Page;
