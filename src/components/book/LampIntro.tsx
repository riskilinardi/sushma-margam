"use client";

import { useRef, type Ref } from "react";
import { Lamp } from "@/components/ui/Lamp";
import { event } from "@/content/event";
import type { Point } from "./fx/shared";

type LampIntroProps = {
  ref: Ref<HTMLDivElement>;
  lit: boolean;
  onLight: (flames: Point) => void;
};

// Full screen height (lvh), so iOS Safari's toolbar can't leave a strip of
// the book showing underneath.
export function LampIntro({ ref, lit, onLight }: LampIntroProps) {
  const button = useRef<HTMLButtonElement>(null);

  // The light opens from the flames, a third of the way down the lamp.
  function light() {
    const lamp = button.current!.querySelector("svg")!.getBoundingClientRect();
    onLight({ x: lamp.left + lamp.width / 2, y: lamp.top + lamp.height / 3 });
  }

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 flex h-lvh flex-col items-center justify-center gap-6 bg-[radial-gradient(circle_at_50%_44%,var(--maroon-900),var(--maroon-950)_70%)] px-6"
    >
      <p className="font-display text-xs tracking-[0.3em] text-ivory/70 uppercase">
        {event.dancer} · {event.title}
      </p>
      <button
        ref={button}
        type="button"
        onClick={light}
        disabled={lit}
        className="lamp-glow relative flex cursor-pointer flex-col items-center gap-4 rounded-sm outline-offset-8 outline-gold-500 focus-visible:outline-2 disabled:cursor-default"
      >
        <Lamp lit={lit} className="h-[min(44svh,340px)]" />
        <span
          className={`font-display text-sm tracking-[0.3em] text-gold-200 uppercase transition-opacity duration-500 ${lit ? "opacity-0" : "lamp-hint"}`}
        >
          Light the lamp
        </span>
      </button>
    </div>
  );
}
