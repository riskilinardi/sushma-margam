"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { Ornament } from "@/components/ui/Ornament";
import { fan } from "./fx/fan";
import { flame } from "./fx/flame";
import { her } from "./fx/her";
import { ring } from "./fx/ring";
import { clamp, play, resetLeaf, type Point, type Reveal } from "./fx/shared";
import { silkTurn, type SilkTurn } from "./fx/silk";
import { LampPage } from "./LampPage";
import "./demo.css";

type Effect = "silk" | "flame" | "fan" | "ring" | "her" | "fade";
type Mode = "mix" | Exclude<Effect, "fade">;

const modes: { value: Mode; label: string }[] = [
  { value: "mix", label: "Mix (suggested)" },
  { value: "silk", label: "Silk page" },
  { value: "flame", label: "Living flame" },
  { value: "fan", label: "The fan opens" },
  { value: "ring", label: "Ring of fire" },
  { value: "her", label: "Her silhouette" },
];

const fade: Reveal = ({ incoming }) =>
  play(0.3, (t) => {
    incoming.style.opacity = String(t);
  });

const reveals: Record<Exclude<Effect, "silk">, Reveal> = {
  flame,
  fan,
  ring,
  her,
  fade,
};

// Page 0 is the lamp, which always opens with the flame. The suggested mix
// saves the big moments for two more thresholds and turns silk pages
// everywhere else.
const choreography: Record<string, Effect> = {
  "1>2": "her",
  "4>5": "fan",
};

// How far a finger travels for a full turn, as a share of the screen width.
const TURN_DISTANCE = 0.8;

const centre = (): Point => ({ x: innerWidth / 2, y: innerHeight / 2 });

