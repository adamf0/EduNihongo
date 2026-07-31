import React from "react";
import Icon from "../../../Common/Component/Icon";
import { isKanjiIncomplete } from "../../Utility/kanjiUtils";

export interface KanjiRef {
  id: number;
  character: string;
  romaji: string;
  meaning: string;
  moduleId: number | null;
}

export interface JukugoItem {
  id: number;
  kanjiId: number;
  word: string;
  reading: string;
  meaning: string;
  kanji?: KanjiRef;
  categories?: string[];
  extractedKanji?: string[];
}

export function extractKanjiCharacters(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/[\u4e00-\u9faf\u3400-\u4dbf]/g);
  if (!matches) return [];
  return Array.from(new Set(matches));
}

interface JukugoTableProps {
  jukugos: JukugoItem[];
  kanjis: KanjiRef[];
  onEdit: (item: JukugoItem) => void;
  onDelete: (id: number, word: string) => void;
  onNavigateKanji: (kanjiId?: number) => void;
}

export const JukugoTable: React.FC<JukugoTableProps> = React.memo(
  ({ jukugos, kanjis, onEdit, onDelete, onNavigateKanji }) => {
    return (
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-outline-variant/20 text-[11px] uppercase text-slate-500 font-extrabold tracking-wider">
                <th className="py-4 px-4 w-16">ID</th>
                <th className="py-4 px-4">KATA JUKUGO</th>
                <th className="py-4 px-4">KANJI TUNGGAL</th>
                <th className="py-4 px-4">CARA BACA & ARTI</th>
                <th className="py-4 px-4">KATEGORI SEMANTIK</th>
                <th className="py-4 px-4">KANJI INDUK</th>
                <th className="py-4 px-4 text-center w-28">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-on-surface font-medium">
              {jukugos.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/60 transition-all">
                  <td className="py-4 px-4 text-xs font-mono font-bold text-slate-400">
                    #{j.id}
                  </td>
                  <td className="py-4 px-4 font-extrabold text-xl text-slate-900 tracking-wide">
                    {j.word}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(
                        j.extractedKanji || extractKanjiCharacters(j.word)
                      ).map((c, idx) => {
                        const kMatch = kanjis.find((k) => k.character === c);
                        const isIncomplete = isKanjiIncomplete(kMatch);

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => onNavigateKanji(kMatch?.id)}
                            className={`px-2.5 py-0.5 text-xs rounded-md font-bold transition-all border cursor-pointer flex items-center justify-center ${
                              isIncomplete
                                ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 shadow-2xs"
                                : "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 shadow-2xs"
                            }`}
                            title={
                              isIncomplete
                                ? `Kanji '${c}' data belum lengkap. Klik untuk melengkapi data Kanji ini!`
                                : `Klik untuk edit detail Kanji '${c}'`
                            }
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-slate-900 font-bold text-sm">
                      {j.reading}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      {j.meaning}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {j.categories && j.categories.length > 0 ? (
                        j.categories.map((cat, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-full font-bold"
                          >
                            {cat}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Kombinasi Utama
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {j.kanji ? (
                      <span className="text-xs text-slate-700 font-bold">
                        {j.kanji.character} ({j.kanji.romaji || "N/A"})
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">
                        ID: {j.kanjiId}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(j)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer bg-transparent border-none transition-all"
                        title="Edit Jukugo"
                      >
                        <Icon name="edit" className="text-lg" />
                      </button>
                      <button
                        onClick={() => onDelete(j.id, j.word)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer bg-transparent border-none transition-all"
                        title="Hapus Jukugo"
                      >
                        <Icon name="delete" className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);
JukugoTable.displayName = "JukugoTable";
