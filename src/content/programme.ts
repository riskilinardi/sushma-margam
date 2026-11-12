export type ProgrammeItem = {
  name: string;
  kind: string;
  raga?: string;
  tala?: string;
  composer?: string;
  description: string;
};

// The usual order of a Margam, as a placeholder until Sushma confirms hers.
export const programme: ProgrammeItem[] = [
  {
    name: "Pushpanjali",
    kind: "Invocation",
    description:
      "An offering of flowers to the divine, the teachers and the audience.",
  },
  {
    name: "Jatiswaram",
    kind: "Pure dance",
    description:
      "Intricate rhythm and movement set to melody, with no story to tell.",
  },
  {
    name: "Shabdam",
    kind: "Expression",
    description:
      "The first piece to bring in storytelling, often in praise of a deity.",
  },
  {
    name: "Varnam",
    kind: "Centrepiece",
    description:
      "The longest and most demanding piece, weaving pure dance with story.",
  },
  {
    name: "Padam",
    kind: "Expression",
    description:
      "A slow, lyrical piece that lingers on a single emotion, often longing.",
  },
  {
    name: "Keertanam",
    kind: "Devotion",
    description: "A devotional song brought to life through gesture.",
  },
  {
    name: "Tillana",
    kind: "Finale",
    description: "A fast, joyful burst of pure dance full of sculpted poses.",
  },
  {
    name: "Mangalam",
    kind: "Closing",
    description: "A closing prayer of thanks to end the evening.",
  },
];
