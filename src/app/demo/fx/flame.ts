import {
  clamp,
  easeInOut,
  play,
  setMask,
  type Point,
  type RevealContext,
} from "./shared";

const TONGUES = 12;

// Lamp light spreading from the touch point. The edge is a ring of
// flickering lobes rather than a clean circle, with embers thrown off it.
export async function flame({ incoming, layer, origin }: RevealContext) {
  const reach =
    Math.hypot(
      Math.max(origin.x, innerWidth - origin.x),
      Math.max(origin.y, innerHeight - origin.y),
    ) * 1.25;

  const tongues = Array.from({ length: TONGUES }, (_, i) => {
    const angle = (i / TONGUES) * Math.PI * 2 + Math.random() * 0.3;
    // Fire leans upward, so tongues on the top of the circle are taller.
    const lift = 1 + 0.7 * Math.max(0, -Math.sin(angle));
    return {
      angle,
      size: (0.14 + Math.random() * 0.08) * lift,
      phase: Math.random() * Math.PI * 2,
    };
  });

  const glow = document.createElement("div");
  glow.className = "fx-fill";
  layer.append(glow);
  const embers = new Embers(layer);

  await play(1.3, (t) => {
    const radius = easeInOut(t) * reach;
    const time = performance.now() / 1000;
    const at = (x: number, y: number) => `circle at ${x}px ${y}px`;

    const shapes = [
      `radial-gradient(${at(origin.x, origin.y)}, #000 ${radius * 0.9}px, transparent ${radius}px)`,
    ];
    for (const tongue of tongues) {
      const size =
        radius * tongue.size * (1 + 0.3 * Math.sin(time * 11 + tongue.phase));
      const x = origin.x + Math.cos(tongue.angle) * radius * 0.92;
      const y = origin.y + Math.sin(tongue.angle) * radius * 0.92;
      shapes.push(
        `radial-gradient(${at(x, y)}, #000 ${size * 0.55}px, transparent ${size}px)`,
      );
    }
    setMask(incoming, shapes.join(","));

    glow.style.background = `radial-gradient(${at(origin.x, origin.y)}, transparent ${radius * 0.75}px, rgb(255 176 72 / ${0.5 * (1 - t)}) ${radius}px, transparent ${radius * 1.15 + 24}px)`;
    embers.emit(origin, radius, clamp(1.2 - t));
  });

  glow.remove();
  embers.retire();
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

class Embers {
  private readonly canvas = document.createElement("canvas");
  private readonly context = this.canvas.getContext("2d")!;
  private sparks: Spark[] = [];
  private last = performance.now();
  private retiring = false;

  constructor(layer: HTMLElement) {
    const ratio = Math.min(devicePixelRatio, 2);
    this.canvas.width = innerWidth * ratio;
    this.canvas.height = innerHeight * ratio;
    this.canvas.className = "fx-fill";
    this.context.scale(ratio, ratio);
    layer.append(this.canvas);
    requestAnimationFrame(this.tick);
  }

  // A few fine sparks per frame, thrown off the edge once the light has
  // some size, so they never bunch up around the flame.
  emit(origin: Point, radius: number, strength: number) {
    if (radius < 60) return;
    for (let i = 0; i < 2; i++) {
      if (Math.random() > strength * 0.7) continue;
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 90;
      this.sparks.push({
        x: origin.x + Math.cos(angle) * radius,
        y: origin.y + Math.sin(angle) * radius,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        age: 0,
        life: 0.5 + Math.random() * 0.5,
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

    context.clearRect(0, 0, innerWidth, innerHeight);
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
