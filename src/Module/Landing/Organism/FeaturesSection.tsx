import React from "react";
import Icon from "../Atoms/Icon";
import FlashcardStack from "../Molecules/FlashcardStack";
import AudioPlayerCard from "../Molecules/AudioPlayerCard";
import StrokePracticeCanvas from "../Molecules/StrokePracticeCanvas";

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface" id="features">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="font-headline-lg text-4xl text-primary">Didesain untuk Fokus Maksimal</h2>
          <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto text-lg">
            Hilangkan gangguan dan fokus pada inti pembelajaran dengan modul "Omiyage" kami yang terstruktur.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Feature 1: Flashcards */}
          <div className="md:col-span-8 group zen-card bg-surface-container-lowest p-10 rounded-[32px] border border-outline-variant/30 flex flex-col lg:flex-row gap-12 items-center overflow-hidden">
            <div className="flex-1 space-y-6">
              <div className="w-14 h-14 bg-primary-fixed rounded-2xl flex items-center justify-center shadow-inner">
                <Icon name="style" className="text-primary text-3xl block" />
              </div>
              <h3 className="font-headline-lg text-primary">Smart Flashcards</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Sistem Spaced Repetition (SRS) kami menyesuaikan dengan kecepatan belajar Anda, memastikan retensi jangka panjang tanpa stres berlebih.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-on-surface-variant font-medium">
                  <Icon
                    name="check_circle"
                    className="text-secondary text-[20px] block"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  />
                  Algoritma Kognitif Adaptif
                </li>
                <li className="flex items-center gap-3 text-on-surface-variant font-medium">
                  <Icon
                    name="check_circle"
                    className="text-secondary text-[20px] block"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  />
                  Kategorisasi Visual N5 - N1
                </li>
              </ul>
            </div>
            <FlashcardStack />
          </div>

          {/* Feature 2: Audio Player Card */}
          <AudioPlayerCard />

          {/* Feature 3: Stroke Practice */}
          <div className="md:col-span-12 zen-card bg-surface-container-low p-10 rounded-[32px] border border-outline-variant/30 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              <StrokePracticeCanvas />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="w-14 h-14 bg-secondary-fixed rounded-2xl flex items-center justify-center shadow-inner">
                <Icon name="edit_note" className="text-on-secondary-fixed text-3xl block" />
              </div>
              <div>
                <h3 className="font-headline-lg text-primary mb-4">Latihan Goresan (Stroke Practice)</h3>
                <p className="text-on-surface-variant text-lg leading-relaxed">
                  Latih memori otot Anda dengan kanvas "Genkouyoushi" digital kami. Pelajari urutan goresan yang benar untuk setiap karakter kanji secara presisi.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2.5 bg-white rounded-full border border-outline-variant font-label-sm text-label-sm shadow-sm text-on-background">
                  Real-time Feedback
                </span>
                <span className="px-5 py-2.5 bg-white rounded-full border border-outline-variant font-label-sm text-label-sm shadow-sm text-on-background">
                  Pressure Sensitive
                </span>
                <span className="px-5 py-2.5 bg-white rounded-full border border-outline-variant font-label-sm text-label-sm shadow-sm text-on-background">
                  Stroke Order Guide
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
