"use client";

import { useEffect, useState } from "react";
import { sections, type SectionId } from "@/lib/sections";

const tabs = sections.filter((section) => section.inTabBar);

// Whichever section crosses the middle of the screen counts as current.
function useCurrentSection() {
  const [current, setCurrent] = useState<SectionId>(sections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    for (const { id } of sections) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return current;
}

export function SiteNav() {
  const current = useCurrentSection();
  const onCover = current === sections[0].id;

  return (
    <>
      <nav
        aria-label="Sections"
        className="fixed top-1/2 right-8 z-40 hidden -translate-y-1/2 lg:block"
      >
        <ol className="relative flex flex-col items-end gap-5 before:absolute before:inset-y-1 before:right-[5px] before:w-px before:bg-gold-500/25">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={current === id ? "true" : undefined}
                className="group flex items-center gap-4 outline-none"
              >
                <span className="font-display text-[0.65rem] tracking-[0.3em] text-gold-200 uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {label}
                </span>
                <span className="size-2.5 rotate-45 border border-gold-500 bg-maroon-950 transition-colors group-hover:bg-gold-500/50 group-aria-[current=true]:bg-gold-500" />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <nav
        aria-label="Sections"
        inert={onCover}
        className={`fixed inset-x-3 bottom-3 z-40 rounded-full border border-gold-500/30 bg-maroon-950/95 backdrop-blur-md transition duration-500 lg:hidden ${onCover ? "translate-y-[150%] opacity-0" : ""}`}
      >
        <ul className="flex">
          {tabs.map(({ id, label }) => (
            <li key={id} className="flex-1">
              <a
                href={`#${id}`}
                aria-current={current === id ? "true" : undefined}
                className="block py-4 text-center font-display text-[0.62rem] tracking-[0.18em] text-ivory/55 uppercase transition-colors aria-[current=true]:text-gold-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
