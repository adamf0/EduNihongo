import React from "react";
import Icon from "../../../Common/Component/Icon";

export interface KanjiOptionItem {
  id: number;
  character: string;
  romaji: string | null;
  meaning: string | null;
  moduleId: number | null;
  module?: { id: number; title: string } | null;
}

interface AddKanjiToModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleTitle?: string;
  moduleId: number;
  allAvailableKanjis: KanjiOptionItem[];
  selectedKanjiIdsToAdd: number[];
  setSelectedKanjiIdsToAdd: React.Dispatch<React.SetStateAction<number[]>>;
  kanjiSearchTerm: string;
  setKanjiSearchTerm: (term: string) => void;
  submittingAddKanji: boolean;
  onSave: (e: React.FormEvent) => void;
}

export const AddKanjiToModuleModal: React.FC<AddKanjiToModuleModalProps> = React.memo(
  ({
    isOpen,
    onClose,
    moduleTitle,
    moduleId,
    allAvailableKanjis,
    selectedKanjiIdsToAdd,
    setSelectedKanjiIdsToAdd,
    kanjiSearchTerm,
    setKanjiSearchTerm,
    submittingAddKanji,
    onSave,
  }) => {
    if (!isOpen) return null;

    const filteredKanjis = allAvailableKanjis.filter((k) => {
      if (!kanjiSearchTerm.trim()) return true;
      const q = kanjiSearchTerm.toLowerCase();
      return (
        k.character.toLowerCase().includes(q) ||
        (k.romaji && k.romaji.toLowerCase().includes(q)) ||
        (k.meaning && k.meaning.toLowerCase().includes(q))
      );
    });

    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="bg-white border border-outline-variant/30 rounded-3xl w-full sm:w-[560px] md:w-[640px] max-w-2xl shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col shrink-0">
          <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-slate-50 shrink-0">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Icon name="add" className="text-indigo-600 text-xl" />
              Tambah Kanji ke Modul
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 bg-transparent border-none cursor-pointer rounded-lg hover:bg-slate-200/50 transition-all"
            >
              <Icon name="close" className="text-xl" />
            </button>
          </div>

          <form
            onSubmit={onSave}
            className="p-6 space-y-4 overflow-y-auto flex-1 sidebar-scroll"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Modul
              </label>
              <input
                type="text"
                disabled
                value={moduleTitle || `Module ${moduleId}`}
                className="w-full bg-slate-100 border border-outline-variant/30 rounded-xl px-3 py-2 text-sm text-slate-600 font-bold cursor-not-allowed outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pilih Kanji (Multiple Select Search)
              </label>
              <div className="relative mb-2">
                <Icon
                  name="search"
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                />
                <input
                  type="text"
                  placeholder="Cari kanji, romaji, atau arti..."
                  value={kanjiSearchTerm}
                  onChange={(e) => setKanjiSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-outline-variant/30 rounded-xl pl-9 pr-3 py-2 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary font-medium"
                />
              </div>

              {/* Selected Kanji Pills */}
              {selectedKanjiIdsToAdd.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 bg-indigo-50/50 border border-indigo-100 rounded-xl mb-2 max-h-24 overflow-y-auto sidebar-scroll">
                  {selectedKanjiIdsToAdd.map((id) => {
                    const k = allAvailableKanjis.find((item) => item.id === id);
                    if (!k) return null;
                    return (
                      <span
                        key={id}
                        className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>
                          {k.character} ({k.romaji || "Inkomplit"})
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedKanjiIdsToAdd((prev) =>
                              prev.filter((i) => i !== id)
                            )
                          }
                          className="hover:text-rose-200 border-none bg-transparent cursor-pointer p-0 text-xs font-extrabold"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Selectable Kanjis Grid / List */}
              <div className="border border-outline-variant/30 rounded-xl max-h-60 overflow-y-auto p-2 space-y-1 bg-slate-50 sidebar-scroll">
                {filteredKanjis.map((k) => {
                  const isSelected = selectedKanjiIdsToAdd.includes(k.id);
                  const isAlreadyInThisModule =
                    Number(k.moduleId) === Number(moduleId);

                  return (
                    <div
                      key={k.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedKanjiIdsToAdd((prev) =>
                            prev.filter((i) => i !== k.id)
                          );
                        } else {
                          setSelectedKanjiIdsToAdd((prev) => [...prev, k.id]);
                        }
                      }}
                      className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-300 text-indigo-900 font-bold"
                          : "bg-white border-slate-200/60 hover:bg-slate-100/80 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-slate-100 font-extrabold text-lg flex items-center justify-center text-slate-900 border border-slate-200">
                          {k.character}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {k.romaji || "Inkomplit"}{" "}
                            <span className="text-slate-500 font-normal">
                              {k.meaning ? `- ${k.meaning}` : ""}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {isAlreadyInThisModule ? (
                              <span className="text-indigo-600 font-bold">
                                Sudah di modul ini
                              </span>
                            ) : k.module ? (
                              `Terdaftar di ${k.module.title}`
                            ) : (
                              "Tidak Terdaftar ke Modul"
                            )}
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by parent onClick
                        className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all border-none bg-transparent cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submittingAddKanji}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer border-none flex items-center gap-2"
              >
                {submittingAddKanji ? "Menyimpan..." : "Simpan ke Modul"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);
AddKanjiToModuleModal.displayName = "AddKanjiToModuleModal";
