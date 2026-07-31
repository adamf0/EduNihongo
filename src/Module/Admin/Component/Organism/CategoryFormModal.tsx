import React from "react";
import Icon from "../../../Common/Component/Icon";
import { CancelButton } from "../../../Common/Component/Atoms/CancelButton";

export interface CategoryItem {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory: CategoryItem | null;
  formName: string;
  setFormName: (val: string) => void;
  formDescription: string;
  setFormDescription: (val: string) => void;
  submitting: boolean;
  modalError: string;
  handleSubmit: (e: React.FormEvent) => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = React.memo(
  ({
    isOpen,
    onClose,
    editingCategory,
    formName,
    setFormName,
    formDescription,
    setFormDescription,
    submitting,
    modalError,
    handleSubmit,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="bg-white border border-outline-variant/30 rounded-3xl w-full sm:w-[560px] md:w-[640px] max-w-2xl shrink-0 shadow-2xl overflow-hidden animate-scale-up flex flex-col">
          <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-slate-50 shrink-0">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Icon
                name={editingCategory ? "edit" : "add"}
                className="text-indigo-600 text-xl"
              />
              {editingCategory ? "Edit Kategori Kanji" : "Tambah Kategori Kanji"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 bg-transparent border-none cursor-pointer"
            >
              <Icon name="close" className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {modalError && (
              <div className="bg-error-container text-on-error-container border border-error/20 text-xs p-3 rounded-xl font-bold">
                {modalError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Kategori <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Kombinasi Utama, Ekonomi, Aktivitas"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-slate-50 border border-outline-variant/30 rounded-xl px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Deskripsi Kategori
              </label>
              <textarea
                rows={3}
                placeholder="Deskripsi singkat mengenai kategori semantik ini..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full bg-slate-50 border border-outline-variant/30 rounded-xl p-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-medium"
              />
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
                  {editingCategory ? "Simpan Perubahan" : "Tambah Kategori"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);
CategoryFormModal.displayName = "CategoryFormModal";
