import React, { useState, useEffect } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import StatCard from "../Component/Molecules/StatCard";
import JukugoCard from "../Component/Molecules/JukugoCard";
import DailyInsight from "../Component/Molecules/DailyInsight";
import WeeklyActivity from "../Component/Organism/WeeklyActivity";
import ContinueLearning from "../Component/Organism/ContinueLearning";
import { useNavigate } from "react-router-dom";
import { api } from "../../Common/Utility/api";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const result = await api.dashboard.get();
        setData(result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal memuat data dasbor.");
        // Redirect to login if token is expired/invalid
        if (err.message?.includes("Token") || err.message?.includes("Akses ditolak")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-[#8f0020] font-bold animate-pulse text-lg">Memuat data dasbor...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
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

  const { stats, weeklyActivity, recommendedJukugo, continueLearning, dailyInsight } = data;

  return (
    <Layout
      showFAB={true}
      fabLabel="Latih Goresan"
      fabIcon="edit_square"
      fabOnClick={() => navigate("/latihan")}
    >
      <main className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6">
        <div className="flex flex-col gap-md py-md select-none">
          <h2 className="font-headline-lg text-headline-lg text-secondary font-bold">
            Ringkasan Dasbor
          </h2>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-base">
            <StatCard
              icon="school"
              title="Hari Ini"
              label="Pelajaran Hari Ini"
              value={stats.dailyTarget}
            />
            <StatCard
              icon="local_fire_department"
              title="Berkobar"
              label="Rantai Belajar"
              value={stats.streak}
              borderClass="border-b-4 border-primary"
              iconColorClass="text-primary"
            />
            <StatCard
              label="Status Belajar"
              value={stats.level}
              customProgress={
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      className="text-surface-container-high"
                      cx="32"
                      cy="32"
                      fill="transparent"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <circle
                      className="text-tertiary transition-all duration-1000"
                      cx="32"
                      cy="32"
                      fill="transparent"
                      r="28"
                      stroke="currentColor"
                      strokeDasharray="175"
                      strokeDashoffset={175 - (175 * stats.levelProgress) / 100}
                      strokeWidth="4"
                    ></circle>
                  </svg>
                  <span className="absolute font-bold text-caption text-on-surface">
                    {stats.levelProgress}%
                  </span>
                </div>
              }
            />
            <StatCard
              icon="calendar_today"
              title="Sepanjang Waktu"
              label="Total Hari Belajar"
              value={stats.totalDays}
              iconColorClass="text-secondary"
            />
          </div>

          {/* Main Bento Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-md mt-md">
            {/* Left Columns (2 span wide) */}
            <div className="lg:col-span-2 flex flex-col gap-md">
              {/* Weekly Activity chart */}
              <WeeklyActivity data={weeklyActivity} />

              {/* Recommended Jukugo */}
              <div className="flex flex-col gap-base">
                <div className="flex justify-between items-center px-base">
                  <h3 className="font-headline-md text-secondary font-semibold">
                    Rekomendasi Jukugo
                  </h3>
                  <span
                    onClick={() => navigate("/module")}
                    className="text-label-md text-primary font-bold hover:underline cursor-pointer"
                  >
                    Lihat Semua
                  </span>
                </div>

                {/* Horizontal Scroll list */}
                <div className="flex gap-md overflow-x-auto no-scrollbar pb-md px-base">
                  {recommendedJukugo.map((item: any, idx: number) => (
                    <JukugoCard
                      key={idx}
                      kanji={item.kanji}
                      romaji={item.romaji}
                      meaning={item.meaning}
                      borderColorClass={item.border}
                      onClick={() => navigate(`/latihan?char=${encodeURIComponent(item.kanji)}`)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (1 span wide) */}
            <div className="flex flex-col gap-md">
              {/* Continue learning panel */}
              <ContinueLearning 
                moduleTitle={continueLearning.moduleTitle}
                category={continueLearning.category}
                progressPercent={continueLearning.progressPercent}
                level={continueLearning.level}
              />

              {/* Daily insight quote card */}
              <DailyInsight 
                percentage={80}
                insightText={`"${dailyInsight.quote}"`}
              />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default DashboardPage;
