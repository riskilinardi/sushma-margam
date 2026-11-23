import type { StaticImageData } from "next/image";
import standing from "@/assets/sushma-standing.jpg";

export type LyricLine = {
  original: string;
  transliteration: string;
  meaning: string;
};

export type ProgrammeItem = {
  slug: string;
  name: string;
  kind: string;
  tagline: string;
  story: string;
  watch?: string;
  listen?: string;
  raagam?: string;
  taalam?: string;
  composer?: string;
  // On its black studio background, as photographed.
  photo: StaticImageData;
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

// Written by Sushma. Every piece uses the same photo until she sends one
// for each, and which pieces have lyrics is still a guess.
export const programme: ProgrammeItem[] = [
  {
    slug: "pushpanjali",
    name: "Pushpanjali",
    kind: "Invocation",
    tagline: "An offering of flowers",
    story:
      "An invocatory opening Nritta piece which translates to an ‘offering of flowers’. The dancer lays down symbolic flowers at the feet of the Divine, in honour of her Gurus, and to everyone present.",
    watch: "Clean lines, sharp angles and aesthetic poses.",
    raagam: "Nattai",
    taalam: "Adi",
    composer: "Murali Pavithran",
    photo: standing,
  },
  {
    slug: "ganesha-shlokam",
    name: "Ganesha Shlokam",
    kind: "Prayer",
    tagline: "Remover of obstacles",
    story:
      "Performed at the beginning to invoke Lord Ganesha as the remover of obstacles, it helps the dancer anchor stability and balance and, as a patron of the arts, ensures a smooth, focused and auspicious journey.",
    watch:
      "The hand gestures (mudras) that depict Ganesha’s trunk, tusk, large ears and his big belly.",
    photo: standing,
    lyrics: sampleLyrics("Ganesha Shlokam"),
  },
  {
    slug: "jathiswaram",
    name: "Jathiswaram",
    kind: "Pure Dance",
    tagline: "Melody meets rhythm",
    story:
      "A pure dance seamlessly blending melodies (Swaras) and multiple rhythmic patterns of syllables set to a beat (Jathis).",
    watch: "Clean lines and rhythmic precision.",
    raagam: "Hindolam",
    taalam: "Adi",
    photo: standing,
  },
  {
    slug: "kannanai-paadu-maname",
    name: "Kannanai Paadu Maname",
    kind: "Krishna Shabdam",
    tagline: "An ode to Krishna",
    story:
      "A Shabdam that is an ode to Lord Krishna, calling on one’s inner mind to devote oneself to him every day, and highlighting key events of his lore.",
    watch:
      "Hand gestures (mudras) that depict Krishna’s bamboo flute and peacock feather, and cheeky expressions that showcase his playful personality.",
    raagam: "Yamunakalyani",
    taalam: "Adi",
    composer: "Guru Surajananda",
    photo: standing,
    lyrics: sampleLyrics("Kannanai Paadu Maname"),
  },
  {
    slug: "unnai-ninaindhu",
    name: "Unnai Ninaindhu",
    kind: "Krishna Varnam",
    tagline: "Thinking of you",
    story:
      "Centres on single-minded devotion and longing for Lord Krishna. As a Varnam, it anchors the Margam by weaving together intricate rhythmic footwork (Jathis) with layered emotional storytelling (Abhinaya), where each recurring line opens up memories and layers of complex feelings.",
    watch:
      "How crisp, measured footwork (Jathis and Korvais) alternates with slower expressive passages, where the dancer unpacks the meaning of each line through facial expressions (Rasas) and hand gestures (mudras).",
    raagam: "Devamanohari",
    taalam: "Adi",
    composer: "Pappanasam Sivan",
    photo: standing,
    lyrics: sampleLyrics("Unnai Ninaindhu"),
  },
  {
    slug: "nagendra-haraya",
    name: "Nagendra Haraya",
    kind: "Shiva Stotra",
    tagline: "Five sacred syllables",
    story:
      "A classic Sanskrit hymn in praise of Lord Shiva, this meditative piece weaves devotion to him around the five sacred syllables Na-Ma-Shi-Va-Ya (Panchakshara). Each verse salutes one syllable while painting a vivid portrait of Shiva.",
    watch:
      "Hand gestures (mudras) and stances (sthaanakas) that depict Shiva’s attributes, such as the snakes, the trident, the Ganga and his blue throat.",
    listen:
      "The refrain “Tasmai Na/Ma/Shi/Va/Ya karaya Namah Shivaya” at the end of each verse.",
    taalam: "Khanda Chapu",
    composer: "Adi Shankaracharya",
    photo: standing,
    lyrics: sampleLyrics("Nagendra Haraya"),
  },
  {
    slug: "bala-gopala",
    name: "Bala Gopala",
    kind: "Krishna",
    tagline: "Krishna, the protector",
    story:
      "A richly detailed portrait of Lord Krishna as an ocean of compassion, valour, and the supreme protector of the universe. Through Sanskrit imagery, the composition melds his tender, playful grace with his heroic strength as a cosmic guardian of his devotees.",
    watch:
      "Hand gestures (mudras) that depict Krishna’s bamboo flute, and how the dancer shifts between soft, fluid expressions and bold, intense movements when the music recounts his battle against tyranny.",
    raagam: "Bhairavi",
    taalam: "Adi",
    composer: "Sri Muthuswami Dikshitar",
    photo: standing,
    lyrics: sampleLyrics("Bala Gopala"),
  },
  {
    slug: "bho-shambho",
    name: "Bho Shambho",
    kind: "Shiva Keertanam",
    tagline: "The Lord of Dance",
    story:
      "A Keertanam that acts as an ecstatic call to Lord Shiva in his cosmic form as Nataraja, the Lord of Dance. It traces a longing to move beyond worldly boundaries and merge with Shiva’s boundless cosmic presence, all through the dancer’s movement and devotional aura.",
    watch:
      "Gestures and postures that mirror calling out and seeking divine guidance and union, and the hand gestures (mudras) and stances (sthaanakas) that depict Shiva’s attributes, such as the snakes, the trident, the Ganga and his blue throat.",
    raagam: "Revathi",
    taalam: "Adi",
    composer: "Swami Dayananda Saraswati",
    photo: standing,
    lyrics: sampleLyrics("Bho Shambho"),
  },
  {
    slug: "thillana",
    name: "Thillana",
    kind: "Finale",
    tagline: "A jubilant finale",
    story:
      "Driven by lively rhythmic syllables and melodic phrases, this piece celebrates speed, sculptural geometry and musical interplay, pausing briefly for a poetic tribute to Lord Rama before surging to a jubilant finish.",
    watch:
      "The visual symmetry of the choreography: clean pathways, brisk turns and sudden freezes into poses. Also the hand gestures (mudras) that depict Lord Rama’s bow and arrow.",
    raagam: "Amrithavarshini",
    taalam: "Adi",
    composer: "Madurai N. Krishna",
    photo: standing,
    lyrics: sampleLyrics("Thillana"),
  },
  {
    slug: "mangalam",
    name: "Mangalam",
    kind: "Closing",
    tagline: "An auspicious farewell",
    story:
      "The traditional concluding item, offering deep gratitude and an auspicious farewell to close the performance.",
    photo: standing,
  },
];

export const songs = programme.filter(
  (item): item is ProgrammeItem & { lyrics: LyricLine[] } =>
    item.lyrics !== undefined,
);
