"use client";

import { useState, type AnimationEvent, type ReactNode } from "react";
import { event } from "@/content/event";
import { Lamp } from "./Lamp";
import "./intro.css";

type Stage = "dark" | "lighting" | "open";

export function IntroGate({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>("dark");

  function handleAnimationEnd(e: AnimationEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) setStage("open");
  }

  return (
    <>
      <div inert={stage !== "open"}>{children}</div>

      {stage !== "open" && (
        // Full screen height (lvh) rather than inset-0, which on iOS Safari
        // stops at the floating toolbar and lets the page show underneath.
        <div
          data-stage={stage}
          onAnimationEnd={handleAnimationEnd}
          className="intro fixed inset-x-0 top-0 z-50 flex h-lvh flex-col items-center justify-center gap-6 px-6"
        >
          <p className="font-display text-xs tracking-[0.3em] text-ivory/50 uppercase">
            {event.dancer} · {event.title}
          </p>

          <button
            type="button"
            onClick={() => setStage("lighting")}
            disabled={stage === "lighting"}
            className="intro-lamp relative flex cursor-pointer flex-col items-center gap-4 rounded-sm outline-offset-8 outline-gold-500 focus-visible:outline-2 disabled:cursor-default"
          >
            <Lamp lit={stage === "lighting"} className="h-[min(44svh,340px)]" />
            <span className="intro-hint font-display text-sm tracking-[0.3em] text-gold-500 uppercase">
              Light the lamp
            </span>
          </button>
        </div>
      )}
    </>
  );
}
