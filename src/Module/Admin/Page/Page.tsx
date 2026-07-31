import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import Icon from "../../Common/Component/Icon";
import { api } from "../../Common/Utility/api";
import { useNavigate } from "react-router-dom";
import { CancelAndReturnButton } from "../../Common/Component/Atoms/CancelAndReturnButton";
import {
  ModuleTable,
  type ModuleData,
} from "../Component/Organism/ModuleTable";
import { ModuleFormModal } from "../Component/Organism/ModuleFormModal";

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
  const [moduleTujuan, setModuleTujuan] = useState("");

  // Feedback states
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const loadData = useCallback(async () => {
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
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ================= MODULE ACTIONS =================

  const openAddModuleModal = useCallback(() => {
    setSelectedModule(null);
    setModuleTitle("");
    setModuleTujuan("");
    setActionError("");
    setIsModuleModalOpen(true);
  }, []);

  const openEditModuleModal = useCallback((mod: ModuleData) => {
    setSelectedModule(mod);
    setModuleTitle(mod.title);
    setModuleTujuan(mod.tujuanPembelajaran || "");
    setActionError("");
    setIsModuleModalOpen(true);
  }, []);

  const handleSaveModule = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!moduleTitle.trim()) {
        setActionError("Judul modul wajib diisi.");
        return;
      }
      try {
        setSubmitting(true);
        setActionError("");
        if (selectedModule) {
          await api.admin.modules.update(selectedModule.id, moduleTitle, moduleTujuan);
        } else {
          await api.admin.modules.create(moduleTitle, moduleTujuan);
        }
        setIsModuleModalOpen(false);
        await loadData();
      } catch (err: any) {
        setActionError(err.message || "Gagal menyimpan modul.");
      } finally {
        setSubmitting(false);
      }
    },
    [moduleTitle, moduleTujuan, selectedModule, loadData]
  );

  const handleDeleteModule = useCallback(
    async (id: number) => {
      if (!window.confirm("Apakah Anda yakin ingin menghapus modul ini beserta seluruh progres terkait?")) {
        return;
      }
      try {
        setLoading(true);
        await api.admin.modules.delete(id);
        await loadData();
      } catch (err: any) {
        alert(err.message || "Gagal menghapus modul.");
        setLoading(false);
      }
    },
    [loadData]
  );

  const handleNavigateDetail = useCallback(
    (id: number) => {
      navigate(`/admin/module-detail?id=${id}`);
    },
    [navigate]
  );

  if (loading && modules.length === 0) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center min-h-[400px]">
          <div className="text-primary font-bold animate-pulse text-lg">
            Memuat Dashboard Admin...
          </div>
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
            <div className="flex items-center gap-3">
              <CancelAndReturnButton
                label="Kembali ke Dashboard"
                iconName="arrow_back"
                onClick={() => navigate("/dashboard")}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-error-container text-on-error-container border border-error/20 rounded-xl font-semibold">
              {error}
            </div>
          )}

          {/* Modules List Table Organism */}
          <ModuleTable
            modules={modules}
            onOpenAddModal={openAddModuleModal}
            onOpenEditModal={openEditModuleModal}
            onDeleteModule={handleDeleteModule}
            onNavigateDetail={handleNavigateDetail}
          />
        </div>
      </main>

      {/* Module Add/Edit Modal Organism */}
      <ModuleFormModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        selectedModule={selectedModule}
        moduleTitle={moduleTitle}
        setModuleTitle={setModuleTitle}
        moduleTujuan={moduleTujuan}
        setModuleTujuan={setModuleTujuan}
        actionError={actionError}
        submitting={submitting}
        onSubmit={handleSaveModule}
      />
    </Layout>
  );
};

export default AdminPage;
