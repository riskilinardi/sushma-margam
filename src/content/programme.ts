export type LyricLine = {
  original: string;
  transliteration: string;
  meaning: string;
};

export type ProgrammeItem = {
  slug: string;
  name: string;
  kind: string;
  story: string;
  // Only the pieces that are sung have lyrics.
  lyrics?: LyricLine[];
};

// Placeholder words until Sushma sends the real lyrics.
function sampleLyrics(name: string): LyricLine[] {
  return [1, 2, 3, 4, 5, 6].map((n) => ({
    original: `${name}, line ${n} in the original script`,
    transliteration: `Line ${n} in English letters`,
    meaning: `What line ${n} means`,
  }));
}

const story =
  "A few lines from Sushma on what this piece is about, and what to watch for as she dances it.";

// Which pieces have lyrics is a guess until Sushma confirms her seven songs.
export const programme: ProgrammeItem[] = [
  { slug: "pushpanjali", name: "Pushpanjali", kind: "Invocation", story },
  {
    slug: "ganesha-shlokam",
    name: "Ganesha Shlokam",
    kind: "Prayer",
    story,
    lyrics: sampleLyrics("Ganesha Shlokam"),
  },
  { slug: "jathiswaram", name: "Jathiswaram", kind: "Pure Dance", story },
  {
    slug: "kannanai-paadu-maname",
    name: "Kannanai Paadu Maname",
    kind: "Krishna Shabdam",
    story,
    lyrics: sampleLyrics("Kannanai Paadu Maname"),
  },
  {
    slug: "unnai-ninaindhu",
    name: "Unnai Ninaindhu",
    kind: "Krishna Varnam",
    story,
    lyrics: sampleLyrics("Unnai Ninaindhu"),
  },
  {
    slug: "nagendra-haraya",
    name: "Nagendra Haraya",
    kind: "Shiva Stotra",
    story,
    lyrics: sampleLyrics("Nagendra Haraya"),
  },
  {
    slug: "bala-gopala",
    name: "Bala Gopala",
    kind: "Krishna",
    story,
    lyrics: sampleLyrics("Bala Gopala"),
  },
  {
    slug: "bho-shambho",
    name: "Bho Shambho",
    kind: "Shiva Keertanam",
    story,
    lyrics: sampleLyrics("Bho Shambho"),
  },
  {
    slug: "thillana",
    name: "Thillana",
    kind: "Finale",
    story,
    lyrics: sampleLyrics("Thillana"),
  },
  { slug: "mangalam", name: "Mangalam", kind: "Closing", story },
];

export const songs = programme.filter(
  (item): item is ProgrammeItem & { lyrics: LyricLine[] } =>
    item.lyrics !== undefined,
);
