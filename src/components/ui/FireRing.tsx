// The ring of fire (prabha) that frames Nataraja.
const COUNT = 36;
const FLAME =
  "M0 0C-5 0-6-5-4-9C-2.5-12.5 0-14 2-20C2-15.5 5-13 5-8.5C5-3.5 3.5 0 0 0Z";
const ANGLES = Array.from({ length: COUNT }, (_, i) => (i * 360) / COUNT);

export function FireRing({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="-100 -100 200 200"
      aria-hidden="true"
      className={`animate-[spin_240s_linear_infinite] motion-reduce:animate-none ${className}`}
    >
      <g fill="none" stroke="currentColor">
        <circle r="80" strokeWidth="1.2" />
        <circle r="75" strokeWidth="0.4" />
        <circle r="62" strokeWidth="0.4" strokeDasharray="1 3" />
      </g>

      <g fill="currentColor">
        {ANGLES.map((angle, i) => (
          <path
            key={angle}
            d={FLAME}
            transform={`rotate(${angle}) translate(0 -79) scale(${i % 2 ? 0.55 : 1})`}
          />
        ))}
      </g>

      <g fill="currentColor">
        {ANGLES.map((angle) => (
          <circle
            key={angle}
            r="1.1"
            transform={`rotate(${angle + 180 / COUNT}) translate(0 -69)`}
          />
        ))}
      </g>
    </svg>
  );
}
