"use client";

import { useEffect, useRef } from "react";
import { useIsCurrent } from "../Book";

type Mote = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
};

type MotesProps = {
  count: number;
  // Large, faint and blurred, as if out of focus in front of the figure.
  soft?: boolean;
  className?: string;
};

// Motes of light drifting up through the lamplight. Only runs while its
// page is the one being read, and not at all with reduced motion.
export function Motes({ count, soft = false, className = "" }: MotesProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const running = useIsCurrent();

  useEffect(() => {
    if (!running || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const element = canvas.current!;
    const context = element.getContext("2d")!;
    const ratio = Math.min(devicePixelRatio, 2);
    let width = 0;
    let height = 0;

    function resize() {
      width = element.clientWidth;
      height = element.clientHeight;
      element.width = width * ratio;
      element.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);

    function mote(anywhere: boolean): Mote {
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : height + 12,
        radius: soft ? 5 + Math.random() * 7 : 1.2 + Math.random() * 2.2,
        speed: soft ? 5 + Math.random() * 6 : 7 + Math.random() * 14,
        sway: (Math.random() - 0.5) * 10,
        phase: Math.random() * Math.PI * 2,
        alpha: soft ? 0.1 + Math.random() * 0.08 : 0.3 + Math.random() * 0.4,
      };
    }
    const motes = Array.from({ length: count }, () => mote(true));

    let last = performance.now();
    let frame = requestAnimationFrame(function draw(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      context.clearRect(0, 0, width, height);

      for (const m of motes) {
        m.y -= m.speed * dt;
        m.phase += dt;
        m.x += Math.sin(m.phase) * m.sway * dt;
        if (m.y < -12) Object.assign(m, mote(false));

        // Twinkle, and fade out near the top and bottom of the page.
        const twinkle = 0.65 + 0.35 * Math.sin(m.phase * 2.3);
        const edge = Math.min(
          1,
          m.y / (height * 0.2),
          (height - m.y) / (height * 0.2),
        );
        context.globalAlpha = m.alpha * twinkle * Math.max(0, edge);

        const glow = context.createRadialGradient(
          m.x,
          m.y,
          0,
          m.x,
          m.y,
          m.radius,
        );
        glow.addColorStop(0, "rgba(255, 228, 175, 1)");
        glow.addColorStop(soft ? 0.5 : 0.25, "rgba(255, 200, 120, 0.5)");
        glow.addColorStop(1, "rgba(255, 190, 110, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        context.fill();
      }
      frame = requestAnimationFrame(draw);
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [running, count, soft]);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
    />
  );
}
