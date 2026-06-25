import React from "react";
import Icon from "../../../Common/Component/Icon";

export const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: "school",
      title: "Kanji Learning",
      description: "Sistem pembelajaran berjenjang dari N5 hingga N1 dengan metodologi mnemonik visual yang dipatenkan.",
      borderColor: "hover:border-primary/30",
      iconBg: "bg-primary-fixed",
      iconColor: "text-on-primary-fixed"
    },
    {
      icon: "draw",
      title: "Stroke Order Animation",
      description: "Lihat dan pelajari urutan guratan yang tepat dengan animasi halus yang membantu memori otot Anda.",
      borderColor: "hover:border-secondary/30",
      iconBg: "bg-secondary-container",
      iconColor: "text-on-secondary-container"
    },
    {
      icon: "gesture",
      title: "Interactive Writing",
      description: "Latihan menulis langsung di layar dengan deteksi kesalahan guratan secara real-time.",
      borderColor: "hover:border-tertiary/30",
      iconBg: "bg-tertiary-fixed",
      iconColor: "text-on-tertiary-fixed"
    },
    {
      icon: "hub",
      title: "Semantic Graph",
      description: "Lihat bagaimana satu Kanji berhubungan dengan ratusan kata lainnya dalam jaring laba-laba makna.",
      borderColor: "hover:border-primary/30",
      iconBg: "bg-primary-container/20",
      iconColor: "text-primary"
    },
    {
      icon: "analytics",
      title: "Jukugo Analysis",
      description: "Bedah setiap kata majemuk (Jukugo) untuk memahami kontribusi makna dari tiap elemen Kanji.",
      borderColor: "hover:border-secondary/30",
      iconBg: "bg-secondary-fixed",
      iconColor: "text-on-secondary-fixed"
    },
    {
      icon: "rule",
      title: "Evaluation",
      description: "Kuis adaptif yang menyesuaikan tingkat kesulitan berdasarkan kecepatan dan akurasi belajar Anda.",
      borderColor: "hover:border-tertiary/30",
      iconBg: "bg-tertiary-fixed-dim/20",
      iconColor: "text-tertiary"
    }
  ];

  return (
    <section className="bg-surface-container-low py-12 relative">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12">
        <div className="mb-12 text-center">
          <h2 className="font-headline-lg text-headline-lg md:text-5xl text-on-surface mb-base">Fitur Utama</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto">
            Dirancang untuk memudahkan kognisi visual dan membangun hubungan konsep Kanji yang kuat.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`group bg-surface-container-lowest p-lg rounded-3xl border border-outline-variant/30 transition-all hover:-translate-y-2 hover:shadow-md ${feature.borderColor}`}
            >
              <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-md group-hover:scale-110 transition-transform`}>
                <Icon name={feature.icon} className={`${feature.iconColor} text-3xl block`} />
              </div>
              <h3 className="font-headline-md text-headline-md mb-base text-on-surface">{feature.title}</h3>
              <p className="text-on-surface-variant font-body-md leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
