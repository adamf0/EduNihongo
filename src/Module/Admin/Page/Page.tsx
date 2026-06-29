import React, { useState, useEffect } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import Icon from "../../Common/Component/Icon";
import { api } from "../../Common/Utility/api";
import { useNavigate } from "react-router-dom";

interface ModuleData {
  id: number;
  title: string;
  kanjis?: any[];
}

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Data lists
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [moduleTitle, setModuleTitle] = useState("");

  // Feedback states
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const mods = await api.admin.modules.list();
      setModules(mods);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat data admin.");
      if (err.message?.includes("Token") || err.message?.includes("Akses ditolak")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [navigate]);

  // ================= MODULE ACTIONS =================

  const openAddModuleModal = () => {
    setSelectedModule(null);
    setModuleTitle("");
    setActionError("");
    setIsModuleModalOpen(true);
  };

  const openEditModuleModal = (mod: ModuleData) => {
    setSelectedModule(mod);
    setModuleTitle(mod.title);
    setActionError("");
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim()) {
      setActionError("Judul modul wajib diisi.");
      return;
    }
    try {
      setSubmitting(true);
      setActionError("");
      if (selectedModule) {
        await api.admin.modules.update(selectedModule.id, moduleTitle);
      } else {
        await api.admin.modules.create(moduleTitle);
      }
      setIsModuleModalOpen(false);
      loadData();
    } catch (err: any) {
      setActionError(err.message || "Gagal menyimpan modul.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteModule = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus modul ini beserta seluruh progres terkait?")) {
      return;
    }
    try {
      setLoading(true);
      await api.admin.modules.delete(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus modul.");
      setLoading(false);
    }
  };

  if (loading && modules.length === 0) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center min-h-[400px]">
          <div className="text-primary font-bold animate-pulse text-lg">Memuat Dashboard Admin...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6">
        <div className="flex flex-col gap-base">
          {/* Admin Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-base border-b border-outline-variant/30 pb-base">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface flex items-center gap-sm">
                <Icon name="admin_panel_settings" className="text-primary text-3xl" />
                Panel Admin: Kelola Modul
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Manajemen kurikulum pembelajaran, modul belajar, dan daftar kanji.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 border border-outline hover:bg-surface-container transition-all cursor-pointer font-bold text-on-surface bg-transparent rounded-lg flex items-center gap-sm text-sm"
            >
              <Icon name="arrow_back" className="text-lg" />
              Kembali ke Dashboard
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-error-container text-on-error-container border border-error/20 rounded-xl font-semibold">
              {error}
            </div>
          )}

          {/* Modules List View */}
          <div className="flex flex-col gap-md">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                Daftar Modul Belajar
              </h3>
              <button
                onClick={openAddModuleModal}
                className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all border-none flex items-center gap-sm text-sm"
              >
                <Icon name="add" className="text-lg" />
                Tambah Modul
              </button>
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
                      <td className="p-4 font-mono font-bold text-slate-500">{mod.id}</td>
                      <td className="p-4 font-bold">{mod.title}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-sm">
                          <span className="font-semibold text-on-surface-variant">{mod.kanjis?.length || 0} Kanji</span>
                          <button
                            onClick={() => navigate(`/admin/module-detail?id=${mod.id}`)}
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
                          onClick={() => openEditModuleModal(mod)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg cursor-pointer bg-transparent border-none"
                          title="Edit Modul"
                        >
                          <Icon name="edit" className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleDeleteModule(mod.id)}
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
                      <td colSpan={4} className="p-8 text-center text-on-surface-variant italic">
                        Belum ada modul yang terdaftar. Silakan tambah modul pertama Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* ================= MODAL: ADD/EDIT MODULE ================= */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 max-w-[420px] w-full shadow-2xl relative flex flex-col gap-4">
            <button
              onClick={() => setIsModuleModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer border-none bg-transparent"
            >
              <Icon name="close" className="text-xl block" />
            </button>

            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              {selectedModule ? "Edit Modul" : "Tambah Modul Baru"}
            </h3>

            <form onSubmit={handleSaveModule} className="flex flex-col gap-4 mt-2">
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

              {actionError && (
                <p className="text-error font-body-md text-body-md font-semibold">
                  {actionError}
                </p>
              )}

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-surface-variant/30">
                <button
                  type="button"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-outline hover:bg-surface-container transition-all cursor-pointer font-bold text-on-surface bg-transparent"
                >
                  Batal
                </button>
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
      )}
    </Layout>
  );
};

export default AdminPage;
