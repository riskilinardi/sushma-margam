import Image from "next/image";
import type { ReactNode } from "react";
import type { ProgrammeItem } from "@/content/programme";
import { LyricsLink } from "./LyricsLink";
import { Motes } from "./Motes";
import { labelClass } from "./PageHeading";
import { Reading } from "./Reading";
import "./piece.css";

type ItemPageProps = {
  item: ProgrammeItem;
  number: number;
};

// One page for each piece: her photo on its own black studio background,
// lit from above like a stage, with what the piece is and what to watch for
// beneath it. Longer write-ups scroll; the heading always starts in the
// same place.
export function ItemPage({ item, number }: ItemPageProps) {
  const facts = [
    { term: "Raagam", value: item.raagam },
    { term: "Taalam", value: item.taalam },
    { term: "Composer", value: item.composer },
  ].filter((fact) => fact.value);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div className="piece-photo absolute inset-0">
        <Image
          src={item.photo}
          alt={`Sushma dancing ${item.name}`}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover object-top"
        />
      </div>
      <div aria-hidden="true" className="piece-light absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-1/2">
        <Motes count={12} />
      </div>

      <Reading className="piece-text">
        <div className="lg:my-auto">
          <header data-settle className="border-l border-gold-500/70 pl-3">
            <p className={labelClass}>
              {String(number).padStart(2, "0")} · {item.kind}
            </p>
            <h2
              data-glint
              className="mt-1.5 text-gilded font-display text-[1.75rem] leading-[1.08] uppercase lg:text-4xl"
            >
              {item.name}
            </h2>
            <p className="mt-0.5 text-lg text-gold-200 italic">
              {item.tagline}
            </p>
          </header>

          {facts.length > 0 && (
            <dl
              data-settle
              className="mt-3 flex gap-x-5 border-y border-gold-500/25 py-2 pl-3.5"
            >
              {facts.map(({ term, value }) => (
                <div key={term}>
                  <dt className="font-display text-[0.55rem] tracking-[0.28em] text-gold-200/85 uppercase">
                    {term}
                  </dt>
                  <dd className="mt-0.5 leading-tight">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <p data-settle className="mt-3 pl-3.5 leading-snug text-ivory/90">
            {item.story}
          </p>
          {item.watch && <Callout label="Watch for">{item.watch}</Callout>}
          {item.listen && <Callout label="Listen for">{item.listen}</Callout>}
          {item.lyrics && (
            <LyricsLink
              slug={item.slug}
              opening={item.lyrics[0].transliteration}
            />
          )}
        </div>
      </Reading>
    </div>
  );
}

// What guests look for while she dances, set apart so it is easy to find.
function Callout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      data-settle
      className="mt-3 ml-3.5 border-l-2 border-gold-500 bg-linear-to-r from-gold-500/12 to-gold-500/3 px-3 py-2"
    >
      <p className="font-display text-[0.58rem] tracking-[0.3em] text-gold-200 uppercase">
        {label}
      </p>
      <p className="mt-0.5 leading-snug text-ivory/90">{children}</p>
    </div>
  );
}
