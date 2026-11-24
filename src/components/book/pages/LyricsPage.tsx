"use client";

import { useSyncExternalStore } from "react";
import { Emblem } from "@/components/ui/Emblem";
import { programme, songs } from "@/content/programme";
import { useBook } from "../Book";
import { labelClass } from "./PageHeading";

// Which song is open. Item pages choose one before turning here.
let chosen = songs[0].slug;
const listeners = new Set<() => void>();

export function chooseSong(slug: string) {
  chosen = slug;
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

// Every song in one songbook. The numbered diamonds on the gold thread
// switch songs, and only the lyrics themselves scroll.
export function LyricsPage() {
  const slug = useSyncExternalStore(
    subscribe,
    () => chosen,
    () => songs[0].slug,
  );
  const { back } = useBook();
  const index = songs.findIndex((song) => song.slug === slug);
  const song = songs[index];
  const number = programme.indexOf(song) + 1;
  const step = (by: number) =>
    chooseSong(songs[(index + by + songs.length) % songs.length].slug);

  return (
    <div className="mx-auto flex h-full max-w-lg flex-col text-center">
      <header>
        <p className={labelClass}>The Songs</p>
        <h2
          data-glint
          className="mt-1 text-gilded font-display text-[1.75rem] leading-tight uppercase lg:text-4xl"
        >
          Lyrics
        </h2>
      </header>

      <div
        role="tablist"
        aria-label="Songs"
        data-settle
        className="relative mx-auto mt-4 flex items-center gap-2.5 before:absolute before:inset-x-3 before:top-1/2 before:h-px before:bg-gold-500/35"
      >
        {songs.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            aria-selected={item.slug === slug}
            aria-controls="lyrics"
            aria-label={item.name}
            onClick={() => chooseSong(item.slug)}
            className="group relative grid size-8 place-items-center"
          >
            <span className="absolute inset-1.5 rotate-45 border border-gold-500 bg-maroon-950 transition-colors group-aria-selected:bg-gold-500" />
            {/* Trimmed to the digits' own height, or Cinzel's tall line box
                leaves them sitting high in the diamond. */}
            <span className="relative font-display text-[0.6rem] leading-none text-gold-200 [text-box:trim-both_cap_alphabetic] group-aria-selected:font-bold group-aria-selected:text-maroon-950">
              {i + 1}
            </span>
          </button>
        ))}
      </div>

      <div data-settle className="mt-3 flex items-center justify-between gap-2">
        <StepButton label="Previous song" onClick={() => step(-1)} flipped />
        <div className="min-w-0">
          <h3 className="text-2xl leading-tight text-balance">{song.name}</h3>
          <p className={`mt-1 ${labelClass}`}>
            {String(number).padStart(2, "0")} · {song.kind}
          </p>
        </div>
        <StepButton label="Next song" onClick={() => step(1)} />
      </div>

      {/* The woven border, knotted at the song's emblem. */}
      <div
        aria-hidden="true"
        className="mx-auto mt-2 flex w-full max-w-xs shrink-0 items-center gap-2 text-gold-500"
      >
        <span className="h-3 flex-1 zari-band opacity-60" />
        <Emblem key={slug} name={song.emblem} className="size-7" />
        <span className="h-3 flex-1 zari-band opacity-60" />
      </div>

      <div
        id="lyrics"
        key={slug}
        role="tabpanel"
        aria-label={song.name}
        data-settle
        className="page-scroll min-h-0 flex-1"
      >
        <ol className="space-y-5 py-5">
          {song.lyrics.map((line) => (
            <li key={line.transliteration}>
              {line.original && (
                <p className="text-sm text-ivory/70">{line.original}</p>
              )}
              <p className="text-xl lg:text-2xl">{line.transliteration}</p>
              <p className="mt-0.5 text-gold-200/85 italic">{line.meaning}</p>
            </li>
          ))}
        </ol>
      </div>

      {back && (
        <button
          type="button"
          onClick={back.go}
          className="mx-auto mt-1 inline-flex shrink-0 items-center gap-1.5 py-1 font-display text-[0.6rem] tracking-[0.2em] text-gold-200 uppercase"
        >
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="size-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M10 3L5 8l5 5" />
          </svg>
          Back to {back.name}
        </button>
      )}
    </div>
  );
}

type StepButtonProps = {
  label: string;
  onClick: () => void;
  flipped?: boolean;
};

function StepButton({ label, onClick, flipped }: StepButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-9 shrink-0 place-items-center rounded-full text-gold-200"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={`size-4 ${flipped ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M6 3l5 5-5 5" />
      </svg>
    </button>
  );
}
