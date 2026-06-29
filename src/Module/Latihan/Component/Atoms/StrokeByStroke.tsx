import { useEffect, useState } from "react";
import { KanjiVG, type StrokeData } from "kanjivg-js";
import Icon from "../../../Common/Component/Icon";

interface Props {
  kanji: string;
}

const kv = new KanjiVG();

export const StrokeByStroke = ({ kanji }: Props) => {
  const [strokes, setStrokes] = useState<StrokeData[]>([]);

  useEffect(() => {
    const loadStrokes = async () => {
      try {
        const result = await kv.getKanji(kanji);
        if (result && result.length > 0) {
          setStrokes(result[0].strokes);
        }
      } catch (e) {
        console.error("Failed to load strokes for Stroke-by-Stroke order:", e);
      }
    };
    loadStrokes();
  }, [kanji]);

  if (strokes.length === 0) return null;

  return (
    <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-sm">
      <h3 className="font-headline-md text-on-surface font-semibold flex items-center gap-2 select-none">
        <Icon name="format_list_numbered" className="text-primary text-xl block" />
        Stroke-by-Stroke Order
      </h3>
      <div className="flex flex-wrap gap-sm mt-xs">
        {strokes.map((_, idx) => {
          return (
            <div key={idx} className="flex flex-col items-center gap-1 bg-surface-container-low p-2 rounded-lg border border-outline-variant/20 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 select-none">Goresan {idx + 1}</span>
              <svg viewBox="0 0 109 109" className="w-14 h-14 text-slate-700">
                {/* Draw previous strokes in faint gray */}
                {strokes.slice(0, idx).map((stroke) => (
                  <path
                    key={stroke.strokeNumber}
                    d={stroke.path}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {/* Draw the current stroke in highlighted red */}
                <path
                  d={strokes[idx].path}
                  fill="none"
                  stroke="#8f0020"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StrokeByStroke;
