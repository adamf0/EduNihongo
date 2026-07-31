import React from "react";
import Icon from "../../../Common/Component/Icon";
import { type ModuleData } from "./ModuleTable";
import { CancelButton } from "../../../Common/Component/Atoms/CancelButton";

interface ModuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModule: ModuleData | null;
  moduleTitle: string;
  setModuleTitle: (title: string) => void;
  moduleTujuan: string;
  setModuleTujuan: (tujuan: string) => void;
  actionError: string;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const ModuleFormModal: React.FC<ModuleFormModalProps> = React.memo(
  ({
    isOpen,
    onClose,
    selectedModule,
    moduleTitle,
    setModuleTitle,
    moduleTujuan,
    setModuleTujuan,
    actionError,
    submitting,
    onSubmit,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative flex flex-col gap-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer border-none bg-transparent"
          >
            <Icon name="close" className="text-xl block" />
          </button>

          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
            {selectedModule ? "Edit Modul" : "Tambah Modul Baru"}
          </h3>

          <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-bold text-on-surface">
                Nama Modul / Judul
              </label>
              <input
                type="text"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl p-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Contoh: Module 6"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-bold text-on-surface">
                Tujuan Pembelajaran
              </label>
              <textarea
                value={moduleTujuan}
                onChange={(e) => setModuleTujuan(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl p-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all resize-y min-h-[100px] font-sans"
                placeholder="Masukkan tujuan pembelajaran..."
              />
            </div>

            {actionError && (
              <p className="text-error font-body-md text-body-md font-semibold">
                {actionError}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-surface-variant/30">
              <CancelButton onClick={onClose} />
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all border-none flex items-center justify-center"
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);
ModuleFormModal.displayName = "ModuleFormModal";
