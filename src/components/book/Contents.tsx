import { useEffect, useRef, type MouseEvent } from "react";
import type { Point } from "./fx/shared";

type ContentsProps = {
  open: boolean;
  pages: { name: string; under?: string }[];
  current: number;
  onPick: (page: number, from: Point) => void;
  onClose: () => void;
};

// The book's table of contents, rising from the bottom of the screen: each
// page with dotted leaders to its number, pieces indented under Programme.
export function Contents({
  open,
  pages,
  current,
  onPick,
  onClose,
}: ContentsProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current!;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  function pick(page: number, event: MouseEvent<HTMLElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    onClose();
    onPick(page, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="contents-title"
      onClose={onClose}
      // A tap on the dimmed backdrop lands on the dialog itself.
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="contents-sheet mx-auto mt-auto mb-0 max-h-[80svh] w-full max-w-md overflow-hidden rounded-t-2xl border border-b-0 border-gold-500/40 bg-maroon-950 p-0 text-ivory"
    >
      <div className="flex max-h-[80svh] flex-col px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <header className="flex items-center justify-between">
          <h2
            id="contents-title"
            className="text-gilded font-display text-xl tracking-[0.2em] uppercase"
          >
            Contents
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close contents"
            className="grid size-9 place-items-center rounded-full border border-gold-500/40 text-gold-200"
          >
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </header>
        <div
          aria-hidden="true"
          className="mt-3 h-2.5 zari-band text-gold-500/40"
        />

        <ol className="page-scroll mt-2 min-h-0 flex-1 pb-2">
          {pages.map((page, i) => (
            <li key={page.name} className={page.under ? "pl-5" : undefined}>
              <button
                type="button"
                onClick={(event) => pick(i, event)}
                aria-current={i === current ? "page" : undefined}
                className={`group flex w-full items-baseline gap-2 text-left ${page.under ? "py-1 text-base text-ivory/85" : "py-1.5 text-lg"} aria-[current=page]:text-gold-200`}
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 -translate-y-0.5 rotate-45 bg-gold-500 opacity-0 group-aria-[current=page]:opacity-100"
                />
                <span>{page.name}</span>
                <span
                  aria-hidden="true"
                  className="min-w-4 flex-1 border-b border-dotted border-gold-500/40"
                />
                <span className="font-display text-xs text-gold-200">
                  {i + 1}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </dialog>
  );
}
