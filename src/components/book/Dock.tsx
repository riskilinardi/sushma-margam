import { useState, type MouseEvent, type ReactNode } from "react";
import { Contents } from "./Contents";
import type { Point } from "./fx/shared";

type DockProps = {
  pages: { name: string; under?: string }[];
  current: number;
  sound: boolean;
  onGo: (page: number, from: Point) => void;
  onToggleSound: () => void;
};

function centreOf(event: MouseEvent<HTMLElement>): Point {
  const box = event.currentTarget.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

// The strip below the pages: sound, page turning, and the page you're
// on set like a printed book's folio. The page name and the list button open
// the contents.
export function Dock({
  pages,
  current,
  sound,
  onGo,
  onToggleSound,
}: DockProps) {
  const [contentsOpen, setContentsOpen] = useState(false);
  const openContents = () => setContentsOpen(true);
  const progress = (current / (pages.length - 1)) * 100;

  return (
    <footer className="dock relative flex flex-col items-center justify-center border-t border-gold-500/30 bg-maroon-950 px-4 pt-4 pb-[env(safe-area-inset-bottom)]">
      {/* The woven band brightens to gold as far as the reader has come. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1.5 h-2.5 zari-band text-gold-500/35"
      />
      <div
        aria-hidden="true"
        className="dock-progress absolute inset-x-0 top-1.5 h-2.5 zari-band text-gold-500"
        style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
      />

      <div className="flex w-full max-w-md items-center gap-3">
        <SoundButton on={sound} onClick={onToggleSound} />

        <RoundButton
          label="Previous page"
          disabled={current === 0}
          onClick={(event) => onGo(current - 1, centreOf(event))}
        >
          <path d="M10 3L5 8l5 5" />
        </RoundButton>

        <button
          type="button"
          onClick={openContents}
          aria-haspopup="dialog"
          aria-label={`${pages[current].name}, page ${current + 1} of ${pages.length}. Open contents`}
          className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
        >
          <span className="line-clamp-2 max-w-full font-display text-[0.65rem] leading-snug tracking-[0.25em] text-balance text-gold-200 uppercase">
            {pages[current].name}
          </span>
          <span className="flex items-center gap-2 text-sm text-ivory/70 italic">
            <span className="h-px w-5 bg-linear-to-r from-transparent to-gold-500/60" />
            {current + 1} of {pages.length}
            <span className="h-px w-5 bg-linear-to-l from-transparent to-gold-500/60" />
          </span>
        </button>

        <RoundButton
          label="Next page"
          disabled={current === pages.length - 1}
          onClick={(event) => onGo(current + 1, centreOf(event))}
        >
          <path d="M6 3l5 5-5 5" />
        </RoundButton>

        <RoundButton label="Contents" onClick={openContents}>
          <path d="M5.5 4h8M5.5 8h8M5.5 12h8" />
          <path d="M2.5 4h.01M2.5 8h.01M2.5 12h.01" strokeWidth="2" />
        </RoundButton>
      </div>

      <p aria-live="polite" className="sr-only">
        {pages[current].name}
      </p>

      <Contents
        open={contentsOpen}
        pages={pages}
        current={current}
        onPick={onGo}
        onClose={() => setContentsOpen(false)}
      />
    </footer>
  );
}

// Also on the lamp screen, so guests can turn the sound off before lighting.
export function SoundButton({
  on,
  onClick,
}: {
  on: boolean;
  onClick: () => void;
}) {
  return (
    <RoundButton
      label={on ? "Turn sound off" : "Turn sound on"}
      pressed={on}
      onClick={onClick}
    >
      {on ? (
        <path d="M2 6h3l4-3.5v11L5 10H2zM11.5 5.5a3.5 3.5 0 0 1 0 5M13.5 3.5a6.3 6.3 0 0 1 0 9" />
      ) : (
        <path d="M2 6h3l4-3.5v11L5 10H2zM11 6l4 4M15 6l-4 4" />
      )}
    </RoundButton>
  );
}

type RoundButtonProps = {
  label: string;
  disabled?: boolean;
  pressed?: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
};

function RoundButton({
  label,
  disabled,
  pressed,
  onClick,
  children,
}: RoundButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className="grid size-10 shrink-0 place-items-center rounded-full border border-gold-500/40 text-gold-200 transition-opacity disabled:opacity-30"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </button>
  );
}
