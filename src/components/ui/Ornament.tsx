export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-3 text-gold-500 ${className}`}
    >
      <span className="h-px w-16 bg-linear-to-r from-transparent to-current" />
      <svg viewBox="0 0 20 20" className="size-3.5 fill-current">
        <path d="M10 0 12 8 20 10 12 12 10 20 8 12 0 10 8 8Z" />
      </svg>
      <span className="h-px w-16 bg-linear-to-l from-transparent to-current" />
    </div>
  );
}
