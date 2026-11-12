import { animate } from "motion";
import { clamp } from "./shared";

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

  async function settle(to: 0 | 1, velocity: number) {
    await animate(progress, to, {
      type: "spring",
      stiffness: 170,
      damping: 24,
      restDelta: 0.002,
      velocity,
      onUpdate: apply,
    });
  }

  apply(0);

  return {
    get progress() {
      return progress;
    },
    drag: apply,
    finish: (velocity = 0) => settle(1, velocity),
    cancel: (velocity = 0) => settle(0, velocity),
    async play() {
      await animate(0, 1, {
        duration: 0.9,
        ease: [0.65, 0, 0.35, 1],
        onUpdate: apply,
      });
    },
  };
}

export type SilkTurn = ReturnType<typeof silkTurn>;
