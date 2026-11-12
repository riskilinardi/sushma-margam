import { silhouette } from "../silhouette";
import {
  clamp,
  easeIn,
  easeInOut,
  easeOut,
  play,
  screenSvg,
  svg,
  type RevealContext,
} from "./shared";

// Sushma's outline draws itself in gold, fills with the next page, then the
// camera flies into her until the page covers the screen.
export async function her({ incoming, outgoing, layer }: RevealContext) {
  const { width, height, focal, focalRadius, path } = silhouette;
  const base = Math.min(
    (innerWidth * 0.84) / width,
    (innerHeight * 0.6) / height,
  );
  // Where the focal point sits on screen, with the outline centred.
  const fx = (innerWidth - width * base) / 2 + focal.x * width * base;
  const fy = (innerHeight - height * base) / 2 + focal.y * height * base;
  const reach = Math.hypot(
    Math.max(fx, innerWidth - fx),
    Math.max(fy, innerHeight - fy),
  );
  const endScale = (reach / (focalRadius * height)) * 1.2;

  const dim = outgoing.querySelector<HTMLElement>('[data-overlay="shade"]')!;
  const canvas = screenSvg(layer);
  const group = svg("g", {}, canvas);
  const outline = (opacity: number) =>
    svg(
      "path",
      {
        d: path,
        fill: "none",
        pathLength: 1,
        "stroke-dasharray": "1 1",
        "stroke-linejoin": "round",
        opacity,
        style: "stroke: var(--gold-200)",
      },
      group,
    );
  const strokes = [
    { line: outline(0.25), width: 8 },
    { line: outline(1), width: 1.6 },
  ];

  await play(2.2, (t) => {
    const draw = easeInOut(clamp(t / 0.4));
    const fill = easeOut(clamp((t - 0.32) / 0.2));
    const zoom = easeIn(clamp((t - 0.5) / 0.5));
    const scale = base * (endScale / base) ** zoom;
    const x = fx - focal.x * width * scale;
    const y = fy - focal.y * height * scale;

    group.setAttribute("transform", `translate(${x} ${y}) scale(${scale})`);
    for (const { line, width } of strokes) {
      line.setAttribute("stroke-dashoffset", String(1 - draw));
      line.setAttribute("stroke-width", String(width / scale));
    }
    canvas.style.opacity = String(1 - zoom);
    dim.style.opacity = String(0.6 * clamp(t / 0.3) * (1 - zoom));

    incoming.style.opacity = String(fill);
    incoming.style.clipPath = `path("${placePath(path, scale, x, y)}")`;
  });

  canvas.remove();
}

// The path is all x/y pairs, so every other number is an x coordinate.
function placePath(d: string, scale: number, x: number, y: number) {
  let i = 0;
  return d.replace(/-?\d+(?:\.\d+)?/g, (n) =>
    (Number(n) * scale + (i++ % 2 === 0 ? x : y)).toFixed(1),
  );
}
