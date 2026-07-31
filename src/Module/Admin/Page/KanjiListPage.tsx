import React, { useState, useEffect, useMemo, useCallback } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import Icon from "../../Common/Component/Icon";
import { api } from "../../Common/Utility/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AddActionButton } from "../../Common/Component/Atoms/AddActionButton";
import {
  KanjiFilterBar,
  type ModuleRef,
} from "../Component/Molecules/KanjiFilterBar";
import {
  KanjiListTable,
  type KanjiListItem,
} from "../Component/Organism/KanjiListTable";
import { isKanjiIncomplete } from "../Utility/kanjiUtils";

export const KanjiListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");

  const [kanjis, setKanjis] = useState<KanjiListItem[]>([]);
  const [modules, setModules] = useState<ModuleRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>(
    filterParam === "incomplete" ? "INCOMPLETE" : "ALL"
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [allKanjis, allModules] = await Promise.all([
        api.admin.kanjis.list(),
        api.admin.modules.list(),
      ]);

      setKanjis(allKanjis);
      setModules(allModules);
    } catch (err: any) {
      console.error("Gagal memuat data Kanji:", err);
      setError(err.message || "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = useCallback(
    async (id: number, char: string) => {
      if (!window.confirm(`Apakah Anda yakin ingin menghapus Kanji "${char}" (ID: ${id})?`)) {
        return;
      }
      try {
        await api.admin.kanjis.delete(id);
        await fetchData();
      } catch (err: any) {
        alert(err.message || "Gagal menghapus Kanji.");
      }
    },
    [fetchData]
  );

  const handleEdit = useCallback(
    (id: number) => {
      navigate(
        `/admin/kanji-form?kanjiId=${id}`
      );
    },
    [navigate]
  );

  const handleNavigateModule = useCallback(
    (modId: number) => {
      navigate(`/admin/module-detail?id=${modId}`);
    },
    [navigate]
  );

  // Incomplete count computed with useMemo using shared isKanjiIncomplete
  const incompleteCount = useMemo(
    () => kanjis.filter(isKanjiIncomplete).length,
    [kanjis]
  );

  // Filtered Kanjis computed with useMemo
  const filteredKanjis = useMemo(() => {
    return kanjis.filter((k) => {
      const isIncomplete = isKanjiIncomplete(k);

      // Status Filter
      if (selectedStatusFilter === "INCOMPLETE" && !isIncomplete) return false;
      if (selectedStatusFilter === "COMPLETE" && isIncomplete) return false;

      // Module Filter
      if (selectedModuleFilter === "NONE" && k.moduleId !== null) return false;
      if (
        selectedModuleFilter !== "ALL" &&
        selectedModuleFilter !== "NONE" &&
        k.moduleId !== Number(selectedModuleFilter)
      ) {
        return false;
      }

      // Search Query Filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        k.character.toLowerCase().includes(q) ||
        (k.romaji && k.romaji.toLowerCase().includes(q)) ||
        (k.meaning && k.meaning.toLowerCase().includes(q)) ||
        (k.baseMeaning && k.baseMeaning.toLowerCase().includes(q))
      );
    });
  }, [kanjis, selectedStatusFilter, selectedModuleFilter, searchQuery]);

  return (
    <Layout>
      <main className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/30 pb-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface flex items-center gap-2">
              <button
                onClick={() => navigate("/admin")}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 border-none bg-transparent cursor-pointer transition-all flex items-center justify-center"
                title="Kembali ke Panel Admin"
              >
                <Icon name="arrow_back" className="text-2xl" />
              </button>
              <Icon name="draw" className="text-indigo-600 text-3xl" />
              Kelola Kanji (Karakter Tunggal)
            </h2>
            <p className="text-body-md text-on-surface-variant font-medium mt-1">
              Manajemen seluruh karakter Kanji tunggal, romaji, bushuu, onyomi, kunyomi, dan penetapan modul belajar.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AddActionButton
              label="Tambah Kanji Baru"
              variant="indigo"
              onClick={() => navigate("/admin/kanji-form")}
            />
          </div>
        </div>

        {/* Filter Bar */}
        <KanjiFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedModuleFilter={selectedModuleFilter}
          onModuleFilterChange={setSelectedModuleFilter}
          selectedStatusFilter={selectedStatusFilter}
          onStatusFilterChange={setSelectedStatusFilter}
          modules={modules}
          totalCount={kanjis.length}
          incompleteCount={incompleteCount}
        />

        {/* Table Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-400 gap-3">
            <Icon name="sync" className="w-6 h-6 animate-spin text-primary" />
            <span className="font-semibold text-sm">Memuat data Kanji...</span>
          </div>
        ) : error ? (
          <div className="bg-error-container text-on-error-container border border-error/20 p-4 rounded-2xl text-center font-bold">
            {error}
          </div>
        ) : filteredKanjis.length === 0 ? (
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
            <Icon name="search_off" className="w-12 h-12 mx-auto text-slate-400 mb-2" />
            <p className="font-bold">Tidak ada data Kanji yang sesuai kriteria.</p>
          </div>
        ) : (
          <KanjiListTable
            kanjis={filteredKanjis}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNavigateModule={handleNavigateModule}
          />
        )}
      </main>
    </Layout>
  );
};

export default KanjiListPage;
