import React from "react";
import Icon from "../../../Common/Component/Icon";

interface ReadingItem {
  type: "ONYOMI" | "KUNYOMI";
  reading: string;
  example: string;
  icon?: string; // Opsional, karena kita bisa menentukan ikon bawaan berdasarkan 'type'
}

interface KanjiReadingsProps {
  // Mengganti properti onyomi & kunyomi terpisah menjadi satu properti array
  readings?: ReadingItem[];
}

export const KanjiReadings: React.FC<KanjiReadingsProps> = ({ readings }) => {
  // Data fallback default (array) jika parent komponen tidak mengirimkan props
  const defaultReadings: ReadingItem[] = [
    {
      type: "ONYOMI",
      reading: "ガク (GAKU)",
      example: "学生 (Gakusei)",
    },
    {
      type: "KUNYOMI",
      reading: "まな・ぶ (MANABU)",
      example: "学び (Manabi)",
    },
  ];

  // Gunakan data dari props jika ada, jika tidak ada gunakan data default
  const activeReadings = readings || defaultReadings;

  // Fungsi helper untuk menentukan ikon secara otomatis berdasarkan tipe pembacaan
  const getIconName = (type: "ONYOMI" | "KUNYOMI", customIcon?: string) => {
    if (customIcon) return customIcon; // Jika ada ikon kustom dari props, gunakan itu
    return type === "ONYOMI" ? "record_voice_over" : "person_celebrate";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-base">
      {activeReadings.map((data, index) => (
        <div
          key={index}
          className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant hover:shadow-md transition-shadow"
        >
          {/* Bagian Header Tag & Icon Dinamis */}
          <div className="flex items-center gap-2 mb-4 text-japanese-indigo font-semibold">
            <Icon 
              name={getIconName(data.type, data.icon)} 
              className="text-xl block" 
            />
            <span className="font-label-md uppercase tracking-widest text-[10px]">
              {data.type}
            </span>
          </div>

          {/* Bagian Isi Konten */}
          <div className="space-y-1">
            <p className="font-headline-md text-primary font-bold">
              {data.reading}
            </p>
            <p className="text-caption text-on-surface-variant">
              Contoh: {data.example}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanjiReadings;