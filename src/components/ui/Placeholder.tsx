import type { ComponentProps } from "react";

type PlaceholderProps = ComponentProps<"div"> & { label: string };

// Where a photo will go: an empty gilt frame with a lotus, so the page looks
// finished before the photo arrives.
export function Placeholder({
  label,
  className = "",
  ...props
}: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative overflow-hidden border border-gold-500/45 bg-[radial-gradient(ellipse_at_50%_35%,var(--maroon-800),var(--maroon-900)_75%)] p-1.5 ${className}`}
      {...props}
    >
      <div className="grid size-full place-items-center rounded-[inherit] border border-gold-500/20">
        <svg
          viewBox="0 0 40 26"
          aria-hidden="true"
          className="w-[28%] max-w-12 text-gold-500/55"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        >
          <path d="M20 2C25 8 25 16 20 22 15 16 15 8 20 2Z" />
          <path d="M20 22C12 21 6 15 4 8 11 9 17 14 20 22Z" />
          <path d="M20 22C28 21 34 15 36 8 29 9 23 14 20 22Z" />
          <path d="M8 25H32" />
        </svg>
      </div>
    </div>
  );
}
