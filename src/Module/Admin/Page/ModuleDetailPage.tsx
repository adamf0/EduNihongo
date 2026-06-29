import React, { useState, useEffect } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import Icon from "../../Common/Component/Icon";
import { api } from "../../Common/Utility/api";
import { useNavigate, useSearchParams } from "react-router-dom";

interface ModuleData {
  id: number;
  title: string;
}

interface KanjiData {
  id: number;
  character: string;
  romaji: string;
  meaning: string;
  onyomi: string | null;
  kunyomi: string | null;
  isJukugo: boolean;
  border: string | null;
  moduleId: number | null;
  examples: any[];
  graphNodes: any[];
  graphEdges: any[];
}

export const ModuleDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleIdStr = searchParams.get("id");
  const moduleId = moduleIdStr ? parseInt(moduleIdStr, 10) : null;

  const [module, setModule] = useState<ModuleData | null>(null);
  const [kanjis, setKanjis] = useState<KanjiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadModuleAndKanjis = async () => {
    if (!moduleId) {
      setError("ID Modul tidak valid.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      
      // Fetch modules to find name
      const allModules = await api.admin.modules.list();
      const currentMod = allModules.find((m: any) => m.id === moduleId);
      if (!currentMod) {
        setError("Modul tidak ditemukan.");
        setLoading(false);
        return;
      }
      setModule(currentMod);

      // Fetch Kanjis filter by module ID
      const allKanjis = await api.admin.kanjis.list();
      const filtered = allKanjis.filter((k: any) => k.moduleId === moduleId);
      setKanjis(filtered);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat detail modul.");
      if (err.message?.includes("Token") || err.message?.includes("Akses ditolak")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModuleAndKanjis();
  }, [moduleId, navigate]);

  const handleDeleteKanji = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kanji ini beserta seluruh progres dan grafik terkait?")) {
      return;
    }
    try {
      setLoading(true);
      await api.admin.kanjis.delete(id);
      loadModuleAndKanjis();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus kanji.");
      setLoading(false);
    }
  };

  if (loading && !module) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center min-h-[400px]">
          <div className="text-primary font-bold animate-pulse text-lg">Memuat Detail Modul...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-grow w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6">
        <div className="flex flex-col gap-base">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-base border-b border-outline-variant/30 pb-base">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface flex items-center gap-sm">
                <Icon name="folder_open" className="text-primary text-3xl" />
                Detail Modul: {module?.title || "Loading..."}
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Kelola kurikulum daftar karakter kanji, contoh kalimat, dan simpul graf semantik dari modul ini.
              </p>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 border border-outline hover:bg-surface-container transition-all cursor-pointer font-bold text-on-surface bg-transparent rounded-lg flex items-center gap-sm text-sm"
            >
              <Icon name="arrow_back" className="text-lg" />
              Kembali ke Kelola Modul
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-error-container text-on-error-container border border-error/20 rounded-xl font-semibold">
              {error}
            </div>
          )}

          {/* Kanji list in module */}
          <div className="flex flex-col gap-md">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                Daftar Kanji Terdaftar
              </h3>
              <button
                onClick={() => navigate(`/admin/kanji-form?moduleId=${moduleId}`)}
                className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all border-none flex items-center gap-sm text-sm"
              >
                <Icon name="add" className="text-lg" />
                Tambah Kanji Baru
              </button>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20 text-label-md text-on-surface-variant font-semibold">
                    <th className="p-4 w-24 text-center">Kanji</th>
                    <th className="p-4">Romaji</th>
                    <th className="p-4">Arti / Terjemahan</th>
                    <th className="p-4">Onyomi / Kunyomi</th>
                    <th className="p-4">Struktur Simpul (Nodes)</th>
                    <th className="p-4 w-36 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-md text-on-surface">
                  {kanjis.map((kj) => (
                    <tr key={kj.id} className="hover:bg-surface-container-low/50">
                      <td className="p-4 text-center">
                        <span className="font-display-kanji text-4xl block font-normal text-on-surface">
                          {kj.character}
                        </span>
                      </td>
                      <td className="p-4 font-bold">{kj.romaji}</td>
                      <td className="p-4 text-on-surface-variant text-sm">{kj.meaning}</td>
                      <td className="p-4 text-xs font-mono">
                        <span className="block text-primary">On: {kj.onyomi || "-"}</span>
                        <span className="block text-secondary">Kun: {kj.kunyomi || "-"}</span>
                      </td>
                      <td className="p-4 text-xs text-slate-500 font-mono">
                        {kj.graphNodes.length} Nodes • {kj.graphEdges.length} Edges
                      </td>
                      <td className="p-4 text-center flex items-center justify-center gap-sm">
                        <button
                          onClick={() => navigate(`/admin/kanji-form?moduleId=${moduleId}&kanjiId=${kj.id}`)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg cursor-pointer bg-transparent border-none"
                          title="Edit Kanji"
                        >
                          <Icon name="edit" className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleDeleteKanji(kj.id)}
                          className="p-2 text-error hover:bg-error/10 rounded-lg cursor-pointer bg-transparent border-none"
                          title="Hapus Kanji"
                        >
                          <Icon name="delete" className="text-xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {kanjis.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-on-surface-variant italic">
                        Belum ada Kanji yang terdaftar pada modul ini. Silakan tambah Kanji pertama Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ModuleDetailPage;
