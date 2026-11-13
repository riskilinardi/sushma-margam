type PlaceholderProps = {
  label: string;
  className?: string;
};

export function Placeholder({ label, className = "" }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`grid place-items-center border border-dashed border-gold-500/50 bg-maroon-900/85 p-3 text-center ${className}`}
    >
      <span className="font-display text-[0.7rem] tracking-[0.3em] text-gold-500/80 uppercase">
        {label}
      </span>
    </div>
  );
}
