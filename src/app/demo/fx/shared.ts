import { animate } from "motion";

export type Point = { x: number; y: number };

export type RevealContext = {
  incoming: HTMLElement;
  outgoing: HTMLElement;
  layer: HTMLElement;
  origin: Point;
};

export type Reveal = (context: RevealContext) => Promise<void>;

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);
export const lerp = (from: number, to: number, t: number) =>
  from + (to - from) * t;
export const easeIn = (t: number) => t * t * t;
export const easeOut = (t: number) => 1 - (1 - t) ** 3;
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

// Drives `frame` from 0 to 1. The first frame runs immediately so nothing
// flashes before the animation starts.
export async function play(seconds: number, frame: (t: number) => void) {
  frame(0);
  await animate(0, 1, { duration: seconds, ease: "linear", onUpdate: frame });
}

export function setMask(
  element: HTMLElement,
  image: string,
  intersect = false,
) {
  element.style.setProperty("mask-image", image);
  element.style.setProperty("-webkit-mask-image", image);
  if (intersect) {
    element.style.setProperty("mask-composite", "intersect");
    element.style.setProperty("-webkit-mask-composite", "source-in");
  }
}

const SVG_NS = "http://www.w3.org/2000/svg";

export function svg<Tag extends keyof SVGElementTagNameMap>(
  tag: Tag,
  attributes: Record<string, string | number> = {},
  parent?: Element,
) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value));
  }
  parent?.append(element);
  return element;
}

export function screenSvg(layer: HTMLElement) {
  return svg(
    "svg",
    { width: innerWidth, height: innerHeight, class: "fx-fill" },
    layer,
  );
}

export function resetLeaf(leaf: HTMLElement) {
  leaf.removeAttribute("style");
  delete leaf.dataset.role;
  for (const overlay of leaf.querySelectorAll("[data-overlay]")) {
    overlay.removeAttribute("style");
  }
}
