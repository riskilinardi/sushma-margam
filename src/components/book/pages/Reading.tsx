"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Text that scrolls inside its page, fading at the bottom only while there
// is more below, so a short text never looks cut off.
export function Reading({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = panel.current!;
    function check() {
      const below =
        element.scrollHeight - element.scrollTop - element.clientHeight;
      element.toggleAttribute("data-more", below > 4);
    }
    const observer = new ResizeObserver(check);
    observer.observe(element);
    for (const child of element.children) observer.observe(child);
    element.addEventListener("scroll", check, { passive: true });
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", check);
    };
  }, []);

  return (
    <div ref={panel} className={`reading ${className}`}>
      {children}
    </div>
  );
}
