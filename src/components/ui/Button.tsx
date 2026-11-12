import type { ComponentProps } from "react";

type Variant = "outline" | "solid";

const variants: Record<Variant, string> = {
  outline:
    "border border-gold-500/50 text-gold-200 hover:border-gold-200 hover:bg-gold-500/10",
  solid: "bg-gold-500 text-maroon-950 hover:bg-gold-200",
};

export function buttonClass(variant: Variant = "outline") {
  return `inline-flex items-center justify-center rounded-full px-6 py-3.5 font-display text-xs tracking-[0.2em] uppercase transition-colors outline-offset-4 outline-gold-200 focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]}`;
}

type ButtonLinkProps = ComponentProps<"a"> & { variant?: Variant };

export function ButtonLink({
  variant,
  className = "",
  ...props
}: ButtonLinkProps) {
  return <a className={`${buttonClass(variant)} ${className}`} {...props} />;
}
