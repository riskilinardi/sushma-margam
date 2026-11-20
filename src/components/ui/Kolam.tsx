import { useId, type CSSProperties } from "react";
import "./kolam.css";

// Seen from a little above, so circles on the floor are flattened.
const TILT = 0.36;

const timing = (delay: number, duration?: number) =>
  ({
    "--delay": `${delay}s`,
    "--duration": duration && `${duration}s`,
  }) as CSSProperties;

function at(radius: number, degrees: number) {
  const angle = (degrees * Math.PI) / 180;
  return [radius * Math.cos(angle), radius * Math.sin(angle) * TILT];
}

const point = (radius: number, degrees: number) =>
  at(radius, degrees)
    .map((n) => n.toFixed(1))
    .join(" ");

// The pulli: dots laid down first, which the line then loops around.
const DOTS = 16;
const dots = Array.from({ length: DOTS }, (_, i) => at(86, (i * 360) / DOTS));

// Two lines weaving in and out between the dots in opposite directions, so
// each dot ends up inside a loop of its own.
function weave(side: 1 | -1) {
  const steps = 192;
  let path = "";
  for (let i = 0; i <= steps; i++) {
    const degrees = (i * 360) / steps;
    const sway = Math.cos(((DOTS / 2) * degrees * Math.PI) / 180);
    path += `${i ? "L" : "M"}${point(86 + side * 9 * sway, degrees)}`;
  }
  return `${path}Z`;
}
const weaves = [weave(1), weave(-1)];

// A lotus of eight petals around the foot of the lamp, a dot between each.
const PETALS = 8;
const petals = Array.from({ length: PETALS }, (_, i) => {
  const d = (i * 360) / PETALS;
  return `M${point(40, d)}C${point(52, d - 20)} ${point(68, d - 11)} ${point(76, d)}C${point(68, d + 11)} ${point(52, d + 20)} ${point(40, d)}Z`;
});
const petalDots = Array.from({ length: PETALS }, (_, i) =>
  at(62, ((i + 0.5) * 360) / PETALS),
);

// A kolam drawn on the floor beneath the lamp, the way it is drawn by hand:
// the dots first, then the line around them. It catches the light once the
// lamp is lit.
export function Kolam({
  lit,
  className = "",
}: {
  lit: boolean;
  className?: string;
}) {
  const poolId = `${useId()}-pool`;

  return (
    <svg
      viewBox="-110 -40 220 80"
      aria-hidden="true"
      data-lit={lit || undefined}
      className={`kolam ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <radialGradient id={poolId}>
          <stop offset="0" stopColor="rgb(255 190 110 / 0.4)" />
          <stop offset="1" stopColor="rgb(255 190 110 / 0)" />
        </radialGradient>
      </defs>
      <ellipse
        rx="110"
        ry={110 * TILT}
        fill={`url(#${poolId})`}
        stroke="none"
        className="kolam-pool"
      />

      {[...dots, ...petalDots].map(([x, y], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="1.6"
          ry={1.6 * TILT * 1.6}
          fill="currentColor"
          stroke="none"
          className="kolam-dot"
          style={timing(0.15 + (i % DOTS) * 0.035)}
        />
      ))}
      {petals.map((path, i) => (
        <path
          key={path}
          d={path}
          pathLength={1}
          className="kolam-line"
          style={timing(0.7 + i * 0.07)}
        />
      ))}
      {weaves.map((path) => (
        <path
          key={path}
          d={path}
          pathLength={1}
          className="kolam-line"
          style={timing(1.1, 1.8)}
        />
      ))}
    </svg>
  );
}
