import React, { useState, useEffect } from "react";
import Icon from "../../../Common/Component/Icon";
import { type KanjiRef, type JukugoItem } from "./JukugoTable";
import { CancelButton } from "../../../Common/Component/Atoms/CancelButton";
import { api } from "../../../Common/Utility/api";

interface JukugoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingJukugo: JukugoItem | null;
  formKanjiId: number | "";
  setFormKanjiId: (id: number | "") => void;
  formWord: string;
  setFormWord: (word: string) => void;
  formReading: string;
  setFormReading: (reading: string) => void;
  formMeaning: string;
  setFormMeaning: (meaning: string) => void;
  formCategories: string;
  setFormCategories: (categories: string) => void;
  submitting: boolean;
  modalError: string;
  handleSubmit: (e: React.FormEvent) => void;
  kanjis: KanjiRef[];
}

export const JukugoFormModal: React.FC<JukugoFormModalProps> = React.memo(
  ({
    isOpen,
    onClose,
    editingJukugo,
    formKanjiId,
    setFormKanjiId,
    formWord,
    setFormWord,
    formReading,
    setFormReading,
    formMeaning,
    setFormMeaning,
    formCategories,
    setFormCategories,
    submitting,
    modalError,
    handleSubmit,
    kanjis,
  }) => {
    const [availableCategories, setAvailableCategories] = useState<{ id: number; name: string }[]>([]);
    const [catSearch, setCatSearch] = useState("");
    const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

    useEffect(() => {
      if (isOpen) {
        api.admin.categories
          .list()
          .then((res) => {
            setAvailableCategories(res);
          })
          .catch(console.error);
      }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="bg-white border border-outline-variant/30 rounded-3xl w-full sm:w-[560px] md:w-[640px] max-w-2xl shrink-0 shadow-2xl overflow-hidden animate-scale-up flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-slate-50 shrink-0">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Icon
                name={editingJukugo ? "edit" : "add"}
                className="text-indigo-600 text-xl"
              />
              {editingJukugo ? "Edit Jukugo" : "Tambah Jukugo Baru"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 bg-transparent border-none cursor-pointer"
            >
              <Icon name="close" className="text-xl" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {modalError && (
              <div className="bg-error-container text-on-error-container border border-error/20 text-xs p-3 rounded-xl font-bold">
                {modalError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kanji Induk (Pilih dari Database) <span className="text-error">*</span>
              </label>
              <select
                value={formKanjiId}
                onChange={(e) => setFormKanjiId(Number(e.target.value))}
                className="w-full bg-slate-50 border border-outline-variant/30 rounded-xl px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-bold cursor-pointer"
                required
              >
                <option value="">-- Pilih Kanji Induk --</option>
                {kanjis.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.character} ({k.romaji || "N/A"}) - ID: {k.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kata Majemuk (Jukugo) <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: 試飲"
                value={formWord}
                onChange={(e) => setFormWord(e.target.value)}
                className="w-full bg-slate-50 border border-outline-variant/30 rounded-xl px-3 py-2.5 text-lg font-extrabold text-on-surface outline-none focus:ring-2 focus:ring-primary tracking-wide"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Cara Baca (Furigana / Hiragana) <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: しいん"
                  value={formReading}
                  onChange={(e) => setFormReading(e.target.value)}
                  className="w-full bg-slate-50 border border-outline-variant/30 rounded-xl px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Arti (Bahasa Indonesia) <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: mencicipi minuman"
                  value={formMeaning}
                  onChange={(e) => setFormMeaning(e.target.value)}
                  className="w-full bg-slate-50 border border-outline-variant/30 rounded-xl px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-medium"
                  required
                />
              </div>
            </div>

            {/* Select Search (Single) for Kategori Semantik */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kategori Semantik <span className="text-error">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                  className="w-full bg-slate-50 border border-outline-variant/30 rounded-xl px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-medium flex items-center justify-between cursor-pointer"
                >
                  <span
                    className={
                      formCategories
                        ? "font-bold text-indigo-700"
                        : "text-slate-400"
                    }
                  >
                    {formCategories || "Pilih Kategori Semantik..."}
                  </span>
                  <Icon
                    name="arrow_drop_down"
                    className="text-xl text-slate-500"
                  />
                </button>

                {isCatDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-outline-variant/30 rounded-2xl shadow-xl z-50 p-2 max-h-56 overflow-y-auto">
                    <div className="relative mb-2">
                      <Icon
                        name="search"
                        className="text-slate-400 text-sm absolute left-2.5 top-1/2 -translate-y-1/2"
                      />
                      <input
                        type="text"
                        placeholder="Cari kategori..."
                        value={catSearch}
                        onChange={(e) => setCatSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-outline-variant/20 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      {availableCategories
                        .filter((c) =>
                          c.name
                            .toLowerCase()
                            .includes(catSearch.toLowerCase())
                        )
                        .map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setFormCategories(cat.name);
                              setIsCatDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium transition-colors border-none cursor-pointer flex items-center justify-between ${
                              formCategories === cat.name
                                ? "bg-indigo-50 text-indigo-700 font-bold"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <span>{cat.name}</span>
                            {formCategories === cat.name && (
                              <Icon
                                name="check"
                                className="text-indigo-600 text-sm"
                              />
                            )}
                          </button>
                        ))}
                      {availableCategories.filter((c) =>
                        c.name.toLowerCase().includes(catSearch.toLowerCase())
                      ).length === 0 && (
                        <div className="text-xs text-slate-400 p-2 text-center italic">
                          Kategori tidak ditemukan.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <CancelButton onClick={onClose} />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md cursor-pointer transition-all border-none flex items-center gap-2 text-sm"
              >
                {submitting && (
                  <Icon name="sync" className="text-lg animate-spin" />
                )}
                <span>
                  {editingJukugo ? "Simpan Perubahan" : "Tambah Jukugo"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);
JukugoFormModal.displayName = "JukugoFormModal";
