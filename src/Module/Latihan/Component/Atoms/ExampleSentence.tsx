import React from "react";

interface ExampleSentenceProps {
  japanese: string;
  romaji: string;
  translation: string;
}

const ExampleSentence: React.FC<ExampleSentenceProps> = ({
  japanese,
  romaji,
  translation,
}) => {
  const parts = japanese.split("情報");
  return (
    <div className="bg-surface p-md rounded-xl border-b-2 border-surface-container-high hover:border-primary/20 transition-all group select-none">
      <p className="font-body-lg text-body-lg mb-2 text-on-surface group-hover:text-primary transition-colors leading-relaxed">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="font-bold text-primary">情報</span>
            )}
          </React.Fragment>
        ))}
      </p>
      <p className="text-on-surface-variant italic mb-1 text-sm">{romaji}</p>
      <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
        {translation}
      </p>
    </div>
  );
};

export default ExampleSentence;