"use client";

import { useBook } from "../Book";
import { chooseSong } from "./LyricsPage";

type LyricsLinkProps = {
  slug: string;
  opening: string;
};

// Styled like a pull-quote in a printed programme: the song's opening words
// between two gold rules, then a quiet invitation to read the rest.
export function LyricsLink({ slug, opening }: LyricsLinkProps) {
  const { goTo } = useBook();

  function open() {
    chooseSong(slug);
    goTo("Lyrics");
  }

  return (
    <button
      type="button"
      data-settle
      onClick={open}
      className="group mx-auto mt-6 block w-full max-w-xs border-y border-gold-500/30 py-3"
    >
      <span className="block text-ivory/80 italic">“{opening}…”</span>
      <span className="mt-1.5 inline-flex items-center gap-2 font-display text-[0.65rem] tracking-[0.3em] text-gold-200 uppercase">
        Read the lyrics
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="size-3 transition-transform group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M6 3l5 5-5 5" />
        </svg>
      </span>
    </button>
  );
}
