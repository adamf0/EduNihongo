import React, { useState, useEffect } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import StatCard from "../../Dashboard/Component/Molecules/StatCard";

import { useNavigate } from "react-router-dom";
import { api } from "../../Common/Utility/api";

export const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const [heatmapRange, setHeatmapRange] = useState("30");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const result = await api.progress.get();
        setData(result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal memuat progres belajar.");
        if (err.message?.includes("Token") || err.message?.includes("Akses ditolak")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-[#8f0020] font-bold animate-pulse text-lg">Memuat progres belajar...</div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6">
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-bold">
            {error}
            <button 
              onClick={() => window.location.reload()} 
              className="block mx-auto mt-4 px-6 py-2 bg-[#8f0020] text-white rounded-full text-sm font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { stats, heatmap } = data;
  const heatmapDots = heatmapRange === "30" ? heatmap.last30Days : heatmap.last90Days;

  return (
    <Layout>
      <main className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6">
        <div className="relative z-10 flex flex-col gap-md py-md select-none">
          {/* Background Texture */}
          <div className="absolute inset-0 seigaiha-pattern pointer-events-none opacity-20 -z-10"></div>

          {/* Header Title */}
          <section className="mb-md">
            <h2 className="font-headline-lg text-headline-lg text-secondary font-bold">
              Progress Belajar
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Lacak riwayat latihan, konsistensi rantai, dan lencana pencapaian Anda.
            </p>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-base">
            <StatCard
              icon="school"
              label="Target Hari Ini"
              value={stats.todayProgress || "0 / 5 Kanji"}
              iconColorClass="text-primary"
            />
            <StatCard
              icon="stars"
              label="XP Hari Ini"
              value={stats.xpToday || "0 XP"}
              iconColorClass="text-primary"
            />
            <StatCard
              icon="local_fire_department"
              label="Rantai Belajar"
              value={stats.streak}
              iconColorClass="text-primary"
            />
            <StatCard
              icon="menu_book"
              label="Kanji Dikuasai"
              value={stats.kanjiMastered}
              iconColorClass="text-secondary"
            />
            <StatCard
              icon="draw"
              label="Penguasaan Menulis"
              value={stats.masteryWriting || "0%"}
              iconColorClass="text-secondary"
            />
            <StatCard
              icon="layers"
              label="Kemajuan Modul"
              value={stats.masteryVocabulary || "0%"}
              iconColorClass="text-secondary"
            />
          </div>

          {/* Heatmap / Activity Tracker */}
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-xs flex-wrap gap-sm">
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                Intensitas Belajar
              </h3>
              <select
                value={heatmapRange}
                onChange={(e) => setHeatmapRange(e.target.value)}
                className="bg-surface-container-low border-none rounded-lg text-caption focus:ring-primary px-3 py-1.5 outline-none cursor-pointer text-sm font-semibold"
              >
                <option value="30">30 Hari Terakhir</option>
                <option value="90">3 Bulan Terakhir</option>
              </select>
            </div>

            <p className="text-body-md text-on-surface-variant mb-md">
              Setiap kotak mewakili aktivitas keaktifan belajar per hari (Harian).
            </p>

            {/* Dots grid */}
            <div className="flex-1 grid grid-cols-7 md:grid-cols-14 gap-2">
              {heatmapDots.map((opacityClass: string, idx: number) => (
                <div
                  key={idx}
                  className={`aspect-square rounded-sm ${opacityClass} transition-transform hover:scale-110 cursor-pointer`}
                  title="Latihan Selesai"
                />
              ))}
            </div>

            {/* Intensity Legend */}
            <div className="mt-md flex items-center justify-end gap-base text-caption text-on-surface-variant font-semibold">
              <span>Kurang</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-surface-container-high"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/70"></div>
                <div className="w-3 h-3 rounded-sm bg-primary"></div>
              </div>
              <span>Banyak</span>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ProgressPage;
