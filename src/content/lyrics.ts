export type LyricLine = {
  original: string;
  transliteration: string;
  meaning: string;
};

// Placeholder until Sushma picks the song.
export const lyrics = {
  title: "Song title",
  details: "Raga · Tala · Composer",
  lines: [1, 2, 3, 4].map((n): LyricLine => ({
    original: `Line ${n} in the original script`,
    transliteration: `Line ${n} in English letters`,
    meaning: `What line ${n} means`,
  })),
};
