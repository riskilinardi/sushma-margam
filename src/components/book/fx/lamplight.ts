import {
  clamp,
  easeInOut,
  easeOut,
  lerp,
  play,
  sizeOf,
  type Point,
} from "./shared";

type LampLightProps = {
  // The lamp screen, which dissolves into the light.
  lamp: HTMLElement;
  // The book under it, which emerges as the light gathers.
  book: HTMLElement;
  layer: HTMLElement;
  flames: Point;
  // Where the light comes to rest: her halo on the cover.
  halo: { centre: Point; radius: number };
  // Called while the light fills the screen, to start the cover's entrance.
  onFull: () => void;
};

// The lamp's light swells until it washes over the screen, the lamp
// dissolving into it, then gathers into the halo behind her on the cover, so
// her halo is lit by the lamp the guest has just lit. The book stays hidden
// until the light is full, so the lamp and the cover never show at once.
export async function lampLight({
  lamp,
  book,
  layer,
  flames,
  halo,
  onFull,
}: LampLightProps) {
  const { width, height } = sizeOf(layer);
  const reach =
    Math.hypot(
      Math.max(flames.x, width - flames.x),
      Math.max(flames.y, height - flames.y),
    ) * 1.1;

  const light = document.createElement("div");
  light.className = "fx-fill";
  layer.append(light);
  const embers = new Embers(layer);

  book.style.opacity = "0";
  await play(0.8, (t) => {
    const swell = easeInOut(t);
    const radius = lerp(30, reach, swell);
    shine(light, flames, radius, swell);
    lamp.style.opacity = String(1 - clamp((t - 0.45) / 0.55));
    embers.emit(flames, radius * 0.35, 1 - t);
  });

  onFull();
  embers.retire();

  await play(1, (t) => {
    const gather = easeOut(t);
    const centre = {
      x: lerp(flames.x, halo.centre.x, gather),
      y: lerp(flames.y, halo.centre.y, gather),
    };
    shine(light, centre, lerp(reach, halo.radius, gather), 1 - easeInOut(t));
    book.style.opacity = String(easeOut(clamp(t / 0.6)));
  });

  book.style.removeProperty("opacity");
  light.remove();
}

// Warm rather than white: guests may open this in a dark theatre.
function shine(
  element: HTMLElement,
  { x, y }: Point,
  radius: number,
  strength: number,
) {
  element.style.background = `radial-gradient(circle at ${x}px ${y}px,
    rgb(255 226 170 / ${0.85 * strength}) 0,
    rgb(232 170 90 / ${0.6 * strength}) ${radius * 0.4}px,
    rgb(140 60 30 / ${0.35 * strength}) ${radius * 0.75}px,
    rgb(140 60 30 / 0) ${radius}px)`;
}

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
};

// Fine sparks thrown off the light as it swells, drifting up as they fade.
class Embers {
  private readonly canvas = document.createElement("canvas");
  private readonly context = this.canvas.getContext("2d")!;
  private readonly size: { width: number; height: number };
  private sparks: Spark[] = [];
  private last = performance.now();
  private retiring = false;

  constructor(layer: HTMLElement) {
    const ratio = Math.min(devicePixelRatio, 2);
    this.size = sizeOf(layer);
    this.canvas.width = this.size.width * ratio;
    this.canvas.height = this.size.height * ratio;
    this.canvas.className = "fx-fill";
    this.context.scale(ratio, ratio);
    layer.append(this.canvas);
    requestAnimationFrame(this.tick);
  }

  emit(origin: Point, radius: number, strength: number) {
    for (let i = 0; i < 2; i++) {
      if (Math.random() > strength * 0.7) continue;
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 80;
      this.sparks.push({
        x: origin.x + Math.cos(angle) * radius,
        y: origin.y + Math.sin(angle) * radius,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        age: 0,
        life: 0.6 + Math.random() * 0.6,
        size: 0.5 + Math.random() * 0.9,
      });
    }
  }

  // Stop adding sparks; the canvas removes itself once the last one fades.
  retire() {
    this.retiring = true;
  }

  private tick = (now: number) => {
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    const { context } = this;

    context.clearRect(0, 0, this.size.width, this.size.height);
    context.globalCompositeOperation = "lighter";
    this.sparks = this.sparks.filter((spark) => (spark.age += dt) < spark.life);

    for (const spark of this.sparks) {
      spark.vy -= 50 * dt;
      spark.x += spark.vx * dt;
      spark.y += spark.vy * dt;
      const alpha = (1 - spark.age / spark.life) * (0.7 + Math.random() * 0.3);
      this.dot(spark, spark.size * 2.2, `rgba(255, 150, 60, ${alpha * 0.18})`);
      this.dot(spark, spark.size, `rgba(255, 210, 140, ${alpha})`);
    }

    if (this.retiring && this.sparks.length === 0) {
      this.canvas.remove();
      return;
    }
    requestAnimationFrame(this.tick);
  };

  private dot({ x, y }: Point, radius: number, colour: string) {
    this.context.fillStyle = colour;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2);
    this.context.fill();
  }
}
