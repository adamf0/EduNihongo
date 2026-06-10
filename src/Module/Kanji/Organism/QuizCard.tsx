import React, { useState, useEffect, useRef } from "react";
import Icon from "../Atoms/Icon";

interface QuizCardProps {
  kanjiChar: string;
  pronounceText: string;
  accuracyPercentage: number;
  feedbackText: string;
  onSubmitAnswer?: (recordedText: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  kanjiChar,
  pronounceText,
  accuracyPercentage,
  feedbackText,
  onSubmitAnswer,
}) => {
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(accuracyPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [accuracyPercentage]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "ja-JP"; // speech recognition in Japanese

      rec.onstart = () => {
        setIsRecording(true);
        setRecordedText("");
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setRecordedText(transcript);
          if (onSubmitAnswer) {
            onSubmitAnswer(transcript);
          }
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [onSubmitAnswer]);

  const toggleRecording = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rec = recognitionRef.current;
    if (!rec) {
      alert("Browser Anda tidak mendukung fitur Perekaman Suara (Speech Recognition).");
      return;
    }

    if (isRecording) {
      rec.stop();
    } else {
      try {
        rec.start();
      } catch (err) {
        rec.stop();
      }
    }
  };

  return (
    <section className="bg-surface-container-low rounded-xl p-8 custom-shadow border-2 border-dashed border-outline sticky top-6">
      <div className="text-center space-y-4 mb-8 select-none">
        <h4 className="font-headline-lg-mobile text-primary text-on-surface">Kuis Mandiri</h4>
        <p className="text-sm text-on-surface-variant">
          Tekan tombol mikrofon, ucapkan pelafalan kanji di bawah, lalu lihat akurasi pengucapan Anda secara langsung.
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <button
            onClick={toggleRecording}
            title={isRecording ? "Hentikan Perekaman" : "Mulai Perekaman Suara"}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group cursor-pointer focus:outline-none border-none ${
              isRecording 
                ? "bg-red-600 text-white animate-pulse scale-105" 
                : "bg-primary text-white hover:scale-105 active:scale-95"
            }`}
          >
            {isRecording ? (
              <Icon name="mic_off" className="text-5xl block text-white" />
            ) : (
              <Icon name="mic" className="text-5xl block text-white" />
            )}
          </button>
          
          {isRecording && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          )}
        </div>

        <div className="text-center space-y-1 select-none">
          <p className="text-xs text-on-surface-variant uppercase font-bold">
            Target Ucapkan:
          </p>
          <p className="text-2xl font-bold font-display-jp text-primary">
            {kanjiChar} <span className="text-sm font-normal text-on-surface-variant">({pronounceText})</span>
          </p>
          {isRecording ? (
            <p className="text-xs text-red-600 font-semibold animate-pulse mt-2">
              Mendengarkan... Ucapkan sekarang.
            </p>
          ) : recordedText ? (
            <p className="text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mt-2 font-medium">
              Terbaca: "{recordedText}"
            </p>
          ) : (
            <p className="text-xs text-on-surface-variant italic mt-2">
              Klik tombol mikrofon untuk merekam.
            </p>
          )}
        </div>
        
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end select-none">
              <span className="text-xs font-bold uppercase text-on-surface-variant">
                Akurasi Kemiripan
              </span>
              <span className="text-xl font-bold text-primary text-on-surface">
                {accuracyPercentage}%
              </span>
            </div>
            
            <div className="h-3 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary-container transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-center text-on-surface-variant italic select-none">
              "{feedbackText}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizCard;
