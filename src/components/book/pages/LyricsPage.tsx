import { lyrics } from "@/content/lyrics";
import { PageHeading } from "./PageHeading";

// The last page is dressed like a saree's pallu, framed in woven gold.
export function LyricsPage() {
  return (
    <div className="mx-auto max-w-lg text-center">
      <PageHeading eyebrow="Lyrics" title={lyrics.title} />
      <p className="mt-3 text-ivory/70 italic">{lyrics.details}</p>

      <div
        aria-hidden="true"
        className="mx-auto mt-5 h-3.5 max-w-xs zari-band text-gold-500/70"
      />
      <ol className="my-5 space-y-4">
        {lyrics.lines.map((line) => (
          <li key={line.transliteration}>
            <p className="text-sm text-ivory/55">{line.original}</p>
            <p className="text-xl lg:text-2xl">{line.transliteration}</p>
            <p className="text-gold-200/80 italic">{line.meaning}</p>
          </li>
        ))}
      </ol>
      <div
        aria-hidden="true"
        className="mx-auto h-3.5 max-w-xs zari-band text-gold-500/70"
      />
    </div>
  );
}
