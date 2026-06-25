import { useEffect, useState } from "react";
import { KanjiVG } from "kanjivg-js";
import { KanjiCard } from "kanjivg-js/react";

interface Props {
  kanji: string;
}

const kv = new KanjiVG();

const KanjiStrokeVisualizer = ({ kanji }: Props) => {
  const [kanjiData, setKanjiData] = useState<any>(null);

  useEffect(() => {
    const loadKanji = async () => {
      const result = await kv.getKanji(kanji);

      if (result.length > 0) {
        setKanjiData(result[0]);
      }
    };

    loadKanji();
  }, [kanji]);

  if (!kanjiData) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        Loading...
      </div>
    );
  }

  return (
    <KanjiCard
      kanji={kanjiData}
      infoPanel={{
        showInfo: false,
      }}
      animationOptions={{
        strokeSpeed: 1200,
        strokeDelay: 500,
        showNumbers: true,
        showTrace: true,
        loop: true,
        traceStyling: {
          traceColour: "#000",
          traceThickness: 1,
          traceRadius: 1,
        },
        numberStyling: {
          fontColour: "#000",
          fontWeight: 300,
          fontSize: 10,
        },
        strokeStyling: {
          strokeColour: "#8f0020",
          strokeThickness: 2,
          strokeRadius: 0,
        },
      }}
    />
  );
};

export default KanjiStrokeVisualizer;
