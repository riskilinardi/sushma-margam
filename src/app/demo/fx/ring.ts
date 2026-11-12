import {
  clamp,
  easeIn,
  easeOut,
  play,
  setMask,
  svg,
  type RevealContext,
} from "./shared";

// Same geometry as the cover's FireRing.
const FLAME =
  "M0 0C-5 0-6-5-4-9C-2.5-12.5 0-14 2-20C2-15.5 5-13 5-8.5C5-3.5 3.5 0 0 0Z";
const COUNT = 36;
const INNER = 75 / 200;

// The ring of fire becomes a portal: the next page opens inside it, then the
// ring rushes past the viewer.
export async function ring({ incoming, outgoing, layer }: RevealContext) {
  const existing = outgoing.querySelector('svg[viewBox="-100 -100 200 200"]');
  const size = Math.min(innerWidth, innerHeight) * 0.7;
  const box =
    existing?.getBoundingClientRect() ??
    new DOMRect((innerWidth - size) / 2, (innerHeight - size) / 2, size, size);
  const centre = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  const reach = Math.hypot(
    Math.max(centre.x, innerWidth - centre.x),
    Math.max(centre.y, innerHeight - centre.y),
  );
  const endScale = (reach / (box.width * INNER)) * 1.3;

  const portal = fireRing(layer, box);

  await play(1.4, (t) => {
    const open = easeOut(clamp(t / 0.25));
    const rush = easeIn(clamp((t - 0.15) / 0.85));
    const scale = endScale ** rush;

    portal.style.transform = `scale(${scale}) rotate(${rush * 140}deg)`;
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

function fireRing(layer: HTMLElement, box: DOMRect) {
  const element = svg(
    "svg",
    {
      viewBox: "-100 -100 200 200",
      style: `position: absolute; left: ${box.left}px; top: ${box.top}px; width: ${box.width}px; height: ${box.height}px; color: var(--gold-500); will-change: transform`,
    },
    layer,
  );
  const lines = svg("g", { fill: "none", stroke: "currentColor" }, element);
  svg("circle", { r: 80, "stroke-width": 1.4 }, lines);
  svg("circle", { r: 75, "stroke-width": 0.5 }, lines);

  const flames = svg("g", { fill: "currentColor" }, element);
  for (let i = 0; i < COUNT; i++) {
    svg(
      "path",
      {
        d: FLAME,
        transform: `rotate(${(i * 360) / COUNT}) translate(0 -79) scale(${i % 2 ? 0.55 : 1})`,
      },
      flames,
    );
  }
  return element;
}
