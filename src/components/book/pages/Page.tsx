import type { ReactNode } from "react";
import { PageHeading } from "./PageHeading";

type PageProps = {
  eyebrow: string;
  title: string;
  className?: string;
  children: ReactNode;
};

// A heading with the page beneath it. Fit centres the two together, so a
// short page never leaves a gap under its heading.
export function Page({ eyebrow, title, className = "", children }: PageProps) {
  return (
    <div className={`mx-auto text-center ${className}`}>
      <PageHeading eyebrow={eyebrow} title={title} />
      <div className="pt-6">{children}</div>
    </div>
  );
}
