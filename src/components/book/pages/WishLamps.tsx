"use client";

import { useId, useState, type CSSProperties } from "react";
import { useIsCurrent } from "../Book";
import "./wishes.css";

// As many as the beads of a mala.
const LAMPS = 108;

// An arch of radius 100 over the heading. The lamps are lit in pairs, one
// on each side, rising from its feet to meet at the top.
const lamps = Array.from({ length: LAMPS }, (_, k) => {
  const rise = ((Math.floor(k / 2) + 0.5) / (LAMPS / 2)) * (Math.PI / 2);
  const side = k % 2 === 0 ? -1 : 1;
  return {
    x: (side * 100 * Math.cos(rise)).toFixed(2),
    y: (-100 * Math.sin(rise)).toFixed(2),
  };
});

type WishLampsProps = {
  // How many wishes there are; null until they have loaded.
  lit: number | null;
  className?: string;
};

// Every wish lights a lamp on the arch. When the page settles the lit lamps
// catch one after another; a lamp lit while the page is open, such as the
// guest's own, catches at once.
export function WishLamps({ lit, className = "" }: WishLampsProps) {
  const glow = useId();
  const current = useIsCurrent();
  // How many were lit when the page was arrived at.
  const [arrival, setArrival] = useState({ current, lit });
  if (arrival.current !== current || (arrival.lit === null && lit !== null)) {
    setArrival({ current, lit });
  }

  return (
    <svg
      viewBox="-106 -106 212 110"
      aria-hidden="true"
      className={`text-gold-500 ${className}`}
    >
      <defs>
        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M-105 0A105 105 0 0 1 105 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.35"
        opacity="0.45"
      />
      <g fill="currentColor" opacity="0.45">
        {lamps.map(({ x, y }, k) => (
          <circle key={k} cx={x} cy={y} r="0.8" />
        ))}
      </g>
      <g filter={`url(#${glow})`}>
        {lamps.slice(0, lit ?? 0).map(({ x, y }, k) => (
          <circle
            key={k}
            cx={x}
            cy={y}
            r="1.5"
            className="wish-lamp"
            data-live={k >= (arrival.lit ?? 0) || undefined}
            style={{ "--k": k } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}
