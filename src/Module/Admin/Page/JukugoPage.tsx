import React, { useState, useEffect, useMemo, useCallback } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import Icon from "../../Common/Component/Icon";
import { api } from "../../Common/Utility/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  JukugoTable,
  type KanjiRef,
  type JukugoItem,
} from "../Component/Organism/JukugoTable";
import { JukugoFormModal } from "../Component/Organism/JukugoFormModal";
import { AddActionButton } from "../../Common/Component/Atoms/AddActionButton";

export const JukugoPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const kanjiIdParam = searchParams.get("kanjiId");
  const searchParam = searchParams.get("search");

  const [jukugos, setJukugos] = useState<JukugoItem[]>([]);
  const [kanjis, setKanjis] = useState<KanjiRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKanjiFilter, setSelectedKanjiFilter] = useState<number | "ALL">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJukugo, setEditingJukugo] = useState<JukugoItem | null>(null);
  const [formKanjiId, setFormKanjiId] = useState<number | "">("");
  const [formWord, setFormWord] = useState("");
  const [formReading, setFormReading] = useState("");
  const [formMeaning, setFormMeaning] = useState("");
  const [formCategories, setFormCategories] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [allJukugos, allKanjis] = await Promise.all([
        api.admin.jukugos.list(),
        api.admin.kanjis.list(),
      ]);

      setJukugos(allJukugos);
      setKanjis(allKanjis);
    } catch (err: any) {
      console.error("Gagal memuat data Jukugo:", err);
      setError(err.message || "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle URL query parameters for auto filtering (e.g. ?kanjiId=2521)
  useEffect(() => {
    if (kanjiIdParam) {
      setSelectedKanjiFilter(Number(kanjiIdParam));
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [kanjiIdParam, searchParam]);

  const openAddModal = useCallback(() => {
    setEditingJukugo(null);
    setFormKanjiId(
      selectedKanjiFilter !== "ALL"
        ? selectedKanjiFilter
        : kanjis.length > 0
        ? kanjis[0].id
        : ""
    );
    setFormWord("");
    setFormReading("");
    setFormMeaning("");
    setFormCategories("Kombinasi Utama");
    setModalError("");
    setIsModalOpen(true);
  }, [selectedKanjiFilter, kanjis]);

  const openEditModal = useCallback((item: JukugoItem) => {
    setEditingJukugo(item);
    setFormKanjiId(item.kanjiId);
    setFormWord(item.word);
    setFormReading(item.reading);
    setFormMeaning(item.meaning);
    setFormCategories(
      item.categories ? item.categories.join(", ") : "Kombinasi Utama"
    );
    setModalError("");
    setIsModalOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !formKanjiId ||
        !formWord.trim() ||
        !formReading.trim() ||
        !formMeaning.trim() ||
        !formCategories.trim()
      ) {
        setModalError(
          "Kanji Utama, Kata Jukugo, Cara Baca, Arti, dan Kategori Semantik wajib diisi."
        );
        return;
      }

      try {
        setSubmitting(true);
        setModalError("");

        const categoryArray = formCategories
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);

        const payload = {
          kanjiId: Number(formKanjiId),
          word: formWord.trim(),
          reading: formReading.trim(),
          meaning: formMeaning.trim(),
          categories:
            categoryArray.length > 0 ? categoryArray : ["Kombinasi Utama"],
        };

        if (editingJukugo) {
          await api.admin.jukugos.update(editingJukugo.id, payload);
        } else {
          await api.admin.jukugos.create(payload);
        }

        setIsModalOpen(false);
        await fetchData();
      } catch (err: any) {
        console.error("Gagal menyimpan Jukugo:", err);
        setModalError(err.message || "Gagal menyimpan Jukugo.");
      } finally {
        setSubmitting(false);
      }
    },
    [
      formKanjiId,
      formWord,
      formReading,
      formMeaning,
      formCategories,
      editingJukugo,
      fetchData,
    ]
  );

  const handleDelete = useCallback(
    async (id: number, word: string) => {
      if (!window.confirm(`Apakah Anda yakin ingin menghapus Jukugo "${word}"?`)) {
        return;
      }
      try {
        await api.admin.jukugos.delete(id);
        await fetchData();
      } catch (err: any) {
        alert(err.message || "Gagal menghapus Jukugo.");
      }
    },
    [fetchData]
  );

  const handleNavigateKanji = useCallback(
    (kanjiId?: number) => {
      if (kanjiId) {
        navigate(`/admin/kanji-form?kanjiId=${kanjiId}`);
      } else {
        navigate(`/admin/kanji-form`);
      }
    },
    [navigate]
  );

  // Filtered list computed with useMemo
  const filteredJukugos = useMemo(() => {
    return jukugos.filter((j) => {
      if (selectedKanjiFilter !== "ALL" && j.kanjiId !== selectedKanjiFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        j.word.toLowerCase().includes(q) ||
        j.reading.toLowerCase().includes(q) ||
        j.meaning.toLowerCase().includes(q) ||
        (j.kanji && j.kanji.character.toLowerCase().includes(q))
      );
    });
  }, [jukugos, selectedKanjiFilter, searchQuery]);

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
              <Icon name="menu_book" className="text-indigo-600 text-3xl" />
              Kelola Jukugo (Kata Majemuk)
            </h2>
            <p className="text-body-md text-on-surface-variant font-medium mt-1">
              Kelola data kata majemuk Jukugo. Sistem akan otomatis memecah kata menjadi kanji tunggal dan mendaftarkannya jika belum ada.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AddActionButton
              label="Control Semantic"
              iconName="hub"
              variant="indigo"
              onClick={() =>
                navigate(
                  `/admin/semantic-control${
                    kanjiIdParam ? `?kanjiId=${kanjiIdParam}` : ""
                  }`
                )
              }
            />
            <AddActionButton label="Tambah Jukugo Baru" onClick={openAddModal} />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-outline-variant/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
          <div className="relative w-full md:w-96">
            <Icon
              name="search"
              className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Cari kata, cara baca, atau arti..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs text-slate-500 font-bold whitespace-nowrap">
              Filter Kanji:
            </span>
            <select
              value={selectedKanjiFilter}
              onChange={(e) =>
                setSelectedKanjiFilter(
                  e.target.value === "ALL" ? "ALL" : Number(e.target.value)
                )
              }
              className="bg-slate-50 border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-bold w-full md:w-64 cursor-pointer"
            >
              <option value="ALL">Semua Kanji ({kanjis.length})</option>
              {kanjis.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.character} ({k.romaji || "Tunggal"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-400 gap-3">
            <Icon name="sync" className="w-6 h-6 animate-spin text-primary" />
            <span className="font-semibold text-sm">Memuat data Jukugo...</span>
          </div>
        ) : error ? (
          <div className="bg-error-container text-on-error-container border border-error/20 p-4 rounded-2xl text-center font-bold">
            {error}
          </div>
        ) : filteredJukugos.length === 0 ? (
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
            <Icon name="search_off" className="w-12 h-12 mx-auto text-slate-400 mb-2" />
            <p className="font-bold">Tidak ada data Jukugo yang sesuai kriteria.</p>
          </div>
        ) : (
          <JukugoTable
            jukugos={filteredJukugos}
            kanjis={kanjis}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onNavigateKanji={handleNavigateKanji}
          />
        )}

        {/* Modal Create/Edit Jukugo */}
        <JukugoFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingJukugo={editingJukugo}
          formKanjiId={formKanjiId}
          setFormKanjiId={setFormKanjiId}
          formWord={formWord}
          setFormWord={setFormWord}
          formReading={formReading}
          setFormReading={setFormReading}
          formMeaning={formMeaning}
          setFormMeaning={setFormMeaning}
          formCategories={formCategories}
          setFormCategories={setFormCategories}
          submitting={submitting}
          modalError={modalError}
          handleSubmit={handleSubmit}
          kanjis={kanjis}
        />
      </main>
    </Layout>
  );
};

export default JukugoPage;
