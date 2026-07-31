import React from "react";
import Icon from "../../../Common/Component/Icon";
import { AddActionButton } from "../../../Common/Component/Atoms/AddActionButton";

export interface ModuleData {
  id: number;
  title: string;
  tujuanPembelajaran?: string | null;
  kanjis?: any[];
}

interface ModuleTableProps {
  modules: ModuleData[];
  onOpenAddModal: () => void;
  onOpenEditModal: (mod: ModuleData) => void;
  onDeleteModule: (id: number) => void;
  onNavigateDetail: (id: number) => void;
}

export const ModuleTable: React.FC<ModuleTableProps> = React.memo(
  ({
    modules,
    onOpenAddModal,
    onOpenEditModal,
    onDeleteModule,
    onNavigateDetail,
  }) => {
    return (
      <div className="flex flex-col gap-md">
        <div className="flex justify-between items-center">
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
            Daftar Modul Belajar
          </h3>
          <AddActionButton label="Tambah Modul" onClick={onOpenAddModal} />
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20 text-label-md text-on-surface-variant font-semibold">
                <th className="p-4 w-20">ID</th>
                <th className="p-4">Nama Modul / Judul</th>
                <th className="p-4 w-48">Jumlah Kanji</th>
                <th className="p-4 w-36 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-md text-on-surface">
              {modules.map((mod) => (
                <tr key={mod.id} className="hover:bg-surface-container-low/50">
                  <td className="p-4 font-mono font-bold text-slate-500">
                    {mod.id}
                  </td>
                  <td className="p-4 font-bold">{mod.title}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-sm">
                      <span className="font-semibold text-on-surface-variant">
                        {mod.kanjis?.length || 0} Kanji
                      </span>
                      <button
                        onClick={() => onNavigateDetail(mod.id)}
                        className="px-2.5 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded-md font-bold cursor-pointer border-none flex items-center gap-1"
                        title="Kelola Kanji di Modul ini"
                      >
                        <Icon name="add" className="text-xs" />
                        Kelola
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center flex items-center justify-center gap-sm">
                    <button
                      onClick={() => onOpenEditModal(mod)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg cursor-pointer bg-transparent border-none"
                      title="Edit Modul"
                    >
                      <Icon name="edit" className="text-xl" />
                    </button>
                    <button
                      onClick={() => onDeleteModule(mod.id)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg cursor-pointer bg-transparent border-none"
                      title="Hapus Modul"
                    >
                      <Icon name="delete" className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
              {modules.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-on-surface-variant italic"
                  >
                    Belum ada modul yang terdaftar. Silakan tambah modul pertama
                    Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);
ModuleTable.displayName = "ModuleTable";
