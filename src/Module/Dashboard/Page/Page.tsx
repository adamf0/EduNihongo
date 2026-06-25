import React from "react";
import Layout from "../../Common/Component/Organism/Layout";
import StatCard from "../Component/Molecules/StatCard";
import JukugoCard from "../Component/Molecules/JukugoCard";
import DailyInsight from "../Component/Molecules/DailyInsight";
import WeeklyActivity from "../Component/Organism/WeeklyActivity";
import ContinueLearning from "../Component/Organism/ContinueLearning";
import { useNavigate } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const jukugoList = [
    {
      kanji: "学習",
      romaji: "Gakushū",
      meaning: "Belajar, Pembelajaran",
      border: "border-l-4 border-secondary",
    },
    {
      kanji: "先生",
      romaji: "Sensei",
      meaning: "Guru, Penguasa",
      border: "border-l-4 border-primary",
    },
    {
      kanji: "大学",
      romaji: "Daigaku",
      meaning: "Universitas",
      border: "border-l-4 border-tertiary",
    },
    {
      kanji: "毎日",
      romaji: "Mainichi",
      meaning: "Setiap Hari",
      border: "border-l-4 border-secondary",
    },
  ];

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
              value="Target: 5 Kanji, 10 Kosakata"
            />
            <StatCard
              icon="local_fire_department"
              title="Berkobar"
              label="Rantai Belajar"
              value="15 Hari"
              borderClass="border-b-4 border-primary"
              iconColorClass="text-primary"
            />
            <StatCard
              label="Progres Tingkat"
              value="Tingkat N3"
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
                      strokeDashoffset="61"
                      strokeWidth="4"
                    ></circle>
                  </svg>
                  <span className="absolute font-bold text-caption text-on-surface">
                    65%
                  </span>
                </div>
              }
            />
            <StatCard
              icon="calendar_today"
              title="Sepanjang Waktu"
              label="Total Hari Belajar"
              value="42 Hari"
              iconColorClass="text-secondary"
            />
          </div>

          {/* Main Bento Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-md mt-md">
            {/* Left Columns (2 span wide) */}
            <div className="lg:col-span-2 flex flex-col gap-md">
              {/* Weekly Activity chart */}
              <WeeklyActivity />

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
                  {jukugoList.map((item, idx) => (
                    <JukugoCard
                      key={idx}
                      kanji={item.kanji}
                      romaji={item.romaji}
                      meaning={item.meaning}
                      borderColorClass={item.border}
                      onClick={() => navigate("/module-detail")}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (1 span wide) */}
            <div className="flex flex-col gap-md">
              {/* Continue learning panel */}
              <ContinueLearning />

              {/* Daily insight quote card */}
              <DailyInsight />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default DashboardPage;
