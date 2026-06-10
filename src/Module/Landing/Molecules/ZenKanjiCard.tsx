import React, { useState, useEffect } from "react";
import Icon from "../Atoms/Icon";
import Badge from "../Atoms/Badge";
import tts from "../../Common/Utility/tts";

interface KanjiItem {
  kanji: string;
  romaji: string;
  meaning: string;
  pronunciation: string;
  level: string;
  imageUrl: string;
}

const KANJI_DATASET: KanjiItem[] = [
  {
    kanji: "平和",
    romaji: "Heiwa",
    meaning: "Kedamaian • Peace",
    pronunciation: "へいわ",
    level: "Level N5",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80"
  },
  {
    kanji: "水",
    romaji: "Mizu",
    meaning: "Air • Water",
    pronunciation: "みず",
    level: "Level N5",
    imageUrl: "https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?auto=format&fit=crop&w=400&q=80"
  },
  {
    kanji: "山",
    romaji: "Yama",
    meaning: "Gunung • Mountain",
    pronunciation: "やま",
    level: "Level N5",
    imageUrl: "https://images.unsplash.com/photo-1491884662610-dfcd28f30ad0?auto=format&fit=crop&w=400&q=80"
  },
  {
    kanji: "川",
    romaji: "Kawa",
    meaning: "Sungai • River",
    pronunciation: "かわ",
    level: "Level N5",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80"
  },
  {
    kanji: "木",
    romaji: "Ki",
    meaning: "Pohon • Tree",
    pronunciation: "き",
    level: "Level N5",
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80"
  },
  {
    kanji: "日",
    romaji: "Hi",
    meaning: "Matahari • Sun / Day",
    pronunciation: "ひ",
    level: "Level N5",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
  },
  {
    kanji: "月",
    romaji: "Tsuki",
    meaning: "Bulan • Moon / Month",
    pronunciation: "つき",
    level: "Level N5",
    imageUrl: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=400&q=80"
  },
  {
    kanji: "花",
    romaji: "Hana",
    meaning: "Bunga • Flower",
    pronunciation: "はな",
    level: "Level N5",
    imageUrl: "https://images.unsplash.com/photo-1471899236350-e3016bf1e69e?auto=format&fit=crop&w=400&q=80"
  },
  {
    kanji: "風",
    romaji: "Kaze",
    meaning: "Angin • Wind",
    pronunciation: "かぜ",
    level: "Level N5",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80"
  },
  {
    kanji: "空",
    romaji: "Sora",
    meaning: "Langit • Sky",
    pronunciation: "そら",
    level: "Level N5",
    imageUrl: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&w=400&q=80"
  },
  {
    kanji: "海",
    romaji: "Umi",
    meaning: "Laut • Sea",
    pronunciation: "うみ",
    level: "Level N5",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"
  },
  {
    kanji: "森",
    romaji: "Mori",
    meaning: "Hutan • Forest",
    pronunciation: "もり",
    level: "Level N5",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80"
  }
];

const shuffleArray = (length: number): number[] => {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const ZenKanjiCard: React.FC = () => {
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const indices = shuffleArray(KANJI_DATASET.length);
    setShuffledIndices(indices);
    setCurrentIndex(0);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (shuffledIndices.length === 0) return;

    const intervalTime = 50; 
    const totalDuration = 6000; // 6 seconds per Kanji card
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + increment;
        
        // Start fading out 400ms before changing card (around 93% progress)
        if (nextProgress >= 93 && prev < 93) {
          setIsTransitioning(true);
        }

        if (nextProgress >= 100) {
          setCurrentIndex((prevIdx) => {
            const nextIdx = prevIdx + 1;
            if (nextIdx >= shuffledIndices.length) {
              const newIndices = shuffleArray(KANJI_DATASET.length);
              setShuffledIndices(newIndices);
              return 0;
            }
            return nextIdx;
          });
          setIsTransitioning(false);
          return 0;
        }
        return nextProgress;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [shuffledIndices]);

  const activeKanji = shuffledIndices.length > 0 
    ? KANJI_DATASET[shuffledIndices[currentIndex]] 
    : KANJI_DATASET[0];

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    tts.speak(activeKanji.pronunciation);
  };

  return (
    <div className="zen-card bg-surface-container-lowest p-10 rounded-[48px] w-full max-w-lg border border-outline-variant/30 rotate-3 hover:rotate-0 transition-all duration-700 ease-out select-none">
      <div 
        className={`transition-all duration-500 ease-in-out transform ${
          isTransitioning 
            ? "opacity-0 translate-y-4 scale-95 filter blur-sm" 
            : "opacity-100 translate-y-0 scale-100 filter blur-none"
        }`}
      >
        <div className="aspect-square bg-background rounded-[32px] overflow-hidden relative mb-8 shadow-inner">
          <img
            alt={activeKanji.meaning}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            src={activeKanji.imageUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <Badge className="text-on-secondary-container bg-secondary-fixed px-4 py-1 rounded-full">
                {activeKanji.level}
              </Badge>
              <h2 className="font-display-jp text-primary text-4xl mt-3 font-semibold">
                {activeKanji.kanji} ({activeKanji.romaji})
              </h2>
              <p className="text-on-surface-variant italic text-lg mt-1">
                {activeKanji.meaning}
              </p>
            </div>
            <button
              onClick={playAudio}
              aria-label="Play pronunciation"
              className="bg-surface-container-high p-4 rounded-full cursor-pointer hover:bg-secondary-container active:scale-90 transition-all shadow-sm focus:outline-none border-none flex items-center justify-center"
            >
              <Icon name="volume_up" className="text-primary block text-xl" />
            </button>
          </div>
          <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-secondary h-full rounded-full shadow-sm transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZenKanjiCard;
