import React, { useState, useEffect } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import StatCard from "../Component/Molecules/StatCard";
import Icon from "../../Common/Component/Icon";
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

  const { stats, weeklyActivity, activities, continueLearning, dailyInsight } = data;

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-base">
            <StatCard
              icon="school"
              title="Hari Ini"
              label="Target Hari Ini"
              value={stats.dailyTarget || "0 / 5 Kanji"}
              iconColorClass="text-primary"
            />
            <StatCard
              icon="stars"
              title="Hari Ini"
              label="XP Didapatkan"
              value={stats.xpToday || "0 XP"}
              iconColorClass="text-primary"
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
              icon="calendar_today"
              title="Sepanjang Waktu"
              label="Total Hari Belajar"
              value={stats.totalDays}
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

          {/* Main Bento Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-md mt-md">
            {/* Left Columns (2 span wide) */}
            <div className="lg:col-span-2 flex flex-col gap-md">
              {/* Weekly Activity chart */}
              <WeeklyActivity data={weeklyActivity} />

              {/* Recent Activities */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <h3 className="font-headline-md text-secondary font-semibold flex items-center gap-2">
                    <Icon name="history" className="text-primary text-xl" />
                    Aktivitas Belajar Terbaru
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {activities && activities.length > 0 ? (
                    activities.map((act: any) => {
                      let typeIcon = "school";
                      let iconBg = "bg-primary/10 text-primary";
                      if (act.activityType === "REVIEW") {
                        typeIcon = "history_edu";
                        iconBg = "bg-tertiary/10 text-tertiary";
                      } else if (act.activityType === "ACHIEVEMENT") {
                        typeIcon = "emoji_events";
                        iconBg = "bg-[#d5e3ff] text-[#001c3b]";
                      }

                      return (
                        <div key={act.id} className="flex justify-between items-center p-3 bg-surface-container-low/30 rounded-xl border border-outline-variant/10">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${iconBg} flex items-center justify-center rounded-lg`}>
                              <Icon name={typeIcon} className="text-xl" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-on-surface">{act.description}</p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                {new Date(act.date).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-emerald-600">
                            +{act.xpEarned} XP
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-slate-400 italic text-sm">
                      Belum ada aktivitas belajar tercatat untuk hari ini.
                    </div>
                  )}
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
                nextKanji={continueLearning.nextKanji}
                nextKanjiRomaji={continueLearning.nextKanjiRomaji}
                nextKanjiMeaning={continueLearning.nextKanjiMeaning}
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
