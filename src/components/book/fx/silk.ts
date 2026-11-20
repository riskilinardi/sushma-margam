import { clamp, easeInOut, play } from "./shared";

// Carries a page let go mid-turn to rest at `to`, starting at the speed the
// finger left it (in turns per second), with a hint of overshoot.
function spring(
  from: number,
  to: number,
  velocity: number,
  frame: (value: number) => void,
) {
  const stiffness = 170;
  const damping = 24;
  let value = from;
  let speed = velocity;
  let last = performance.now();

  return new Promise<void>((resolve) => {
    requestAnimationFrame(function tick(now) {
      // Small fixed steps keep a stiff spring steady at any frame rate.
      for (let left = Math.min(now - last, 64); left > 0; left -= 4) {
        const dt = Math.min(left, 4) / 1000;
        speed += (-stiffness * (value - to) - damping * speed) * dt;
        value += speed * dt;
      }
      last = now;
      const resting = Math.abs(to - value) < 0.002 && Math.abs(speed) < 0.05;
      frame(resting ? to : value);
      if (resting) resolve();
      else requestAnimationFrame(tick);
    });
  });
}

// A page hinged on its left edge, like a book. Forward turns swing the
// current page from 0° to -180°; backward turns bring the previous page
// back from -180° to 0°. `progress` always runs 0 → 1 towards the new page.
export function silkTurn(
  turning: HTMLElement,
  under: HTMLElement,
  forward: boolean,
) {
  const overlay = (leaf: HTMLElement, name: string) =>
    leaf.querySelector<HTMLElement>(`[data-overlay="${name}"]`)!;
  const shade = overlay(turning, "shade");
  const sheen = overlay(turning, "sheen");
  const backShade = overlay(turning, "back-shade");
  const shadow = overlay(under, "shadow");
  let progress = 0;

  function apply(value: number) {
    progress = value;
    const angle = forward ? -180 * value : -180 * (1 - value);
    const turned = clamp(-angle / 180);
    const lift = Math.sin(turned * Math.PI);

    turning.style.transform = `rotateY(${angle}deg)`;
    shade.style.opacity = String(clamp(turned * 2) * 0.6);
    sheen.style.opacity = String(lift);
    sheen.style.setProperty("--sheen", `${(1 - turned) * 100}%`);
    backShade.style.opacity = String(clamp((1 - turned) * 2) * 0.6);
    shadow.style.opacity = String(lift * 0.8);
    shadow.style.setProperty("--reach", `${(1 - turned) * 100}%`);
  }

  function settle(to: 0 | 1, velocity: number) {
    return spring(progress, to, velocity, apply);
  }

  apply(0);

  return {
    get progress() {
      return progress;
    },
    drag: apply,
    finish: (velocity = 0) => settle(1, velocity),
    cancel: (velocity = 0) => settle(0, velocity),
    play: () => play(0.9, apply, easeInOut),
  };
}

export type SilkTurn = ReturnType<typeof silkTurn>;
