import React, { useState } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import StatCard from "../../Dashboard/Component/Molecules/StatCard";
import BadgeCard from "../Component/Molecules/BadgeCard";
import Icon from "../../Common/Component/Icon";
import { useNavigate } from "react-router-dom";

export const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const [heatmapRange, setHeatmapRange] = useState("30");

  const badges = [
    {
      icon: "star_shine",
      title: "Gerbang Torii",
      description: "Menyelesaikan 100 Kanji N5",
      isUnlocked: true,
      bgClass: "bg-secondary-container",
      iconColor: "text-on-secondary-container",
    },
    {
      icon: "festival",
      title: "Lampion Festival",
      description: "30 Hari Belajar Beruntun",
      isUnlocked: true,
      bgClass: "bg-primary-fixed-dim",
      iconColor: "text-on-primary-fixed-variant",
    },
    {
      icon: "yard",
      title: "Bunga Sakura",
      description: "Kuasai 500 Kanji N2",
      isUnlocked: false,
    },
    {
      icon: "castle",
      title: "Kastil Himeji",
      description: "Kuasai Seluruh Kanji Joyo",
      isUnlocked: false,
    },
  ];

  const reviewKanji = [
    { character: "曜", romaji: "Yō", meaning: "Day of the week" },
    { character: "機", romaji: "Ki", meaning: "Machine/Opportunity" },
    { character: "議", romaji: "Gi", meaning: "Deliberation" },
  ];

  // Helper to generate heatmap dot opacities
  const opacities = [
    "bg-primary/5",
    "bg-primary/20",
    "bg-primary/40",
    "bg-primary/70",
    "bg-primary",
  ];

  const heatmapDotsCount = heatmapRange === "30" ? 42 : 84;
  const heatmapDots = Array.from({ length: heatmapDotsCount }).map((_, i) => {
    // Generate deterministic pseudo-random opacities
    const opacityIdx = (i * 7 + 13) % opacities.length;
    return opacities[opacityIdx];
  });

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
              Lacak riwayat latihan, konsistensi rantai, dan lencana pencapaian
              Anda.
            </p>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-base">
            <StatCard
              icon="menu_book"
              label="Kanji Dikuasai"
              value="1.420 Kanji"
              iconColorClass="text-primary"
            />
            <StatCard
              icon="draw"
              label="Akurat Menulis"
              value="94%"
              iconColorClass="text-secondary"
            />
            <StatCard
              icon="local_fire_department"
              label="Rantai Belajar"
              value="15 Hari"
              borderClass="border-b-4 border-primary"
              iconColorClass="text-primary"
            />
            <StatCard
              icon="layers"
              label="Tingkat Belajar"
              value="Level 12 (Gerbang Besi)"
              iconColorClass="text-tertiary"
            />
          </div>

          {/* Heatmap / Activity Tracker */}
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-md flex-wrap gap-sm">
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

            {/* Dots grid */}
            <div className="flex-1 grid grid-cols-7 md:grid-cols-14 gap-2">
              {heatmapDots.map((opacityClass, idx) => (
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
                <div className="w-3 h-3 rounded-sm bg-primary/5"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/70"></div>
                <div className="w-3 h-3 rounded-sm bg-primary"></div>
              </div>
              <span>Banyak</span>
            </div>
          </div>

          {/* Achievements section */}
          <section className="mb-base">
            <div className="flex justify-between items-end mb-md">
              <div>
                <h3 className="font-headline-md text-headline-md font-semibold">
                  Pencapaian & Lencana
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  Terus belajar untuk membuka lencana bertema budaya Jepang.
                </p>
              </div>
              <button className="text-primary font-bold font-label-md hover:underline cursor-pointer border-none bg-transparent">
                Lihat Semua
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              {badges.map((item, idx) => (
                <BadgeCard
                  key={idx}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  isUnlocked={item.isUnlocked}
                  bgClass={item.bgClass}
                  iconColorClass={item.iconColor}
                />
              ))}
            </div>
          </section>

          {/* Fokus Review / Mistakes Review section */}
          <div className="bg-surface-container-low rounded-xl p-lg flex flex-col gap-base">
            <div className="flex items-center gap-md mb-xs">
              <div className="p-3 bg-error-container rounded-lg">
                <Icon name="warning" className="text-error block text-2xl" />
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                  Fokus Review
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  Kanji yang paling sering salah dalam 7 hari terakhir.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-md items-center">
              {reviewKanji.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate("/latihan")}
                  className="bg-surface-container-lowest p-md rounded-xl flex items-center gap-md border-l-4 border-error shadow-sm min-w-[200px] cursor-pointer hover:translate-y-[-2px] transition-transform"
                >
                  <div className="font-display-kanji text-4xl text-on-surface">
                    {item.character}
                  </div>
                  <div>
                    <div className="font-label-md font-bold text-on-surface">
                      {item.romaji}
                    </div>
                    <div className="text-caption text-on-surface-variant italic">
                      {item.meaning}
                    </div>
                  </div>
                </div>
              ))}

              {/* Latihan Review trigger */}
              <button
                onClick={() => navigate("/latihan")}
                className="flex items-center justify-center p-md border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary transition-all group rounded-xl cursor-pointer bg-transparent py-4 px-6"
              >
                <Icon
                  name="school"
                  className="mr-sm group-hover:animate-pulse block text-xl"
                />
                <span className="font-label-md font-bold">Latihan Review</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ProgressPage;
