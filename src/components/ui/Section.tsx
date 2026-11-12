import type { ReactNode } from "react";
import type { SectionId } from "@/lib/sections";
import { Ornament } from "./Ornament";

type SectionProps = {
  id: SectionId;
  eyebrow: string;
  title: string;
  intro?: string;
  className?: string;
  children: ReactNode;
};

// Every section after the hero starts on a fresh screen. On phones the
// bottom padding keeps content clear of the tab bar.
export function Section({
  id,
  eyebrow,
  title,
  intro,
  className = "",
  children,
}: SectionProps) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`relative flex min-h-svh snap-start flex-col justify-center px-6 pt-20 pb-28 sm:px-12 lg:py-28 ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold-500/40 to-transparent"
      />

      <div className="mx-auto w-full max-w-5xl">
        <header className="text-center">
          <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold-500 uppercase sm:text-xs">
            {eyebrow}
          </p>
          <h2
            id={titleId}
            className="mt-3 text-gilded font-display text-[clamp(2rem,9vw,3.25rem)] leading-tight text-balance uppercase"
          >
            {title}
          </h2>
          <Ornament className="mt-5 justify-center" />
          {intro && (
            <p className="mx-auto mt-6 max-w-xl text-lg text-balance text-ivory/75 italic sm:text-xl">
              {intro}
            </p>
          )}
        </header>

        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
