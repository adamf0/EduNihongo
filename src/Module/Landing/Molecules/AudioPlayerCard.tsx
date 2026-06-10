import React, { useEffect, useState } from "react";
import tts from "../../Common/Utility/tts";
import Icon from "../Atoms/Icon";

const TOTAL_DURATION = 6;

export const AudioPlayerCard: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const progress = (currentTime / TOTAL_DURATION) * 100;

  const togglePlayback = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (isPlaying) {
      setIsPlaying(false);

      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }

      setCurrentTime(0);
      return;
    }

    setCurrentTime(0);
    setIsPlaying(true);

    tts.speak(
      "こんにちは、日本語を勉強しましょう。",
      () => {
        setIsPlaying(false);
        setCurrentTime(TOTAL_DURATION);
      }
    );
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;

        if (next >= TOTAL_DURATION) {
          clearInterval(interval);
          return TOTAL_DURATION;
        }

        return next;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    return `0:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="md:col-span-4 zen-card text-white bg-primary-container p-10 rounded-[32px] overflow-hidden relative group">
      <div className="relative z-10 flex flex-col h-full justify-between space-y-8">
        <div className="space-y-6">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Icon
              name="record_voice_over"
              className="text-white text-3xl block"
            />
          </div>

          <div>
            <h3 className="font-headline-lg-mobile text-2xl mb-4 text-white">
              Native Audio
            </h3>

            <p className="text-on-primary/80 text-base leading-relaxed">
              Dengarkan pelafalan asli dari penutur Jepang dengan kualitas
              studio untuk melatih aksen dan intonasi Anda.
            </p>
          </div>
        </div>

        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/10 mt-auto group-hover:bg-white/20 transition-all">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayback}
              type="button"
              aria-label={
                isPlaying
                  ? "Pause audio"
                  : "Play audio"
              }
              className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform focus:outline-none"
            >
              <Icon
                name={
                  isPlaying
                    ? "pause"
                    : "play_arrow"
                }
                className="text-on-secondary-container text-2xl block"
              />
            </button>

            <div className="flex-1 space-y-2">
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary-container rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-bold opacity-70">
                <span>
                  {formatTime(currentTime)}
                </span>

                <span>
                  {formatTime(TOTAL_DURATION)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-secondary/30 rounded-full blur-[100px] opacity-40" />
    </div>
  );
};

export default AudioPlayerCard;