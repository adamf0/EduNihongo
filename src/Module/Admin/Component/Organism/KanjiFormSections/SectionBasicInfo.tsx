import React from "react";

interface SectionBasicInfoProps {
  isDisabled: boolean;
  kanjiChar: string;
  setKanjiChar: (val: string) => void;
  kanjiRomaji: string;
  setKanjiRomaji: (val: string) => void;
  kanjiMeaning: string;
  setKanjiMeaning: (val: string) => void;
  kanjiBushuu: string;
  setKanjiBushuu: (val: string) => void;
  kanjiOnyomi: string;
  setKanjiOnyomi: (val: string) => void;
  kanjiKunyomi: string;
  setKanjiKunyomi: (val: string) => void;
  kanjiBaseMeaning: string;
  setKanjiBaseMeaning: (val: string) => void;
}

export const SectionBasicInfo: React.FC<SectionBasicInfoProps> = React.memo(
  ({
    isDisabled,
    kanjiChar,
    setKanjiChar,
    kanjiRomaji,
    setKanjiRomaji,
    kanjiMeaning,
    setKanjiMeaning,
    kanjiBushuu,
    setKanjiBushuu,
    kanjiOnyomi,
    setKanjiOnyomi,
    kanjiKunyomi,
    setKanjiKunyomi,
    kanjiBaseMeaning,
    setKanjiBaseMeaning,
  }) => {
    return (
      <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-4 animate-scale-up h-[450px] justify-between">
        <h4 className="font-label-lg text-label-lg font-bold border-b border-outline-variant/20 pb-1 text-primary">
          1. Informasi Kanji
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5 relative">
            <label className="font-label-sm text-label-sm font-semibold text-on-surface">
              Karakter Kanji
            </label>
            <input
              type="text"
              required
              disabled={isDisabled}
              placeholder="Contoh: 試"
              value={kanjiChar}
              onChange={(e) => setKanjiChar(e.target.value)}
              className={`w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2 text-2xl font-extrabold text-primary outline-none focus:ring-2 focus:ring-primary rounded-xl text-center ${
                isDisabled ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm font-semibold text-on-surface">
              Romaji
            </label>
            <input
              type="text"
              disabled={isDisabled}
              placeholder="Contoh: shi"
              value={kanjiRomaji}
              onChange={(e) => setKanjiRomaji(e.target.value)}
              className={`w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-bold rounded-xl ${
                isDisabled ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm font-semibold text-on-surface">
              Arti Singkat
            </label>
            <input
              type="text"
              disabled={isDisabled}
              placeholder="Contoh: mencoba / tes"
              value={kanjiMeaning}
              onChange={(e) => setKanjiMeaning(e.target.value)}
              className={`w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-medium rounded-xl ${
                isDisabled ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm font-semibold text-on-surface">
              Bushuu (Radikal)
            </label>
            <input
              type="text"
              disabled={isDisabled}
              placeholder="Contoh: 言 (gen - kata)"
              value={kanjiBushuu}
              onChange={(e) => setKanjiBushuu(e.target.value)}
              className={`w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-medium rounded-xl ${
                isDisabled ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm font-semibold text-on-surface">
              Cara Baca Onyomi
            </label>
            <input
              type="text"
              disabled={isDisabled}
              placeholder="Contoh: シ (shi)"
              value={kanjiOnyomi}
              onChange={(e) => setKanjiOnyomi(e.target.value)}
              className={`w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-medium rounded-xl ${
                isDisabled ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm font-semibold text-on-surface">
              Cara Baca Kunyomi
            </label>
            <input
              type="text"
              disabled={isDisabled}
              placeholder="Contoh: こころ.みる (kokoromiru)"
              value={kanjiKunyomi}
              onChange={(e) => setKanjiKunyomi(e.target.value)}
              className={`w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-medium rounded-xl ${
                isDisabled ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm font-semibold text-on-surface">
            Makna Dasar Kanji
          </label>
          <textarea
            rows={2}
            disabled={isDisabled}
            placeholder="Makna dasar kanji secara filosofis atau etimologis..."
            value={kanjiBaseMeaning}
            onChange={(e) => setKanjiBaseMeaning(e.target.value)}
            className={`w-full bg-surface-container-lowest border border-outline-variant/30 p-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-medium rounded-xl ${
              isDisabled ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
    );
  }
);
SectionBasicInfo.displayName = "SectionBasicInfo";
