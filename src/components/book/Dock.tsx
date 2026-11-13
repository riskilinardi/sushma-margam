import type { MouseEvent, ReactNode } from "react";
import type { Point } from "./fx/shared";

type DockProps = {
  pages: string[];
  current: number;
  sound: boolean;
  onGo: (page: number, from: Point) => void;
  onToggleSound: () => void;
};

function centreOf(event: MouseEvent<HTMLElement>): Point {
  const box = event.currentTarget.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

// The bottom fifth of the screen: lyrics along the top (once the music is
// in), then sound, page turning and where you are in the book.
export function Dock({
  pages,
  current,
  sound,
  onGo,
  onToggleSound,
}: DockProps) {
  return (
    <footer className="relative flex flex-col items-center justify-center gap-3 border-t border-gold-500/30 bg-maroon-950 px-4 pb-[env(safe-area-inset-bottom)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1.5 h-2.5 zari-band text-gold-500/35"
      />

      <p className="flex items-center gap-2 text-sm text-ivory/70 italic">
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="size-3.5 fill-gold-500/70"
        >
          <path d="M6 2.5l7-1.5v9.2a2.3 2.3 0 1 1-1.5-2.1V4.3L7.5 5.2v6.9a2.3 2.3 0 1 1-1.5-2.1z" />
        </svg>
        Lyrics will follow the music here
      </p>

      <div className="flex w-full max-w-md items-center gap-3">
        <RoundButton
          label={sound ? "Mute music" : "Play music"}
          pressed={sound}
          onClick={onToggleSound}
        >
          {sound ? (
            <path d="M2 6h3l4-3.5v11L5 10H2zM11.5 5.5a3.5 3.5 0 0 1 0 5M13.5 3.5a6.3 6.3 0 0 1 0 9" />
          ) : (
            <path d="M2 6h3l4-3.5v11L5 10H2zM11 6l4 4M15 6l-4 4" />
          )}
        </RoundButton>

        <RoundButton
          label="Previous page"
          disabled={current === 0}
          onClick={(event) => onGo(current - 1, centreOf(event))}
        >
          <path d="M10 3L5 8l5 5" />
        </RoundButton>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <p
            aria-live="polite"
            className="truncate font-display text-[0.65rem] tracking-[0.25em] text-gold-200 uppercase"
          >
            {pages[current]}
          </p>
          <ol className="flex items-center gap-2">
            {pages.map((name, page) => (
              <li key={name} className="flex">
                <button
                  type="button"
                  aria-label={name}
                  aria-current={page === current ? "page" : undefined}
                  onClick={(event) => onGo(page, centreOf(event))}
                  className="size-2 rotate-45 border border-gold-500 transition-colors aria-[current=page]:bg-gold-500"
                />
              </li>
            ))}
          </ol>
        </div>

        <RoundButton
          label="Next page"
          disabled={current === pages.length - 1}
          onClick={(event) => onGo(current + 1, centreOf(event))}
        >
          <path d="M6 3l5 5-5 5" />
        </RoundButton>

        <p className="w-10 text-center font-display text-[0.65rem] text-ivory/70">
          {current + 1}/{pages.length}
        </p>
      </div>
    </footer>
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
