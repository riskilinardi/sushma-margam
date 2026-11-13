"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

// Pages never scroll. Content that is taller than its page is scaled down
// until it fits; content that already fits is centred at full size.
// The box is a size container, so pages can size images in `cqh`.
export function Fit({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const outer = box.current!;
    const inner = content.current!;

    function fit() {
      const available = outer.clientHeight;
      const needed = inner.offsetHeight;
      const scale = Math.min(1, available / needed);
      const offset = (available - needed * scale) / 2;
      inner.style.transform = `translateY(${offset}px) scale(${scale})`;
    }

    const observer = new ResizeObserver(fit);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className="[container-type:size] absolute inset-x-7 inset-y-8 overflow-hidden lg:inset-x-16 lg:inset-y-12"
    >
      <div ref={content} className="origin-top">
        {children}
      </div>
    </div>
  );
}
