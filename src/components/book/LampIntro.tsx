"use client";

import { useRef, useSyncExternalStore, type Ref } from "react";
import { Kolam } from "@/components/ui/Kolam";
import { Lamp } from "@/components/ui/Lamp";
import { event } from "@/content/event";
import { SoundButton } from "./Dock";
import type { Point } from "./fx/shared";

type LampIntroProps = {
  ref: Ref<HTMLDivElement>;
  lit: boolean;
  sound: boolean;
  onLight: (flames: Point) => void;
  onToggleSound: () => void;
};

const subscribe = () => () => {};

// The threshold: a lamp on a dark stage, waiting to be lit. Full screen
// height (lvh), so iOS Safari's toolbar can't leave a strip of the book
// showing underneath.
export function LampIntro({
  ref,
  lit,
  sound,
  onLight,
  onToggleSound,
}: LampIntroProps) {
  const lamp = useRef<HTMLSpanElement>(null);
  // The lamp is drawn before the page can respond to a tap; on a weak
  // signal that can take seconds. Only ask for the tap once it will work.
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  // The light opens from the flames, a third of the way down the lamp.
  function light() {
    const box = lamp.current!.getBoundingClientRect();
    onLight({ x: box.left + box.width / 2, y: box.top + box.height / 3 });
  }

  return (
    <div
      ref={ref}
      data-lit={lit || undefined}
      className="fixed inset-x-0 top-0 z-50 flex h-lvh flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_44%,var(--maroon-900),var(--maroon-950)_70%)] px-6 text-center"
    >
      <div aria-hidden="true" className="lamp-spot" />
      <div className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4">
        <SoundButton on={sound} onClick={onToggleSound} />
      </div>

      <p className="font-display text-xs tracking-[0.3em] text-gold-200 uppercase">
        {event.dancer} · {event.title}
      </p>
      <button
        type="button"
        onClick={light}
        disabled={lit}
        aria-label="Light the lamp"
        className="relative mt-8 flex cursor-pointer flex-col items-center rounded-sm outline-offset-8 outline-gold-500 [--lamp:min(40svh,360px)] focus-visible:outline-2 disabled:cursor-default"
      >
        <span ref={lamp} className="lamp-glow relative">
          <Kolam
            lit={lit}
            className="absolute bottom-[4.7%] left-1/2 w-[190%] max-w-none -translate-x-1/2 translate-y-1/2"
          />
          <Lamp lit={lit} className="relative h-(--lamp)" />
        </span>
        {/* The kolam reaches below the lamp by about a fifth of its height. */}
        <span className="mt-[calc(var(--lamp)*0.2+1.25rem)] max-w-72 text-lg leading-snug text-balance text-ivory/75 italic">
          Every performance begins with the lighting of the lamp.
        </span>
        <span
          className={`mt-3 font-display text-sm tracking-[0.3em] text-gold-200 uppercase transition-opacity duration-500 ${ready && !lit ? "lamp-hint" : "opacity-0"}`}
        >
          Light the lamp
        </span>
      </button>
    </div>
  );
}
