export type Photo = {
  alt: string;
  shape: "portrait" | "tall" | "square" | "landscape";
};

// Placeholders, named after the kinds of photos worth asking Sushma for.
export const gallery: Photo[] = [
  { alt: "Photoshoot", shape: "portrait" },
  { alt: "Ankle bells", shape: "square" },
  { alt: "Rehearsal", shape: "landscape" },
  { alt: "With her guru", shape: "tall" },
  { alt: "Costume detail", shape: "square" },
  { alt: "Backstage", shape: "portrait" },
];
