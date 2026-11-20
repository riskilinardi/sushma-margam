"use client";

import { programme } from "@/content/programme";
import { useBook } from "../Book";
import { PageHeading } from "./PageHeading";

// The whole Margam on one page, strung on the gold thread. Each piece opens
// its own page.
export function ProgrammePage() {
  const { goTo } = useBook();

  return (
    <div className="mx-auto max-w-sm">
      <PageHeading eyebrow="The Repertoire" title="Programme" />
      <p className="mt-3 text-center text-sm text-ivory/70 italic">
        Tap a piece to read about it
      </p>

      <ol
        data-thread
        className="relative mt-4 space-y-1 before:absolute before:inset-y-3 before:left-[4.5px] before:w-px before:origin-top before:bg-gold-500/40"
      >
        {programme.map((item, index) => (
          <li key={item.slug} data-settle>
            <button
              type="button"
              onClick={() => goTo(item.name)}
              className="group relative flex w-full items-baseline gap-3 py-1 pl-7 text-left"
            >
              <span
                aria-hidden="true"
                className="absolute top-3 left-0 size-2.5 rotate-45 border border-gold-500 bg-maroon-950 transition-colors group-hover:bg-gold-500"
              />
              <span className="font-display text-[0.65rem] text-gold-200">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-lg leading-snug">{item.name}</span>
              <span className="ml-auto shrink-0 font-display text-[0.55rem] tracking-[0.15em] text-ivory/70 uppercase">
                {item.kind}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
