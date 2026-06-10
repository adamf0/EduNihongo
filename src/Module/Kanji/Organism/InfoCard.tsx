import React from "react";
import tts from "../../Common/Utility/tts";
import Icon from "../Atoms/Icon";
import Button from "../Atoms/Button";
import KanjiInfoRow from "../Molecules/KanjiInfoRow";
import RadicalBadge from "../Molecules/RadicalBadge";

interface InfoCardProps {
  onyomiTextJp: string;
  onyomiTextRomaji: string;
  kunyomiTextJp: string;
  kunyomiTextRomaji: string;
  definitionText: string;
  radicalChar: string;
  radicalName: string;
  pronounceText: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  onyomiTextJp,
  onyomiTextRomaji,
  kunyomiTextJp,
  kunyomiTextRomaji,
  definitionText,
  radicalChar,
  radicalName,
  pronounceText,
}) => {
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    tts.speak(pronounceText);
  };

  return (
    <section className="bg-white rounded-xl p-8 custom-shadow border border-outline-variant/30">
      <div className="flex justify-between items-center mb-6 border-b border-outline-variant pb-4 flex-wrap gap-2">
        <h4 className="font-bold text-lg uppercase tracking-wider text-primary text-on-surface">
          Informasi Utama
        </h4>
        <Button
          onClick={playAudio}
          className="flex items-center gap-2 text-primary font-bold hover:bg-primary-fixed px-4 py-2 rounded-lg text-on-surface"
        >
          <Icon name="volume_up" className="block text-xl" />
          Dengarkan Audio
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <KanjiInfoRow
            label="On-yomi (Sino-Jepang)"
            type="readings"
            mainText={onyomiTextJp}
            descText={onyomiTextRomaji}
          />
          <KanjiInfoRow
            label="Definisi Singkat"
            type="text"
            text={definitionText}
            borderTop={true}
          />
        </div>
        
        <div className="space-y-4">
          <KanjiInfoRow
            label="Kun-yomi (Asli Jepang)"
            type="readings"
            mainText={kunyomiTextJp}
            descText={kunyomiTextRomaji}
          />
          <RadicalBadge
            radicalChar={radicalChar}
            radicalName={radicalName}
          />
        </div>
      </div>
    </section>
  );
};

export default InfoCard;
