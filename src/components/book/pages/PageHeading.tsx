import { Ornament } from "@/components/ui/Ornament";

type PageHeadingProps = {
  eyebrow: string;
  title: string;
};

export function PageHeading({ eyebrow, title }: PageHeadingProps) {
  return (
    <header className="text-center">
      <p className="font-display text-[0.65rem] tracking-[0.35em] text-gold-500 uppercase sm:text-xs">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-gilded font-display text-[2rem] leading-tight text-balance uppercase sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <Ornament className="mt-3 justify-center" />
    </header>
  );
}

export const labelClass =
  "font-display text-[0.65rem] tracking-[0.3em] text-gold-500 uppercase";
