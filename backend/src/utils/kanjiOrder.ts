/**
 * Canonical ordering helper for kanji within modules.
 * Specifically handles:
 * - Modul 4: 職・業・商・務・術
 * - Modul 5: 議・論・談・討・意
 * - Modul 6: 経・始・歴・史・期
 * without mutating underlying DB IDs.
 */

export const MODULE_KANJI_CANONICAL_ORDER: Record<string, string[]> = {
  // Modul 4 (id 558): DUNIA KERJA DAN PERDAGANGAN
  "558": ["職", "業", "商", "務", "術"],
  // Modul 5 (id 559): KOMUNIKASI DAN PERTUKARAN IDE
  "559": ["議", "論", "談", "討", "意"],
  // Modul 6 (id 560): WAKTU DAN PENGALAMAN
  "560": ["経", "始", "歴", "史", "期"],
  // Modul 7 (id 561): PERUBAHAN DAN PERKEMBANGAN
  "561": ["化", "発", "展", "成", "増"],
  // Modul 8 (id 562): PROSES BERPIKIR DAN PENALARAN
  "562": ["認", "識", "判", "断", "想"],
};

export function sortModuleKanjis<T extends { character?: string; id?: number }>(
  kanjis: T[],
  moduleIdentifier?: number | string
): T[] {
  if (!Array.isArray(kanjis) || kanjis.length <= 1) return kanjis;

  const isModul4 =
    moduleIdentifier === 558 ||
    moduleIdentifier === "558" ||
    (typeof moduleIdentifier === "string" && /modul\s*4|dunia\s*kerja/i.test(moduleIdentifier)) ||
    kanjis.some((k) => k.character === "職" || k.character === "商");

  if (isModul4) {
    const order = MODULE_KANJI_CANONICAL_ORDER["558"];
    return [...kanjis].sort((a, b) => {
      const idxA = a.character ? order.indexOf(a.character) : -1;
      const idxB = b.character ? order.indexOf(b.character) : -1;
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return (a.id || 0) - (b.id || 0);
    });
  }

  const isModul5 =
    moduleIdentifier === 559 ||
    moduleIdentifier === "559" ||
    (typeof moduleIdentifier === "string" && /modul\s*5|komunikasi/i.test(moduleIdentifier)) ||
    kanjis.some((k) => k.character === "議" || k.character === "論" || k.character === "談");

  if (isModul5) {
    const order = MODULE_KANJI_CANONICAL_ORDER["559"];
    return [...kanjis].sort((a, b) => {
      const idxA = a.character ? order.indexOf(a.character) : -1;
      const idxB = b.character ? order.indexOf(b.character) : -1;
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return (a.id || 0) - (b.id || 0);
    });
  }

  const isModul6 =
    moduleIdentifier === 560 ||
    moduleIdentifier === "560" ||
    (typeof moduleIdentifier === "string" && /modul\s*6|waktu\s*dan\s*pengalaman/i.test(moduleIdentifier)) ||
    kanjis.some((k) => k.character === "経" || k.character === "歴" || k.character === "始");

  if (isModul6) {
    const order = MODULE_KANJI_CANONICAL_ORDER["560"];
    return [...kanjis].sort((a, b) => {
      const idxA = a.character ? order.indexOf(a.character) : -1;
      const idxB = b.character ? order.indexOf(b.character) : -1;
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return (a.id || 0) - (b.id || 0);
    });
  }

  const isModul7 =
    moduleIdentifier === 561 ||
    moduleIdentifier === "561" ||
    (typeof moduleIdentifier === "string" && /modul\s*7|perubahan|perkembangan/i.test(moduleIdentifier)) ||
    kanjis.some((k) => k.character === "化" || k.character === "発" || k.character === "展" || k.character === "成" || k.character === "増");

  if (isModul7) {
    const order = MODULE_KANJI_CANONICAL_ORDER["561"];
    return [...kanjis].sort((a, b) => {
      const idxA = a.character ? order.indexOf(a.character) : -1;
      const idxB = b.character ? order.indexOf(b.character) : -1;
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return (a.id || 0) - (b.id || 0);
    });
  }

  const isModul8 =
    moduleIdentifier === 562 ||
    moduleIdentifier === "562" ||
    (typeof moduleIdentifier === "string" && /modul\s*8|berpikir|penalaran/i.test(moduleIdentifier)) ||
    kanjis.some((k) => k.character === "認" || k.character === "識" || k.character === "判" || k.character === "断" || k.character === "想");

  if (isModul8) {
    const order = MODULE_KANJI_CANONICAL_ORDER["562"];
    return [...kanjis].sort((a, b) => {
      const idxA = a.character ? order.indexOf(a.character) : -1;
      const idxB = b.character ? order.indexOf(b.character) : -1;
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return (a.id || 0) - (b.id || 0);
    });
  }

  // Preserve existing order by ID ascending for all other modules
  return [...kanjis].sort((a, b) => (a.id || 0) - (b.id || 0));
}
