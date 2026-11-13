"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { Ornament } from "@/components/ui/Ornament";
import { Dock } from "./Dock";
import { Fit } from "./Fit";
import { fan } from "./fx/fan";
import { flame } from "./fx/flame";
import { her } from "./fx/her";
import { ring } from "./fx/ring";
import { clamp, play, resetLeaf, type Point, type Reveal } from "./fx/shared";
import { silkTurn, type SilkTurn } from "./fx/silk";
import { LampIntro } from "./LampIntro";
import "@/components/intro/intro.css";
import "./book.css";

export type Effect = "silk" | "flame" | "fan" | "ring" | "her" | "fade";
export type Mode = "mix" | Exclude<Effect, "fade">;
export type BookPage = { name: string; content: ReactNode };

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

const modes: { value: Mode; label: string }[] = [
  { value: "mix", label: "Mix (suggested)" },
  { value: "silk", label: "Silk page" },
  { value: "flame", label: "Living flame" },
  { value: "fan", label: "The fan opens" },
  { value: "ring", label: "Ring of fire" },
  { value: "her", label: "Her silhouette" },
];

// How far a finger travels for a full turn, as a share of the page width.
const TURN_DISTANCE = 0.8;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type BookProps = {
  pages: BookPage[];
  // Special transitions between named pages, e.g. "Wishes>Lyrics": "fan".
  // Every other turn is a silk page.
  moments?: Record<string, Effect>;
  // Shows a picker for trying each transition everywhere.
  picker?: boolean;
};

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

export function Book({ pages, moments = {}, picker = false }: BookProps) {
  const [opened, setOpened] = useState(false);
  const [lit, setLit] = useState(false);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("mix");
  const [sound, setSound] = useState(true);

  const book = useRef<HTMLDivElement>(null);
  const lamp = useRef<HTMLDivElement>(null);
  const pageArea = useRef<HTMLDivElement>(null);
  const pageLayer = useRef<HTMLDivElement>(null);
  const screenLayer = useRef<HTMLDivElement>(null);
  const leaves = useRef<HTMLDivElement[]>([]);
  const current = useRef(0);
  const busy = useRef(false);
  const gesture = useRef<Gesture | null>(null);

  function effectFor(from: number, to: number): Effect {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return "fade";
    if (picker && mode !== "mix") return mode;
    return moments[`${pages[from].name}>${pages[to].name}`] ?? "silk";
  }

  // Screen coordinates to the page area's own.
  function onPage({ x, y }: Point): Point {
    const area = pageArea.current!.getBoundingClientRect();
    return { x: x - area.left, y: y - area.top };
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

  async function go(to: number, from: Point) {
    const at = current.current;
    if (busy.current || to === at || to < 0 || to >= pages.length) return;
    busy.current = true;

    const effect = effectFor(at, to);
    const incoming = leaves.current[to];
    const outgoing = leaves.current[at];

    if (effect === "silk") {
      await startSilk(at, to).play();
    } else {
      incoming.dataset.role = "over";
      outgoing.dataset.role = "under";
      await reveals[effect]({
        incoming,
        outgoing,
        layer: pageLayer.current!,
        origin: onPage(from),
      });
    }
    settle(to, [incoming, outgoing]);
  }

  // Lighting the lamp: the flames catch, then their light opens the book.
  async function light(flames: Point) {
    setLit(true);
    await wait(1400);
    const pagesAndDock = book.current!;
    pagesAndDock.style.zIndex = "51";
    await flame({
      incoming: pagesAndDock,
      outgoing: lamp.current!,
      layer: screenLayer.current!,
      origin: flames,
    });
    setOpened(true);
    pagesAndDock.removeAttribute("style");
  }

  function onPointerDown(event: PointerEvent) {
    if (busy.current || !event.isPrimary) return;
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
    const width = pageArea.current!.offsetWidth;

    // Decide once, after a little movement, whether this is a page turn.
    if (g.target === undefined) {
      const dy = event.clientY - g.startY;
      if (Math.hypot(dx, dy) < 10) return;
      const forward = dx < 0;
      const target = current.current + (forward ? 1 : -1);
      const vertical = Math.abs(dy) > Math.abs(dx);
      if (vertical || busy.current || target < 0 || target >= pages.length) {
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
    g.turn?.drag(clamp((g.forward ? -dx : dx) / (width * TURN_DISTANCE)));
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
      const width = pageArea.current!.offsetWidth;
      const speed =
        (g.forward ? -g.velocity : g.velocity) / (width * TURN_DISTANCE);
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
    if (!opened) return;
    function onKeyDown(event: KeyboardEvent) {
      const middle = { x: innerWidth / 2, y: innerHeight / 2 };
      if (event.key === "ArrowRight") go(current.current + 1, middle);
      if (event.key === "ArrowLeft") go(current.current - 1, middle);
    }
    addEventListener("keydown", onKeyDown);
    return () => removeEventListener("keydown", onKeyDown);
  });

  return (
    <>
      <div ref={book} inert={!opened} className="book">
        <div
          ref={pageArea}
          className="book-pages"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          {pages.map((page, i) => (
            <div
              key={page.name}
              ref={(element) => {
                if (element) leaves.current[i] = element;
              }}
              role="group"
              aria-roledescription="page"
              aria-label={`${page.name}, page ${i + 1} of ${pages.length}`}
              inert={i !== index}
              data-active={i === index || undefined}
              className="leaf"
            >
              <div className="leaf-front">
                <PageFrame />
                <Fit>{page.content}</Fit>
                <div data-overlay="shadow" />
                <div data-overlay="shade" />
                <div data-overlay="sheen" />
              </div>
              <div className="leaf-back">
                <PageFrame />
                <Ornament className="absolute inset-0 justify-center" />
                <div data-overlay="back-shade" />
              </div>
            </div>
          ))}

          <div ref={pageLayer} className="fx-layer" />

          {picker && (
            <label className="absolute top-1 right-3 z-40">
              <span className="sr-only">Page transition</span>
              <select
                value={mode}
                onChange={(event) => setMode(event.target.value as Mode)}
                className="rounded-full border border-gold-500/40 bg-maroon-950 py-1 pr-1.5 pl-2.5 font-display text-[0.55rem] tracking-[0.12em] text-gold-200 uppercase"
              >
                {modes.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <Dock
          pages={pages.map((page) => page.name)}
          current={index}
          sound={sound}
          onGo={go}
          onToggleSound={() => setSound((on) => !on)}
        />
      </div>

      <div ref={screenLayer} className="fx-layer fx-screen" />
      {!opened && <LampIntro ref={lamp} lit={lit} onLight={light} />}
    </>
  );
}

function PageFrame() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-3 border border-gold-500/30 lg:inset-5"
    >
      <div className="absolute inset-1.5 border border-gold-500/15" />
    </div>
  );
}
