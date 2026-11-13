import {
  clamp,
  easeIn,
  easeOut,
  layerSvg,
  lerp,
  play,
  setMask,
  sizeOf,
  svg,
  type Point,
  type RevealContext,
} from "./shared";

const PLEATS = 16;
const PLEAT_ANGLE = 180 / PLEATS;

// The pleated fan at the front of a Bharatanatyam costume, which opens when
// the dancer sinks into araimandi. The new page shows through the pleats,
// each edged in gold, then the fan blooms outward to fill the page.
export async function fan({ incoming, layer }: RevealContext) {
  const { width, height } = sizeOf(incoming);
  const pivot = { x: width / 2, y: height };
  // Sized so the whole open fan fits the page before it blooms.
  const radius = Math.min(width * 0.48, height * 0.8);
  const reach = Math.hypot(width / 2, height) * 1.05;

  const canvas = layerSvg(layer);
  const gradient = svg(
    "linearGradient",
    { id: "fx-pleat", x1: 0, x2: 1 },
    svg("defs", {}, canvas),
  );
  // Each pleat is lit on one side of its fold and in shadow on the other.
  for (const [offset, colour] of [
    [0, "rgb(255 236 190 / 0.3)"],
    [0.5, "rgb(255 236 190 / 0.06)"],
    [0.5, "rgb(20 4 6 / 0.4)"],
    [1, "rgb(20 4 6 / 0.12)"],
  ]) {
    svg("stop", { offset, "stop-color": colour }, gradient);
  }

  const hub = svg(
    "g",
    { transform: `translate(${pivot.x} ${pivot.y})` },
    canvas,
  );
  // Slightly wider than a pleat so neighbours overlap and hide the seams.
  const half = ((PLEAT_ANGLE / 2) * Math.PI) / 180 / 0.97;
  const [sx, sy] = [Math.sin(half), -Math.cos(half)];
  const pleats = Array.from({ length: PLEATS }, (_, i) => ({
    target: -90 + PLEAT_ANGLE / 2 + i * PLEAT_ANGLE,
    shape: svg(
      "path",
      { d: `M0 0L${-sx} ${sy}A1 1 0 0 1 ${sx} ${sy}Z`, fill: "url(#fx-pleat)" },
      hub,
    ),
    seam: svg(
      "path",
      {
        d: `M0 0L${-sx} ${sy}`,
        "vector-effect": "non-scaling-stroke",
        style: "stroke: var(--gold-500); stroke-width: 1.2",
      },
      hub,
    ),
  }));

  const border = (width: number, colour: string, dashes?: string) =>
    svg(
      "path",
      {
        fill: "none",
        "stroke-linecap": "round",
        ...(dashes && { "stroke-dasharray": dashes }),
        style: `stroke: var(${colour}); stroke-width: ${width}`,
      },
      canvas,
    );
  const zari = [
    { path: border(10, "--gold-500"), inset: 5 },
    { path: border(1.5, "--gold-200"), inset: 14 },
    { path: border(3, "--gold-200", "0.1 10"), inset: 22 },
  ];

  await play(1.8, (t) => {
    const open = easeOut(clamp(t / 0.6));
    const bloom = easeIn(clamp((t - 0.55) / 0.45));
    const r = lerp(radius * 0.5, radius, open) + (reach - radius) * bloom;
    const spread = (90 - PLEAT_ANGLE / 2) * open + PLEAT_ANGLE / 2;

    for (const pleat of pleats) {
      const transform = `rotate(${pleat.target * open}) scale(${r})`;
      pleat.shape.setAttribute("transform", transform);
      pleat.seam.setAttribute("transform", transform);
    }
    for (const band of zari) {
      band.path.setAttribute("d", arc(pivot, r - band.inset, spread));
    }
    canvas.style.opacity = String(clamp(t / 0.06) * (1 - bloom));

    setMask(
      incoming,
      `conic-gradient(from ${-spread}deg at ${pivot.x}px ${pivot.y}px, #000 ${spread * 2}deg, transparent 0), ` +
        `radial-gradient(circle at ${pivot.x}px ${pivot.y}px, #000 ${r}px, transparent ${r + 1}px)`,
      true,
    );
  });

  canvas.remove();
}

function arc(centre: Point, r: number, spreadDegrees: number) {
  const angle = (spreadDegrees * Math.PI) / 180;
  const dx = Math.sin(angle) * r;
  const y = centre.y - Math.cos(angle) * r;
  return `M${centre.x - dx} ${y}A${r} ${r} 0 0 1 ${centre.x + dx} ${y}`;
}
