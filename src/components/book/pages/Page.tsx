import type { ReactNode } from "react";
import { PageHeading } from "./PageHeading";

type PageProps = {
  eyebrow: string;
  title: string;
  className?: string;
  children: ReactNode;
};

// Laid out like a printed page: the heading sits at the same height on every
// page, so it stays put as you turn, and the rest is centred below it.
export function Page({ eyebrow, title, className = "", children }: PageProps) {
  return (
    <div
      className={`mx-auto flex min-h-[100cqh] flex-col text-center ${className}`}
    >
      <PageHeading eyebrow={eyebrow} title={title} />
      <div className="flex flex-1 flex-col justify-center pt-6">{children}</div>
    </div>
  );
}
