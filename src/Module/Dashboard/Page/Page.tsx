import React, { useState } from "react";
import Sidebar from "../../Common/Component/Sidebar";
import TopBar from "../Organism/TopBar";
import LessonCard from "../Organism/LessonCard";
import PracticeCard from "../Organism/PracticeCard";
import JLPTProgress from "../Organism/JLPTProgress";
import StreakProgress from "../Molecules/StreakProgress";
import StatItem from "../Molecules/StatItem";
import QuoteCard from "../Molecules/QuoteCard";
import BottomNav from "../Organism/BottomNav";

export const Page: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mockUser = {
    name: "Budi-san",
    level: 1,
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCno7UeyXUItpBapd8NK5QDfF_cF2g0EK7U-wDra_LAsGvEVCB47TcoIB7vrS95cIPh86E63OdfLWNdmKaDgfim-ZDFNRBAgeTMsTJIQK0GiqSHGQ48CHv9513llITxX6u3Ieaw31qDDKtgfEDKnNSxwo_F5vDFp6ThNhpAPVd_6S0SKtdgqqnrcutS5ovQIzKWYA-3kgX9Hv51bpY480GY0nH2JjgFYYw32sMpoltmieSwDkt5jAeE0XSO4GK8D4aV-TOuNHpPvQQ",
    streakDays: 12,
    targetDays: 20,
    totalStudyDays: 156,
  };

  const mockLesson = {
    titleJp: "おはようございます",
    titleRomaji: "Ohayou gozaimasu",
    translation: "Selamat Pagi",
    durationText: "• 15 Menit",
  };

  const mockMotivation = {
    quoteJp: "七転び八起き",
    quoteRomaji: "Nanakorobi yaoki",
    translation: "Tujuh kali jatuh, delapan kali bangun.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtFQvceBcT0qxOos9Rrr4jtFtXotZFhirQDsZgszNNuw_SgLAmx4HY-wReT5FyYyB4kRmruVfl6oRNcEZSVFRARDRhy7C8F_C2TE_bQK7ojWNm1rECe3XRDHvztNQJnxX4FNrygzqT_1Nmz3EocO3GMgbyDqNpi2wjnxt8ZoDsDCoy-8fVqmQ6ImMwrL7wwi8S06rso07-i9tQCCwiY3s9CPvjF52KtW4mL6ruF_ZMh1Fl42n3P8zOMXC4yCHuUyq68UTdmlUMEGA",
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-body">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeRoute="home"
      />

      {/* Main Content Wrapper */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top App Bar */}
        <TopBar
          onMenuClick={() => setIsSidebarOpen(true)}
          // streakDays={mockUser.streakDays}
          userName={mockUser.name}
          userLevel={mockUser.level}
          userAvatarUrl={mockUser.avatarUrl}
        />

        {/* Dashboard Grid Content */}
        <main className="p-4 md:p-6 lg:p-10 max-w-[1400px] w-full mx-auto space-y-6 lg:space-y-8 flex-grow">
          {/* Welcome Header */}
          <section className="select-none">
            <h1 className="font-headline-lg text-2xl md:text-3xl text-primary mb-2 text-on-surface">
              Kon'nichiwa, {mockUser.name}!
            </h1>
            <p className="text-on-surface-variant text-sm md:text-base">
              Mari kita lanjutkan perjalanan bahasa Jepangmu hari ini.
            </p>
          </section>

          {/* Grid sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Left Column: Lesson, Practice, Progress */}
            <div className="lg:col-span-8 space-y-gutter">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <LessonCard
                  titleJp={mockLesson.titleJp}
                  titleRomaji={mockLesson.titleRomaji}
                  translation={mockLesson.translation}
                  durationText={mockLesson.durationText}
                />
                <PracticeCard />
              </div>

              <JLPTProgress
                n5Percentage={80}
                n4Percentage={25}
                kanjiCount={142}
                kanjiTotal={200}
                vocabCount={850}
                vocabTotal={1200}
              />
            </div>

            {/* Right Column: Streaks and Motivation */}
            <div className="lg:col-span-4 space-y-gutter">
              <StreakProgress
                days={mockUser.streakDays}
                targetDays={mockUser.targetDays}
              />
              
              <StatItem
                variant="card"
                icon="calendar_today"
                title="Total Hari Belajar"
                value={`${mockUser.totalStudyDays} Hari`}
                iconBgClass="bg-secondary-fixed/30"
                iconTextClass="text-secondary"
              />

              <QuoteCard
                quoteJp={mockMotivation.quoteJp}
                quoteRomaji={mockMotivation.quoteRomaji}
                translation={mockMotivation.translation}
                imageUrl={mockMotivation.imageUrl}
              />
            </div>
          </div>
        </main>

        {/* Sticky Bottom Nav (Mobile Only) */}
        <BottomNav activeRoute="home" />
      </div>
    </div>
  );
};

export default Page;
