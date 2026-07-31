export interface KanjiBaseItem {
  id?: number;
  character?: string;
  romaji?: string | null;
  meaning?: string | null;
  moduleId?: number | null;
}

/**
  * Check if Kanji data is incomplete.
  * A Kanji is considered incomplete if it is missing or has empty romaji.
  */
export const isKanjiIncomplete = (k?: KanjiBaseItem | null): boolean => {
  if (!k) return true;
  return !k.romaji || !k.romaji.trim();
};
