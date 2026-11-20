import { useId } from "react";
import "./lamp.css";

const FLAME = "M0 0C7-3 8-13 0-28C-8-13-7-3 0 0Z";
const FLAME_CORE = "M0 0C3-2 4-7 0-14C-4-7-3-2 0 0Z";

// The centre wick catches first, then the two side spouts.
const WICKS = [
  { x: 80, y: 103, delay: 0 },
  { x: 19, y: 94, delay: 450 },
  { x: 141, y: 94, delay: 450 },
];

type LampProps = {
  lit: boolean;
  className?: string;
};

export function Lamp({ lit, className = "" }: LampProps) {
  const id = useId();
  const bodyId = `${id}-body`;
  const brassId = `${id}-brass`;
  const warmId = `${id}-warm`;
  const maskId = `${id}-mask`;
  const fireId = `${id}-fire`;

  return (
    <svg
      viewBox="0 0 160 300"
      aria-hidden="true"
      data-lit={lit || undefined}
      className={className}
    >
      <defs>
        <linearGradient id={brassId} x1="0" x2="1">
          <stop offset="0" style={{ stopColor: "var(--gold-900)" }} />
          <stop offset="0.35" style={{ stopColor: "var(--gold-500)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--gold-200)" }} />
          <stop offset="0.65" style={{ stopColor: "var(--gold-500)" }} />
          <stop offset="1" style={{ stopColor: "var(--gold-900)" }} />
        </linearGradient>
        {/* Firelight on the brass, strongest just below the flames. */}
        <radialGradient
          id={warmId}
          gradientUnits="userSpaceOnUse"
          cx="80"
          cy="100"
          r="150"
        >
          <stop offset="0" stopColor="rgb(255 222 160 / 0.75)" />
          <stop offset="0.5" stopColor="rgb(255 190 110 / 0.25)" />
          <stop offset="1" stopColor="rgb(255 190 110 / 0)" />
        </radialGradient>
        <radialGradient id={fireId} cx="0.5" cy="0.8" r="0.7">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset="0.35" stopColor="#ffd56a" />
          <stop offset="0.75" stopColor="#ff9330" />
          <stop offset="1" stopColor="#ff6a00" stopOpacity="0" />
        </radialGradient>

        <g id={bodyId}>
          <rect x="75" y="116" width="10" height="134" />
          <ellipse cx="80" cy="121" rx="13" ry="4" />
          <ellipse cx="80" cy="150" rx="9" ry="5" />
          <path d="M80 170C99 177 99 201 80 208C61 201 61 177 80 170Z" />
          <ellipse cx="80" cy="228" rx="10" ry="4" />
          <path d="M30 284C32 262 56 250 80 248C104 250 128 262 130 284Z" />
          <rect x="24" y="282" width="112" height="8" rx="3" />
          <path d="M18 94Q28 100 36 100H124Q132 100 142 94Q136 104 126 108Q80 130 34 108Q24 104 18 94Z" />
          <ellipse
            cx="80"
            cy="100"
            rx="45"
            ry="4"
            style={{ fill: "var(--gold-900)" }}
          />
          <rect x="76" y="62" width="8" height="40" />
          <ellipse cx="80" cy="61" rx="10" ry="3" />
          <path d="M80 18C88 32 90 46 80 58C70 46 72 32 80 18Z" />
        </g>
        {/* The lamp's own shape, so the firelight only falls on brass. The
            dark oil in the bowl lets little of it through. */}
        <mask id={maskId}>
          <use href={`#${bodyId}`} fill="#fff" />
        </mask>
      </defs>

      <use href={`#${bodyId}`} fill={`url(#${brassId})`} />
      {/* Engraved rings, as on a cast brass lamp. */}
      <g
        fill="none"
        strokeWidth="0.8"
        opacity="0.55"
        style={{ stroke: "var(--gold-900)" }}
      >
        <path d="M34 274C52 266 108 266 126 274" />
        <path d="M58 255C70 251 90 251 102 255" />
        <path d="M26 285.5H134" />
        <path d="M65 189C75 192 85 192 95 189" />
        <path d="M31 104C60 120 100 120 129 104" />
      </g>
      <rect
        width="160"
        height="300"
        fill={`url(#${warmId})`}
        mask={`url(#${maskId})`}
        className="lamp-warm"
      />

      {WICKS.map((wick, i) => (
        <g key={wick.x} transform={`translate(${wick.x} ${wick.y})`}>
          <g
            className="lamp-flame"
            style={{ transitionDelay: `${wick.delay}ms` }}
          >
            <g
              className="lamp-flicker"
              style={{ animationDelay: `${i * -0.6}s` }}
            >
              <path d={FLAME} fill={`url(#${fireId})`} />
              <path d={FLAME_CORE} fill="#fffbe6" opacity="0.85" />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}
