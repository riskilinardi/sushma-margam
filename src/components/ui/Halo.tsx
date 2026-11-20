// A thin halo of light, like the prabha behind a temple deity. The dotted
// ring turns very slowly.
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
      <circle
        r="86"
        strokeWidth="1.4"
        strokeDasharray="0.1 4.5"
        strokeLinecap="round"
        opacity="0.6"
        className="origin-center animate-[spin_240s_linear_infinite] [transform-box:fill-box] motion-reduce:animate-none"
      />
    </svg>
  );
}
