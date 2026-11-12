import { ImageResponse } from "next/og";
import { event } from "@/content/event";
import { formatDate, formatTime } from "@/lib/date";

export const alt = `${event.title} · ${event.dancer}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const gold = "#c9a24d";
const lightGold = "#f1dda3";

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

// Fetches only the glyphs in `text`, as TTF, which is what ImageResponse reads.
async function googleFont(family: string, text: string) {
  "use cache";
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
  const eyebrow = `${event.presentedBy} presents`.toUpperCase();
  const title = event.title.toUpperCase();
  const when =
    `${formatDate(event.startsAt)} · ${formatTime(event.startsAt)}`.toUpperCase();

  const [cinzel, garamond] = await Promise.all([
    googleFont("Cinzel", eyebrow + title + when),
    googleFont("EB+Garamond", event.dancer),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a0507",
        backgroundImage:
          "radial-gradient(ellipse at 50% 45%, #4a1016, #1a0507 70%)",
        color: "#f4ead8",
        fontFamily: "Cinzel",
      }}
    >
      <div style={frame(24, "66")} />
      <div style={frame(32, "33")} />

      <div style={{ fontSize: 22, letterSpacing: 8, color: gold }}>
        {eyebrow}
      </div>
      <div
        style={{
          fontSize: 168,
          lineHeight: 1,
          marginTop: 20,
          color: "#d9b764",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 64, marginTop: 12, fontFamily: "Garamond" }}>
        {event.dancer}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginTop: 30,
        }}
      >
        <div style={{ width: 90, height: 1, backgroundColor: gold }} />
        <div
          style={{
            width: 12,
            height: 12,
            backgroundColor: gold,
            transform: "rotate(45deg)",
          }}
        />
        <div style={{ width: 90, height: 1, backgroundColor: gold }} />
      </div>

      <div
        style={{
          fontSize: 26,
          letterSpacing: 5,
          marginTop: 30,
          color: lightGold,
        }}
      >
        {when}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Cinzel", data: cinzel },
        { name: "Garamond", data: garamond },
      ],
    },
  );
}
