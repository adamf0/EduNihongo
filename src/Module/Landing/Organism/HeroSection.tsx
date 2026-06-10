import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Atoms/Button";
import Badge from "../Atoms/Badge";
import Icon from "../Atoms/Icon";
import ZenKanjiCard from "../Molecules/ZenKanjiCard";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden hero-gradient px-margin-mobile md:px-margin-desktop py-16">
      <div className="max-w-container-max mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left column (Text content) */}
        <div className="z-10 space-y-10 animate-fade-in text-center lg:text-left">
          <Badge
            icon="verified"
            className="px-4 py-1.5 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed-variant mx-auto lg:mx-0"
          >
            Belajar dengan Metode Zen yang Menenangkan
          </Badge>
          <h1 className="font-display-jp text-[48px] md:text-display-jp text-primary leading-[1.1] max-w-2xl">
            Kuasai Bahasa Jepang Tanpa Rasa Lelah.
          </h1>
          <p className="font-body-lg-jp text-on-surface-variant max-w-xl mx-auto lg:mx-0 text-lg">
            NihongoZen menggabungkan estetika minimalis dengan teknologi kognitif modern untuk membantu Anda belajar kanji, kosa kata, dan tata bahasa secara organik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
            <Button
              variant="primary"
              onClick={() => navigate("/dashboard")}
              className="px-10 py-5 rounded-xl font-headline-lg-mobile text-white text-headline-lg-mobile shadow-xl flex items-center justify-center gap-3 hover:shadow-primary/20"
            >
              Mulai Belajar 
              <Icon name="arrow_forward" className="block text-2xl" />
            </Button>
            {/* <Button
              variant="outline"
              className="px-10 py-5 rounded-xl font-headline-lg-mobile text-headline-lg-mobile"
            >
              Coba Demo
            </Button> */}
          </div>
        </div>

        {/* Right column (Card with background blobs) */}
        <div className="relative flex justify-center items-center">
          <ZenKanjiCard />
          {/* Decorative Elements */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary-fixed rounded-full blur-3xl opacity-40 -z-10"></div>
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-primary-fixed rounded-full blur-3xl opacity-30 -z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
