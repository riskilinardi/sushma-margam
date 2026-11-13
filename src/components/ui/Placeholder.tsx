import type { ComponentProps } from "react";

type PlaceholderProps = ComponentProps<"div"> & { label: string };

export function Placeholder({
  label,
  className = "",
  ...props
}: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`grid place-items-center border border-dashed border-gold-500/50 bg-maroon-900/85 p-3 text-center ${className}`}
      {...props}
    >
      <span className="font-display text-[0.7rem] tracking-[0.3em] text-gold-200/80 uppercase">
        {label}
      </span>
    </div>
  );
}
