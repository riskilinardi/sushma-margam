import {
  clamp,
  easeIn,
  easeOut,
  play,
  setMask,
  sizeOf,
  svg,
  type RevealContext,
} from "./shared";

// The page opens inside the halo's dotted ring (radius 86 of 200).
const INNER = 86 / 200;

// The halo behind her on the cover becomes a portal: the next page opens
// inside it, then the halo rushes past the viewer, brightening as it comes.
// Without a halo on the page, the portal starts in the middle.
export async function ring({ incoming, outgoing, layer }: RevealContext) {
  const { width, height } = sizeOf(incoming);
  const page = incoming.getBoundingClientRect();
  const existing = outgoing
    .querySelector('svg[viewBox="-100 -100 200 200"]')
    ?.getBoundingClientRect();
  const size = Math.min(width, height) * 0.7;
  const box = existing
    ? new DOMRect(
        existing.left - page.left,
        existing.top - page.top,
        existing.width,
        existing.height,
      )
    : new DOMRect((width - size) / 2, (height - size) / 2, size, size);
  const centre = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  const reach = Math.hypot(
    Math.max(centre.x, width - centre.x),
    Math.max(centre.y, height - centre.y),
  );
  const endScale = (reach / (box.width * INNER)) * 1.3;

  const portal = halo(layer, box);

  await play(1.4, (t) => {
    const open = easeOut(clamp(t / 0.25));
    const rush = easeIn(clamp((t - 0.15) / 0.85));
    const scale = endScale ** rush;

    portal.style.transform = `scale(${scale}) rotate(${rush * 90}deg)`;
    portal.style.opacity = String(
      clamp(t / 0.1) * (1 - clamp((t - 0.75) / 0.25)),
    );

    const r = box.width * INNER * scale * open;
    setMask(
      incoming,
      `radial-gradient(circle at ${centre.x}px ${centre.y}px, #000 ${r * 0.96}px, transparent ${r}px)`,
    );
  });

  portal.remove();
}

// The same rings as the cover's Halo, drawn brighter.
function halo(layer: HTMLElement, box: DOMRect) {
  const element = svg(
    "svg",
    {
      viewBox: "-100 -100 200 200",
      fill: "none",
      stroke: "currentColor",
      style: `position: absolute; left: ${box.left}px; top: ${box.top}px; width: ${box.width}px; height: ${box.height}px; color: var(--gold-200); will-change: transform`,
    },
    layer,
  );
  svg("circle", { r: 96, "stroke-width": 0.9 }, element);
  svg("circle", { r: 92, "stroke-width": 0.35, opacity: 0.6 }, element);
  svg(
    "circle",
    {
      r: 86,
      "stroke-width": 2,
      "stroke-dasharray": "0.1 4.5",
      "stroke-linecap": "round",
    },
    element,
  );
  return element;
}
