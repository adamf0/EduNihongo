/**
 * Canonical ordering helper for kanji within modules.
 * Specifically handles Modul 4: 職・業・商・務・術 without mutating underlying DB IDs.
 */

export const MODULE_KANJI_CANONICAL_ORDER: Record<string, string[]> = {
  // Modul 4 (id 558): DUNIA KERJA DAN PERDAGANGAN
  "558": ["職", "業", "商", "務", "術"],
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
    const order = ["職", "業", "商", "務", "術"];
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
