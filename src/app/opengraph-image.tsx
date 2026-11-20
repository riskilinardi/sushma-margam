import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { event } from "@/content/event";
import { guru } from "@/content/teachers";
import { formatDay, formatTime, formatWeekday } from "@/lib/date";

export const alt = `${event.title} · ${event.dancer}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

const maroon = "#1a0507";
const gold = "#c9a24d";
const lightGold = "#f1dda3";
const gildedText = {
  backgroundImage:
    "linear-gradient(180deg, #fbefc8 0%, #e9cd86 30%, #b98a35 52%, #f3dc9d 66%, #8a6526 100%)",
  backgroundClip: "text",
  color: "transparent",
};

// A PNG copy of the cover cut-out (400 × 639): the renderer can't draw WebP.
const figure = { width: 360, height: 575, top: 150 };
const halo = { size: 380, x: 588, y: 330 };

// The image renderer doesn't understand `inset`, so each side is spelled out.
function frame(offset: number, alpha: string) {
  return {
    position: "absolute" as const,
    top: offset,
    right: offset,
    bottom: offset,
    left: offset,
    border: `1px solid ${gold}${alpha}`,
  };
}

function ring(diameter: number, alpha: string, width = 1) {
  return {
    position: "absolute" as const,
    left: halo.x - diameter / 2,
    top: halo.y - diameter / 2,
    width: diameter,
    height: diameter,
    borderRadius: "50%",
    border: `${width}px solid ${gold}${alpha}`,
  };
}

// Fetches only the glyphs in `text`, as TTF, which is what ImageResponse reads.
async function googleFont(family: string, text: string) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`,
  ).then((res) => res.text());
  const url = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
  )?.[1];
  if (!url) throw new Error(`Could not load the ${family} font`);
  return fetch(url).then((res) => res.arrayBuffer());
}

export default async function OpenGraphImage() {
  return new Response(await card(), {
    headers: { "Content-Type": contentType },
  });
}

// The desktop cover, in landscape: she stands in front of the title inside
// her halo, with her name and the date to either side. Cached, so it is
// drawn once at build time rather than for every link preview.
async function card() {
  "use cache";
  const eyebrow = `${event.presentedBy} presents`.toUpperCase();
  const title = event.title.toUpperCase();
  const weekday = formatWeekday(event.startsAt).toUpperCase();
  const day = formatDay(event.startsAt).toUpperCase();
  const time = formatTime(event.startsAt).toUpperCase();
  const tutelage = `Under the tutelage of ${guru.name}`;

  const [cinzel, garamond, garamondItalic, photo] = await Promise.all([
    googleFont("Cinzel", eyebrow + title + weekday + day + time),
    googleFont("EB+Garamond", event.dancer),
    googleFont("EB+Garamond:ital@1", tutelage),
    readFile(join(process.cwd(), "src/assets/sushma-share.png"), "base64"),
  ]);

  const png = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: maroon,
        backgroundImage: `radial-gradient(ellipse at 50% 45%, #4a1016, ${maroon} 70%)`,
        color: "#f4ead8",
        fontFamily: "Cinzel",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: halo.x - 330,
          top: halo.y - 330,
          width: 660,
          height: 660,
          borderRadius: "50%",
          // Every stop is the lamp's colour; a `transparent` stop would fade
          // through black.
          backgroundImage:
            "radial-gradient(circle, rgba(255,190,110,0.34) 0%, rgba(201,162,77,0.1) 40%, rgba(201,162,77,0) 70%)",
        }}
      />
      <div style={ring(halo.size, "88", 1.5)} />
      <div style={ring(halo.size - 16, "44")} />

      <div
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 20, letterSpacing: 8, color: lightGold }}>
          {eyebrow}
        </div>
        <div
          style={{
            fontSize: 176,
            lineHeight: 1,
            marginTop: 10,
            letterSpacing: 4,
            ...gildedText,
          }}
        >
          {title}
        </div>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element -- rendered to a PNG, not a page */}
      <img
        src={`data:image/png;base64,${photo}`}
        alt=""
        width={figure.width}
        height={figure.height}
        style={{
          position: "absolute",
          top: figure.top,
          left: 600 - figure.width / 2,
        }}
      />

      {/* Her lower half fades into the page. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 260,
          backgroundImage: `linear-gradient(to bottom, rgba(26,5,7,0), ${maroon} 80%)`,
        }}
      />

      <div style={frame(24, "66")} />
      <div style={frame(32, "33")} />

      <div
        style={{
          position: "absolute",
          left: 96,
          bottom: 76,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontFamily: "Garamond", fontSize: 58, lineHeight: 1.1 }}>
          {event.dancer}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 14,
          }}
        >
          <div style={{ width: 70, height: 1, backgroundColor: gold }} />
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: gold,
              transform: "rotate(45deg)",
            }}
          />
          <div style={{ width: 70, height: 1, backgroundColor: gold }} />
        </div>
        <div
          style={{
            fontFamily: "Garamond Italic",
            fontSize: 26,
            marginTop: 14,
            color: "rgba(244,234,216,0.85)",
          }}
        >
          {tutelage}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 96,
          bottom: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          fontSize: 24,
          letterSpacing: 5,
          color: lightGold,
          lineHeight: 1.6,
        }}
      >
        <div>{weekday}</div>
        <div>{day}</div>
        <div style={{ ...gildedText, fontSize: 40, letterSpacing: 4 }}>
          {time}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Cinzel", data: cinzel },
        { name: "Garamond", data: garamond },
        { name: "Garamond Italic", data: garamondItalic, style: "italic" },
      ],
    },
  );

  // WhatsApp can leave out preview images much over 300 KB. With her photo
  // the PNG is larger than that; as a JPEG it is a fraction of the size.
  const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  return new Uint8Array(jpeg);
}
