import React from "react";
import Breadcrumb from "../Molecules/Breadcrumb";
import Badge from "../Atoms/Badge";
import tts from "../../Common/Utility/tts";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface HeaderBlockProps {
  kanji: string;
  meaning: string;
  jlptText: string;
  levelText: string;
  breadcrumbItems: BreadcrumbItem[];
}

export const HeaderBlock: React.FC<HeaderBlockProps> = ({
  kanji,
  meaning,
  jlptText,
  levelText,
  breadcrumbItems,
}) => {
  return (
    <div className="bg-surface-container-low border-b border-outline-variant px-6 lg:px-10 py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex items-baseline gap-4 mt-2">
            <h2 
              onClick={() => tts.speak(kanji)}
              title="Klik untuk mendengar pelafalan"
              className="text-5xl font-display-jp text-primary select-all cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200"
            >
              {kanji}
            </h2>
            <h3 className="text-3xl font-headline-lg text-on-surface-variant">
              {meaning}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="px-4 py-1.5 bg-secondary-fixed text-on-secondary-fixed text-sm rounded-full">
            {jlptText}
          </Badge>
          <Badge className="px-4 py-1.5 bg-primary-fixed text-on-primary-fixed text-sm rounded-full">
            {levelText}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default HeaderBlock;
