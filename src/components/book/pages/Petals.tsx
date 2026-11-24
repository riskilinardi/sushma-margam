import type { CSSProperties } from "react";
import "./petals.css";

// Mostly jasmine, then marigold, and a few rose.
const MIX = ["jasmine", "marigold", "jasmine", "rose", "jasmine", "marigold"];

// The same shower every time, and on the server and in the browser alike,
// so the petals come from a seeded sequence rather than Math.random.
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const random = seeded(5122026);
const petals = Array.from({ length: 22 }, (_, i) => ({
  kind: MIX[i % MIX.length],
  left: `${(2 + random() * 96).toFixed(1)}%`,
  delay: `${(random() * 2.2).toFixed(2)}s`,
  fall: `${(5.5 + random() * 2.5).toFixed(2)}s`,
  size: (0.75 + random() * 0.55).toFixed(2),
  sway: `${(random() * -1.6).toFixed(2)}s`,
  tumble: `${(random() * -2.4).toFixed(2)}s`,
}));

// The book opens with the lighting of a lamp and closes with flowers: a
// handful of petals falls once across the last page as it settles, like
// the offering of Pushpanjali returned to the guests.
export function Petals() {
  return (
    <div aria-hidden="true" className="petals">
      {petals.map((petal, i) => (
        <span
          key={i}
          className="petal"
          style={
            {
              left: petal.left,
              "--delay": petal.delay,
              "--fall": petal.fall,
              "--size": petal.size,
            } as CSSProperties
          }
        >
          <span className="petal-sway" style={{ animationDelay: petal.sway }}>
            <span
              className={`petal-leaf petal-${petal.kind}`}
              style={{ animationDelay: petal.tumble }}
            />
          </span>
        </span>
      ))}
    </div>
  );
}
