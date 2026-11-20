import type { CSSProperties } from "react";

// The dotted ring, starting at the top and going clockwise, so its dots
// can be lit one after another like a row of lamps (see cover.css).
const DOTS = 120;
const dots = Array.from({ length: DOTS }, (_, i) => {
  const angle = ((i / DOTS) * 2 - 0.5) * Math.PI;
  return {
    x: (86 * Math.cos(angle)).toFixed(2),
    y: (86 * Math.sin(angle)).toFixed(2),
  };
});

// A thin halo of light, like the prabha behind a temple deity. The ring of
// dots turns very slowly.
export function Halo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="-100 -100 200 200"
      aria-hidden="true"
      className={`text-gold-500 ${className}`}
      fill="none"
      stroke="currentColor"
    >
      <circle r="96" strokeWidth="0.6" opacity="0.5" />
      <circle r="92" strokeWidth="0.25" opacity="0.4" />
      <g
        fill="currentColor"
        stroke="none"
        opacity="0.6"
        className="origin-center animate-[spin_240s_linear_infinite] [transform-box:fill-box] motion-reduce:animate-none"
      >
        {dots.map(({ x, y }, i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="0.75"
            className="halo-dot"
            style={{ "--n": i } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}
