import { Lock } from "lucide-react";
import type { ModuleCardProps } from "../../types";
import ProgressBar from "../Atom/ProgressBar";

const ModuleCard = ({
  title,
  difficulty,
  items,
  progress,
  color,
  badgeBg,
  badgeText,
  locked,
  buttonText,
  onButtonClick,
}: ModuleCardProps) => {
  return (
    <div
      className="bg-white/90 backdrop-blur-xl p-5 rounded-xl shadow-sm w-full border border-[#edeef0] border-l-4"
      style={{
        borderLeftColor: color,
      }}
    >
      <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
        <h3
          className="text-lg font-bold"
          style={{ color }}
        >
          {title}
        </h3>

        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-bold"
          style={{
            backgroundColor: badgeBg,
            color: badgeText,
          }}
        >
          {difficulty}
        </span>
      </div>

      {locked && (
        <>
          <p className="text-xs italic text-[#5c403f] mb-4">
            Kuasai Inti Kanji untuk membuka frasa
            kosakata kontekstual.
          </p>

          <ul className="space-y-3 opacity-40">
            {items.map((item) => (
              <li
                key={item.text}
                className="flex items-center gap-3 text-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {!locked && (
        <>
          <ul className="space-y-3 mb-4">
            {items.map((item) => (
              <li
                key={item.text}
                className={`flex items-center gap-3 text-sm ${
                  item.isLocked
                    ? "opacity-60 italic"
                    : ""
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.isCompleted
                      ? ""
                      : "bg-[#e4bdbc]"
                  }`}
                  style={{
                    backgroundColor: item.isCompleted
                      ? color
                      : undefined,
                  }}
                />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>

          {progress !== undefined && (
            <ProgressBar
              value={progress}
              color={color}
            />
          )}

          {buttonText && (
            <button
              onClick={onButtonClick}
              className="mt-4 w-full py-2 rounded-xl font-bold text-white"
              style={{
                backgroundColor: color,
              }}
            >
              {buttonText}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ModuleCard;