import React, { useState, useEffect, useCallback, useMemo } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import Icon from "../../Common/Component/Icon";
import { api } from "../../Common/Utility/api";
import { useNavigate } from "react-router-dom";
import { AddActionButton } from "../../Common/Component/Atoms/AddActionButton";
import {
  CategoryFormModal,
  type CategoryItem,
} from "../Component/Organism/CategoryFormModal";

export const CategoryListPage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const list = await api.admin.categories.list();
      setCategories(list);
    } catch (err: any) {
      console.error("Gagal memuat data kategori:", err);
      setError(err.message || "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAddModal = useCallback(() => {
    setEditingCategory(null);
    setFormName("");
    setFormDescription("");
    setModalError("");
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((item: CategoryItem) => {
    setEditingCategory(item);
    setFormName(item.name);
    setFormDescription(item.description || "");
    setModalError("");
    setIsModalOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formName.trim()) {
        setModalError("Nama kategori wajib diisi.");
        return;
      }

      try {
        setSubmitting(true);
        setModalError("");

        const payload = {
          name: formName.trim(),
          description: formDescription.trim() || undefined,
        };

        if (editingCategory) {
          await api.admin.categories.update(editingCategory.id, payload);
        } else {
          await api.admin.categories.create(payload);
        }

        setIsModalOpen(false);
        await fetchData();
      } catch (err: any) {
        console.error("Gagal menyimpan kategori:", err);
        setModalError(err.message || "Gagal menyimpan kategori.");
      } finally {
        setSubmitting(false);
      }
    },
    [formName, formDescription, editingCategory, fetchData]
  );

  const handleDelete = useCallback(
    async (id: number, name: string) => {
      if (
        !window.confirm(
          `Apakah Anda yakin ingin menghapus kategori "${name}"?`
        )
      ) {
        return;
      }
      try {
        await api.admin.categories.delete(id);
        await fetchData();
      } catch (err: any) {
        alert(err.message || "Gagal menghapus kategori.");
      }
    },
    [fetchData]
  );

  // Filtered list
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

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
              <Icon name="category" className="text-indigo-600 text-3xl" />
              Kelola Kategori Kanji
            </h2>
            <p className="text-body-md text-on-surface-variant font-medium mt-1">
              Manajemen kategori semantik kanji &amp; jukugo (misal: Kombinasi Utama, Aktivitas, Ekonomi, Pendidikan).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AddActionButton label="Tambah Kategori Baru" onClick={openAddModal} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-outline-variant/30 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="relative w-full md:w-96">
            <Icon
              name="search"
              className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Cari nama atau deskripsi kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-medium"
            />
          </div>
          <span className="text-xs font-bold text-slate-500 hidden md:inline">
            Total: {categories.length} Kategori
          </span>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-400 gap-3">
            <Icon name="sync" className="w-6 h-6 animate-spin text-primary" />
            <span className="font-semibold text-sm">Memuat data Kategori...</span>
          </div>
        ) : error ? (
          <div className="bg-error-container text-on-error-container border border-error/20 p-4 rounded-2xl text-center font-bold">
            {error}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
            <Icon name="search_off" className="w-12 h-12 mx-auto text-slate-400 mb-2" />
            <p className="font-bold">Tidak ada data Kategori yang sesuai.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-outline-variant/20 text-[11px] uppercase text-slate-500 font-extrabold tracking-wider">
                    <th className="py-4 px-4 w-16">ID</th>
                    <th className="py-4 px-4 min-w-[200px]">NAMA KATEGORI</th>
                    <th className="py-4 px-4 min-w-[300px]">DESKRIPSI</th>
                    <th className="py-4 px-4 text-center w-28">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-on-surface font-medium">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/60 transition-all">
                      <td className="py-4 px-4 text-xs font-mono font-bold text-slate-400">
                        #{cat.id}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-full font-bold inline-flex items-center gap-1">
                          <Icon name="label" className="text-xs text-emerald-600" />
                          {cat.name}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600 font-medium">
                        {cat.description || "-"}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer bg-transparent border-none transition-all"
                            title="Edit Kategori"
                          >
                            <Icon name="edit" className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer bg-transparent border-none transition-all"
                            title="Hapus Kategori"
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
          </div>
        )}

        {/* Modal Form Category Organism */}
        <CategoryFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingCategory={editingCategory}
          formName={formName}
          setFormName={setFormName}
          formDescription={formDescription}
          setFormDescription={setFormDescription}
          submitting={submitting}
          modalError={modalError}
          handleSubmit={handleSubmit}
        />
      </main>
    </Layout>
  );
};

export default CategoryListPage;
