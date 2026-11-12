import { Section } from "@/components/ui/Section";
import { lyrics } from "@/content/lyrics";

// The last section is dressed like a saree's pallu: the richest part,
// framed with woven gold bands.
export function Lyrics() {
  return (
    <Section
      id="lyrics"
      eyebrow="Lyrics"
      title={lyrics.title}
      intro={lyrics.details}
      className="bg-[radial-gradient(ellipse_at_50%_35%,var(--maroon-800),transparent_70%)]"
    >
      <div
        aria-hidden="true"
        className="mx-auto h-4 max-w-sm zari-band text-gold-500/70"
      />

      <ol className="mx-auto my-12 max-w-2xl space-y-10 text-center">
        {lyrics.lines.map((line) => (
          <li key={line.transliteration}>
            <p className="text-base text-ivory/55">{line.original}</p>
            <p className="mt-1 text-2xl sm:text-3xl">{line.transliteration}</p>
            <p className="mt-2 text-lg text-gold-200/80 italic">
              {line.meaning}
            </p>
          </li>
        ))}
      </ol>

      <div
        aria-hidden="true"
        className="mx-auto h-4 max-w-sm zari-band text-gold-500/70"
      />
    </Section>
  );
}
