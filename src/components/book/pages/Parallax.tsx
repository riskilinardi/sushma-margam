"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useIsCurrent } from "../Book";

type ParallaxProps = {
  className: string;
  children: ReactNode;
};

// With a mouse, the layers inside shift a little as it moves, nearer ones
// more (see cover.css), so the poster has depth. It sets --px and --py,
// each from -1 to 1. Phones have no pointer to follow; they get a slow
// drift instead.
export function Parallax({ className, children }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const current = useIsCurrent();

  useEffect(() => {
    const mouse = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!current || !mouse || calm) return;

    const element = ref.current!;
    function follow({ clientX, clientY }: PointerEvent) {
      element.style.setProperty(
        "--px",
        ((clientX / innerWidth) * 2 - 1).toFixed(3),
      );
      element.style.setProperty(
        "--py",
        ((clientY / innerHeight) * 2 - 1).toFixed(3),
      );
    }
    addEventListener("pointermove", follow);
    return () => removeEventListener("pointermove", follow);
  }, [current]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