function centreOf(event: MouseEvent<HTMLElement>): Point {
  const box = event.currentTarget.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

type Page = { name: string; content: ReactNode };

type Gesture = {
  pointer: number;
  startX: number;
  startY: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  target?: number;
  forward?: boolean;
  turn?: SilkTurn;
};

export function TransitionsDemo({ pages }: { pages: Page[] }) {
  const [index, setIndex] = useState(0);
  const [lit, setLit] = useState(false);
  const [mode, setMode] = useState<Mode>("mix");
  const current = useRef(0);
  const busy = useRef(false);
  const gesture = useRef<Gesture | null>(null);
  const leaves = useRef<HTMLDivElement[]>([]);
  const layer = useRef<HTMLDivElement>(null);
  const pageCount = pages.length + 1;

  function effectFor(from: number, to: number): Effect {
    if (from === 0) return "flame";
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return "fade";
    if (mode !== "mix") return mode;
    return choreography[`${from}>${to}`] ?? "silk";
  }

  function settle(to: number, involved: HTMLElement[]) {
    flushSync(() => setIndex(to));
    current.current = to;
    involved.forEach(resetLeaf);
    busy.current = false;
  }

  function startSilk(from: number, to: number) {
    const forward = to > from;
    const [turning, under] = forward
      ? [leaves.current[from], leaves.current[to]]
      : [leaves.current[to], leaves.current[from]];
    turning.dataset.role = "over";
    under.dataset.role = "under";
    return silkTurn(turning, under, forward);
  }

  async function go(to: number, origin = centre()) {
    const from = current.current;
    if (busy.current || to === from || to < 1 || to >= pageCount) return;
    busy.current = true;

    const effect = effectFor(from, to);
    const incoming = leaves.current[to];
    const outgoing = leaves.current[from];

    if (effect === "silk") {
      await startSilk(from, to).play();
    } else {
      incoming.dataset.role = "over";
      outgoing.dataset.role = "under";
      await reveals[effect]({
        incoming,
        outgoing,
        layer: layer.current!,
        origin,
      });
    }
    settle(to, [incoming, outgoing]);
  }

  function light(flamePosition: Point) {
    setLit(true);
    setTimeout(() => go(1, flamePosition), 1400);
  }

  function onPointerDown(event: PointerEvent) {
    if (busy.current || current.current === 0 || !event.isPrimary) return;
    gesture.current = {
      pointer: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
    };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g || g.pointer !== event.pointerId) return;
    const dx = event.clientX - g.startX;

    // Decide once, after a little movement, whether this is a page turn.
    if (g.target === undefined) {
      const dy = event.clientY - g.startY;
      if (Math.hypot(dx, dy) < 10) return;
      const forward = dx < 0;
      const target = current.current + (forward ? 1 : -1);
      const vertical = Math.abs(dy) > Math.abs(dx);
      if (vertical || busy.current || target < 1 || target >= pageCount) {
        gesture.current = null;
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
      g.target = target;
      g.forward = forward;
      if (effectFor(current.current, target) === "silk") {
        busy.current = true;
        g.turn = startSilk(current.current, target);
      }
    }

    const elapsed = event.timeStamp - g.lastTime;
    if (elapsed > 0) g.velocity = ((event.clientX - g.lastX) / elapsed) * 1000;
    g.lastX = event.clientX;
    g.lastTime = event.timeStamp;
    g.turn?.drag(clamp((g.forward ? -dx : dx) / (innerWidth * TURN_DISTANCE)));
  }

  async function onPointerEnd(event: PointerEvent) {
    const g = gesture.current;
    if (!g || g.pointer !== event.pointerId) return;
    gesture.current = null;
    if (g.target === undefined) return;

    const released = event.type === "pointerup";
    const involved = [
      leaves.current[current.current],
      leaves.current[g.target],
    ];

    if (g.turn) {
      // Turn progress per second, positive towards the new page.
      const speed =
        (g.forward ? -g.velocity : g.velocity) / (innerWidth * TURN_DISTANCE);
      const flicked = speed > 1.2;
      const pulledBack = speed < -1.2;
      if (released && !pulledBack && (g.turn.progress > 0.5 || flicked)) {
        await g.turn.finish(speed);
        settle(g.target, involved);
      } else {
        await g.turn.cancel(speed);
        involved.forEach(resetLeaf);
        busy.current = false;
      }
    } else if (released && Math.abs(event.clientX - g.startX) > 50) {
      go(g.target, { x: event.clientX, y: event.clientY });
    }
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") go(current.current + 1);
      if (event.key === "ArrowLeft") go(current.current - 1);
    }
    addEventListener("keydown", onKeyDown);
    return () => removeEventListener("keydown", onKeyDown);
  });

  const book: Page[] = [
    { name: "Lamp", content: <LampPage lit={lit} onLight={light} /> },
    ...pages,
  ];

  return (
    <div
      className="book"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      {book.map((page, i) => (
        <div
          key={page.name}
          ref={(element) => {
            if (element) leaves.current[i] = element;
          }}
          role="group"
          aria-roledescription="page"
          aria-label={page.name}
          inert={i !== index}
          data-active={i === index || undefined}
          className="leaf"
        >
          <div className="leaf-front">
            <div className="leaf-scroll">{page.content}</div>
            <div data-overlay="shadow" />
            <div data-overlay="shade" />
            <div data-overlay="sheen" />
          </div>
          <div className="leaf-back">
            <Verso />
            <div data-overlay="back-shade" />
          </div>
        </div>
      ))}

      <div ref={layer} className="fx-layer" />

      {index > 0 && (
        <>
          <label className="fixed top-4 right-4 z-40">
            <span className="sr-only">Page transition</span>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as Mode)}
              className="rounded-full border border-gold-500/40 bg-maroon-950/85 py-2 pr-3 pl-4 font-display text-[0.65rem] tracking-[0.15em] text-gold-200 uppercase backdrop-blur"
            >
              {modes.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <nav
            aria-label="Pages"
            className="fixed inset-x-0 bottom-4 z-40 flex items-center justify-center gap-5"
          >
            <ArrowButton
              label="Previous page"
              disabled={index <= 1}
              onClick={(event) => go(index - 1, centreOf(event))}
              flipped
            />
            <ol className="flex items-center gap-3">
              {pages.map((page, i) => (
                <li key={page.name} className="flex">
                  <button
                    type="button"
                    aria-label={page.name}
                    aria-current={index === i + 1 ? "page" : undefined}
                    onClick={(event) => go(i + 1, centreOf(event))}
                    className="size-2 rotate-45 border border-gold-500 transition-colors aria-[current=page]:bg-gold-500"
                  />
                </li>
              ))}
            </ol>
            <ArrowButton
              label="Next page"
              disabled={index >= pageCount - 1}
              onClick={(event) => go(index + 1, centreOf(event))}
            />
          </nav>

          <p aria-live="polite" className="sr-only">
            {book[index].name}
          </p>
        </>
      )}
    </div>
  );
}

function Verso() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-4 border border-gold-500/40 outline -outline-offset-8 outline-gold-500/15" />
      <div className="absolute inset-x-10 top-10 h-4 zari-band text-gold-500/60" />
      <div className="absolute inset-x-10 bottom-10 h-4 zari-band text-gold-500/60" />
      <Ornament />
    </div>
  );
}

type ArrowButtonProps = {
  label: string;
  disabled: boolean;
  flipped?: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

function ArrowButton({ label, disabled, flipped, onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-10 place-items-center rounded-full border border-gold-500/40 bg-maroon-950/80 text-gold-200 backdrop-blur transition-opacity disabled:opacity-30"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={`size-3.5 ${flipped ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M6 3l5 5-5 5" />
      </svg>
    </button>
  );
}
