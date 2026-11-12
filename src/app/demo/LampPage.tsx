"use client";

import { useRef } from "react";
import { Lamp } from "@/components/intro/Lamp";
import { event } from "@/content/event";
import type { Point } from "./fx/shared";
import "@/components/intro/intro.css";

type LampPageProps = {
  lit: boolean;
  onLight: (flame: Point) => void;
};

export function LampPage({ lit, onLight }: LampPageProps) {
  const button = useRef<HTMLButtonElement>(null);

  // The light should open from the flames, a third of the way down the lamp.
  function light() {
    const lamp = button.current!.querySelector("svg")!.getBoundingClientRect();
    onLight({
      x: lamp.left + lamp.width / 2,
      y: lamp.top + lamp.height / 3,
    });
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-[radial-gradient(circle_at_50%_44%,var(--maroon-900),var(--maroon-950)_70%)] px-6">
      <p className="font-display text-xs tracking-[0.3em] text-ivory/50 uppercase">
        {event.dancer} · {event.title}
      </p>
      <button
        ref={button}
        type="button"
        onClick={light}
        disabled={lit}
        className="demo-lamp relative flex cursor-pointer flex-col items-center gap-4 rounded-sm outline-offset-8 outline-gold-500 focus-visible:outline-2 disabled:cursor-default"
      >
        <Lamp lit={lit} className="h-[min(44svh,340px)]" />
        <span
          className={`font-display text-sm tracking-[0.3em] text-gold-500 uppercase transition-opacity duration-500 ${lit ? "opacity-0" : "intro-hint"}`}
        >
          Light the lamp
        </span>
      </button>
    </div>
  );
}
