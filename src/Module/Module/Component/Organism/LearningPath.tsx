import { useNavigate } from "react-router-dom";
import { CheckCircle2, Lock } from "lucide-react";
import type { ModuleItem } from "../../types";
import ModuleCard from "../Molecules/ModuleCard";
import TimelineNode from "../Atom/TimelineNode";
import TimelineConnector from "../Atom/TimelineConnector";

interface Props {
  radicalItems: ModuleItem[];
  kanjiItems: ModuleItem[];
  vocabItems: ModuleItem[];
}

const LearningPath = ({ radicalItems, kanjiItems, vocabItems }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-3xl mx-auto flex flex-col gap-12 md:gap-16 my-12">
      <TimelineConnector />

      {/* RADICAL */}
      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 group">
        <div className="w-full md:w-1/2 flex justify-start md:justify-end order-2 md:order-1 pl-12 md:pl-0">
          <ModuleCard
            title="Radikal"
            difficulty="Kesulitan N4"
            items={radicalItems}
            progress={85}
            color="#2E4482"
            badgeBg="#d5e3ff"
            badgeText="#001c3b"
          />
        </div>

        <TimelineNode>
          <div className="w-12 h-12 rounded-full bg-[#4F7942] text-white shadow-lg flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 fill-white stroke-[#4F7942]" />
          </div>
        </TimelineNode>

        <div className="md:w-1/2 hidden md:block"></div>
      </div>

      {/* KANJI */}
      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 group">
        <div className="md:w-1/2 hidden md:block"></div>

        <TimelineNode>
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border-4 border-[#8f0020] text-[#8f0020] shadow-xl animate-float flex items-center justify-center">
            <span className="text-xl md:text-2xl font-serif font-black">
              漢
            </span>
          </div>
        </TimelineNode>

        <div className="w-full md:w-1/2 flex justify-start order-2 md:order-3 pl-12 md:pl-0">
          <ModuleCard
            title="Inti Kanji"
            difficulty="Kesulitan N4"
            items={kanjiItems}
            progress={32}
            color="#8f0020"
            badgeBg="#ffdad9"
            badgeText="#400009"
            buttonText="Lanjutkan Belajar"
            onButtonClick={() => navigate("/latihan")}
          />
        </div>
      </div>

      {/* VOCAB */}
      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 group opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
        <div className="w-full md:w-1/2 flex justify-start md:justify-end order-2 md:order-1 pl-12 md:pl-0">
          <ModuleCard
            title="Kosakata"
            difficulty="Terkunci"
            items={vocabItems}
            color="#4F7942"
            badgeBg="#edeef0"
            badgeText="#5c403f"
            locked
          />
        </div>

        <TimelineNode>
          <div className="w-12 h-12 rounded-full bg-[#e1e2e4] text-[#5c403f] shadow-md flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
        </TimelineNode>

        <div className="md:w-1/2 hidden md:block"></div>
      </div>
    </div>
  );
};

export default LearningPath;
