import React from "react";
import Layout from "../../Common/Component/Organism/Layout";
import Icon from "../../Common/Component/Icon";
import { useNavigate } from "react-router-dom";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const masteredKanji = [
    { character: "愛", romaji: "Ai", meaning: "Love / Affection" },
    { character: "道", romaji: "Michi", meaning: "Road / Way" },
    { character: "空", romaji: "Sora", meaning: "Sky / Empty" },
  ];

  const activities = [
    {
      icon: "school",
      bgClass: "bg-secondary-container text-on-secondary-container",
      title: "Menyelesaikan Sesi Belajar",
      desc: "Kanji N3 Bab 4",
      time: "2 jam yang lalu",
      xp: "+45 XP",
    },
    {
      icon: "emoji_events",
      bgClass: "bg-tertiary-container text-on-tertiary-container",
      title: "Pencapaian Baru",
      desc: '"Brush Master II"',
      time: "Kemarin",
      xp: "100 Kanji terkuasai",
    },
    {
      icon: "history",
      bgClass: "bg-primary-fixed text-on-primary-fixed",
      title: "Review Harian",
      desc: "20 Kanji dipelajari ulang",
      time: "2 hari yang lalu",
      xp: "Akurasi 95%",
    },
  ];

  const settingsItems = [
    { icon: "person_outline", label: "Detail Akun" },
    { icon: "lock_outline", label: "Keamanan & Sandi" },
    { icon: "notifications_active", label: "Notifikasi Belajar" },
    { icon: "translate", label: "Bahasa Interface" },
  ];

  const masteryBreakdown = [
    { label: "Reading", percentage: 88, colorClass: "bg-primary" },
    { label: "Writing", percentage: 65, colorClass: "bg-secondary" },
    { label: "Vocabulary", percentage: 74, colorClass: "bg-tertiary" },
  ];

  return (
    <Layout>
      <main className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6">
        <div className="relative z-10 flex flex-col gap-md py-md select-none">
          {/* Background Overlay */}
          <div className="absolute inset-0 seigaiha-profile pointer-events-none opacity-20 -z-10"></div>

          {/* Hero Bento Profile Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-4">
            {/* Profile Header Card */}
            <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-md shadow-sm flex flex-col md:flex-row items-center md:items-end gap-6 relative overflow-hidden border border-outline-variant/10">
              <div className="absolute top-0 right-0 p-4 opacity-10 select-none">
                <Icon name="person" className="text-[120px] block" />
              </div>
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg z-10">
                <img
                  className="w-full h-full object-cover"
                  alt="Avatar Haruki Sato"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiQe5kqkxQSznu5qP6MOCvqYEImp869C8EXKrPH0xqE-mSavCz012Q0MTtSiFiePGaV02jEkiMUlPH1dLTj1avEShwCtSPBlbHOZxnVTLhGL0HVhU5xknHCCYedJb-IxKOpMgxpKK-Ow5sIgWFUsyyY7_E-KIuwiPB5-20LhiSP8pqZauZlFtFZIf2EzIHFf1ANexPscHZGB71rWIQwJNpU7zy75AnxMohpp66viSQtkCUk07SBp5f7FtlpU8V_ukuBsXxmpoldEg"
                />
              </div>
              <div className="flex-1 text-center md:text-left z-10">
                <div className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-caption mb-2">
                  Tingkat N3
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1 font-bold">
                  Haruki Sato
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Mastering the strokes since October 2023
                </p>
              </div>
              <div className="z-10 flex gap-2">
                <button
                  onClick={() => alert("Simulasi Pengeditan Profil")}
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md font-bold shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all border-none"
                >
                  Edit Profil
                </button>
              </div>
            </div>

            {/* Quick Stats Bento */}
            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/10 flex flex-col justify-center items-center text-center">
                <span className="font-headline-md text-headline-md text-primary font-bold">
                  342
                </span>
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                  Days Streak
                </span>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/10 flex flex-col justify-center items-center text-center">
                <span className="font-headline-md text-headline-md text-tertiary font-bold">
                  1.240
                </span>
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                  Total XP
                </span>
              </div>
              <div className="col-span-2 bg-secondary text-on-secondary rounded-xl p-4 shadow-sm border border-outline-variant/10 flex items-center justify-between">
                <div>
                  <span className="block font-label-md text-label-md opacity-85">
                    Current Rank
                  </span>
                  <span className="font-headline-md text-headline-md font-bold">
                    Top 5% Learner
                  </span>
                </div>
                <Icon
                  name="military_tech"
                  className="text-4xl opacity-50 block"
                />
              </div>
            </div>
          </div>

          {/* Dashboard Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-md">
            {/* Left Column: Kanji Mastery & Recent Activities */}
            <div className="lg:col-span-2 space-y-8">
              {/* Mastered Kanji Collection */}
              <section>
                <div className="flex justify-between items-end mb-4">
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    Koleksi Kanji Terkuasai
                  </h3>
                  <span
                    onClick={() => navigate("/module")}
                    className="text-primary font-label-md text-label-md hover:underline cursor-pointer font-bold"
                  >
                    Lihat Semua
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {masteredKanji.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate("/latihan")}
                      className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant/10 border-b-2 border-b-primary-fixed text-center group hover:scale-[1.02] transition-transform cursor-pointer"
                    >
                      <div className="font-display-kanji text-[54px] text-on-surface leading-tight mb-2 select-none">
                        {item.character}
                      </div>
                      <div className="font-label-md text-label-md text-on-surface-variant mb-1 font-semibold">
                        {item.romaji}
                      </div>
                      <div className="font-caption text-caption text-primary">
                        {item.meaning}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recent Activity List */}
              <section>
                <h3 className="font-headline-md text-headline-md mb-4 font-bold text-on-surface">
                  Aktivitas Terbaru
                </h3>
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 divide-y divide-surface-variant/30">
                  {activities.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bgClass}`}
                      >
                        <Icon name={item.icon} className="text-xl block" />
                      </div>
                      <div className="flex-1">
                        <p className="font-body-md text-body-md text-on-surface">
                          <span className="font-bold">{item.title}:</span>{" "}
                          {item.desc}
                        </p>
                        <p className="font-caption text-caption text-on-surface-variant">
                          {item.time} • {item.xp}
                        </p>
                      </div>
                      <Icon
                        name="chevron_right"
                        className="text-on-surface-variant block text-xl"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Settings Drawer & Stats charts */}
            <div className="space-y-8">
              {/* Quick account settings */}
              <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <h3 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-4 font-semibold">
                  Pengaturan Akun
                </h3>
                <nav className="space-y-1">
                  {settingsItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => alert(`Simulasi ${item.label}`)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-container transition-colors group cursor-pointer border-none bg-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          name={item.icon}
                          className="text-on-surface-variant group-hover:text-primary text-xl"
                        />
                        <span className="font-body-md text-body-md text-on-surface">
                          {item.label}
                        </span>
                      </div>
                      <Icon
                        name="chevron_right"
                        className="text-on-surface-variant text-sm block"
                      />
                    </button>
                  ))}
                </nav>
                <div className="mt-6 pt-6 border-t border-surface-variant/30">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center gap-3 p-3 text-error hover:bg-error-container/20 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <Icon name="logout" className="text-xl block" />
                    <span className="font-body-md text-body-md font-bold">
                      Keluar
                    </span>
                  </button>
                </div>
              </section>

              {/* Mastery breakdown percentage chart */}
              <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <h3 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-4 font-semibold">
                  Mastery Breakdown
                </h3>
                <div className="space-y-4">
                  {masteryBreakdown.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-caption text-caption mb-1">
                        <span>{item.label}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.colorClass}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ProfilePage;
