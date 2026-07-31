import React from "react";
import Icon from "../../../Common/Component/Icon";
import { AddActionButton } from "../../../Common/Component/Atoms/AddActionButton";

export interface ModuleKanjiItem {
  id: number;
  character: string;
  romaji: string | null;
  meaning: string | null;
  bushuu: string | null;
  onyomi: string | null;
  kunyomi: string | null;
  baseMeaning: string | null;
  border: string | null;
  moduleId: number | null;
}

interface ModuleKanjiTabProps {
  kanjis: ModuleKanjiItem[];
  moduleId: number;
  onOpenAddKanjiModal: () => void;
  onEditKanji: (kanjiId: number, character: string) => void;
  onDeleteKanji: (kanjiId: number) => void;
}

export const ModuleKanjiTab: React.FC<ModuleKanjiTabProps> = React.memo(
  ({
    kanjis,
    moduleId,
    onOpenAddKanjiModal,
    onEditKanji,
    onDeleteKanji,
  }) => {
    return (
      <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-xs flex flex-col gap-4 animate-scale-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-outline-variant/20">
          <div>
            <h3 className="font-label-lg text-label-lg font-bold text-slate-800 flex items-center gap-2">
              <Icon name="format_list_bulleted" className="text-primary text-xl" />
              Daftar Kanji Terdaftar dalam Modul Ini ({kanjis.length})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Manajemen karakter Kanji tunggal yang ditugaskan khusus untuk Modul ini.
            </p>
          </div>
          <AddActionButton
            label="Tambah Kanji Baru"
            variant="indigo"
            size="sm"
            onClick={onOpenAddKanjiModal}
          />
        </div>

        {kanjis.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium text-sm">
            Belum ada Kanji yang terdaftar pada modul ini. Klik &quot;+ Tambah Kanji Baru&quot; untuk menambahkan!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-outline-variant/20 text-[11px] uppercase text-slate-500 font-extrabold tracking-wider">
                  <th className="py-3 px-4 w-16">ID</th>
                  <th className="py-3 px-4 w-20">KANJI</th>
                  <th className="py-3 px-4">ROMAJI & ARTI</th>
                  <th className="py-3 px-4">BUSHUU / CARA BACA</th>
                  <th className="py-3 px-4 text-center w-28">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-on-surface font-medium">
                {kanjis.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/60 transition-all">
                    <td className="py-3 px-4 text-xs font-mono font-bold text-slate-400">
                      #{k.id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-2xl flex items-center justify-center shadow-2xs">
                        {k.character}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-900 font-extrabold text-sm">
                        {k.romaji || "-"}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                        {k.meaning || "-"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs space-y-0.5">
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
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEditKanji(k.id, k.character)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer bg-transparent border-none transition-all"
                          title={`Edit Module: ${moduleId} Kanji: ${k.character}`}
                        >
                          <Icon name="edit" className="text-lg" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteKanji(k.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer bg-transparent border-none transition-all"
                          title="Keluarkan Kanji dari Modul Ini"
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
        )}
      </div>
    );
  }
);
ModuleKanjiTab.displayName = "ModuleKanjiTab";
