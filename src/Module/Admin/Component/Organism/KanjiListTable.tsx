import React from "react";
import Icon from "../../../Common/Component/Icon";
import { type ModuleRef } from "../Molecules/KanjiFilterBar";
import { KanjiStatusBadge, KanjiModuleBadge } from "../Atoms/AdminBadges";
import { isKanjiIncomplete } from "../../Utility/kanjiUtils";

export interface KanjiListItem {
  id: number;
  character: string;
  romaji: string | null;
  meaning: string | null;
  bushuu: string | null;
  onyomi: string | null;
  kunyomi: string | null;
  baseMeaning: string | null;
  moduleId: number | null;
  module?: ModuleRef | null;
  examples?: any[];
  jukugos?: any[];
}

interface KanjiListTableProps {
  kanjis: KanjiListItem[];
  onEdit: (id: number, moduleId: number | null) => void;
  onDelete: (id: number, char: string) => void;
  onNavigateModule: (moduleId: number) => void;
}

export const KanjiListTable: React.FC<KanjiListTableProps> = React.memo(
  ({ kanjis, onEdit, onDelete, onNavigateModule }) => {
    return (
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-outline-variant/20 text-[11px] uppercase text-slate-500 font-extrabold tracking-wider">
                <th className="py-4 px-4 w-16">ID</th>
                <th className="py-4 px-4 min-w-[80px]">KANJI</th>
                <th className="py-4 px-4 min-w-[160px]">ROMAJI & ARTI</th>
                <th className="py-4 px-4 min-w-[180px]">CARA BACA & BUSHUU</th>
                <th className="py-4 px-4 min-w-[180px]">MODUL BELAJAR</th>
                <th className="py-4 px-4 min-w-[160px]">STATUS DATA</th>
                <th className="py-4 px-4 text-center w-28 min-w-[100px]">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-on-surface font-medium">
              {kanjis.map((k) => {
                const incomplete = isKanjiIncomplete(k);

                return (
                  <tr
                    key={k.id}
                    className="hover:bg-slate-50/60 transition-all cursor-pointer"
                    onClick={() => onEdit(k.id, k.moduleId)}
                  >
                    <td className="py-4 px-4 text-xs font-mono font-bold text-slate-400">
                      #{k.id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-2xl border shrink-0 ${
                            incomplete
                              ? "bg-amber-50 border-amber-300 text-amber-800 shadow-2xs"
                              : "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs"
                          }`}
                        >
                          {k.character}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {k.romaji || k.meaning ? (
                        <div>
                          <div className="text-slate-900 font-extrabold text-sm">
                            {k.romaji || "-"}
                          </div>
                          <div className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                            {k.meaning || "-"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md whitespace-nowrap inline-flex items-center shrink-0">
                          Belum Dilengkapi
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs">
                      <div className="space-y-0.5">
                        {k.bushuu && (
                          <div className="text-slate-700 font-semibold">
                            Bushuu: <span className="font-bold">{k.bushuu}</span>
                          </div>
                        )}
                        {k.onyomi && (
                          <div className="text-slate-500">
                            Onyomi: <span className="font-bold">{k.onyomi}</span>
                          </div>
                        )}
                        {k.kunyomi && (
                          <div className="text-slate-500">
                            Kunyomi: <span className="font-bold">{k.kunyomi}</span>
                          </div>
                        )}
                        {!k.bushuu && !k.onyomi && !k.kunyomi && (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <KanjiModuleBadge
                        module={k.module}
                        onNavigate={onNavigateModule}
                      />
                    </td>
                    <td
                      className="py-4 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <KanjiStatusBadge isIncomplete={incomplete} />
                    </td>
                    <td
                      className="py-4 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEdit(k.id, k.moduleId)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer bg-transparent border-none transition-all"
                          title="Edit Kanji"
                        >
                          <Icon name="edit" className="text-lg" />
                        </button>
                        <button
                          onClick={() => onDelete(k.id, k.character)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer bg-transparent border-none transition-all"
                          title="Hapus Kanji"
                        >
                          <Icon name="delete" className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);
KanjiListTable.displayName = "KanjiListTable";
