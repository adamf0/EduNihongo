import React from "react";
import Header from "../Organism/Header";
import HeroSection from "../Organism/HeroSection";
import FeaturesSection from "../Organism/FeaturesSection";
import GoalsSection from "../Organism/GoalsSection";
import CTASection from "../Organism/CTASection";
import Footer from "../Organism/Footer";

export const Page: React.FC = () => {
  return (
    <div className="font-body text-on-surface bg-background min-h-screen flex flex-col">
      <Header />
      <main className="pt-16 flex-grow">
        <HeroSection />
        <FeaturesSection />
        <GoalsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Page;
