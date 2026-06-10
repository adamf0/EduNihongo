import React from "react";
import Button from "../Atoms/Button";
import Icon from "../Atoms/Icon";
import TestimonialOverlay from "../Molecules/TestimonialOverlay";
import GoalCard from "../Molecules/GoalCard";

export const GoalsSection: React.FC = () => {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest" id="goals">
      <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        {/* Left side (Image & Testimonial) */}
        <div className="relative rounded-[48px] overflow-hidden aspect-[4/5] shadow-2xl group">
          <img
            alt="Japanese Street at Night"
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD18iUMjoN-HhCOrWXuM4G9QUwepWD5Q7rfxQD38sW6oHVIKjh1E4qxAO3W6VAEATLj2JpJdMRAxpsTB3qoK11LFpyL3uGkdhcoPvxvG7XEj2326P7hqGKPq_sH8Ku1WZCiWpQZg0bnHjUm1RMhGaYBdBOSwMy77hK6N116-HZbEKoycCCrURPiypM1VKKNku42qwuI9UPN7nbKgVLI_jo2PcJGiAY1OYEUgXJvOJraMfPvk3aVFivFdtZF1jk-PlSvz8aR3_bpyHs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
          <TestimonialOverlay />
        </div>

        {/* Right side (Milestones description list) */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="font-headline-lg text-4xl text-primary">Tujuan Praktis, Bukan Sekadar Teori</h2>
            <p className="font-body-md text-on-surface-variant text-lg">
              Kurikulum kami dirancang untuk membantu Anda mencapai target nyata dalam waktu singkat dengan pendekatan yang tenang dan terarah.
            </p>
          </div>

          <div className="space-y-10">
            <GoalCard
              icon="flight_takeoff"
              title="Persiapan Wisata"
              description="Pahami papan petunjuk, pesan makanan, dan berinteraksi di hotel dengan modul percakapan esensial kami."
              iconBgClass="bg-secondary-fixed"
              iconTextClass="text-on-secondary-fixed"
            />
            <GoalCard
              icon="school"
              title="Sertifikasi JLPT"
              description="Latihan soal yang dirancang khusus untuk menghadapi ujian JLPT (N5-N1) dengan simulasi waktu nyata yang akurat."
              iconBgClass="bg-primary-fixed"
              iconTextClass="text-on-primary-fixed"
            />
            <GoalCard
              icon="work"
              title="Karir & Bisnis"
              description="Pelajari 'Keigo' (bahasa sopan) dan etika bisnis Jepang untuk membuka peluang karir global Anda."
              iconBgClass="bg-surface-container-high"
              iconTextClass="text-on-surface"
            />
          </div>

          <div className="pt-6">
            <Button
              variant="secondary"
              className="px-10 py-5 rounded-2xl text-white font-headline-lg-mobile text-headline-lg-mobile flex items-center gap-4 group"
            >
              Pilih Jalur Belajarmu
              <Icon
                name="navigation"
                className="transition-transform group-hover:translate-x-2 block text-2xl"
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;
