import type { Metadata } from "next";
import QRCode from "qrcode";
import { Lamp } from "@/components/ui/Lamp";
import { Ornament } from "@/components/ui/Ornament";
import { event } from "@/content/event";
import { guru } from "@/content/teachers";
import { formatDate, formatTime } from "@/lib/date";
import { siteUrl } from "@/lib/site";
import "./print.css";

export const metadata: Metadata = {
  title: "QR sheet · Margam",
  robots: { index: false },
};

const corners = [
  "-top-[1.4mm] -left-[1.4mm]",
  "-top-[1.4mm] -right-[1.4mm]",
  "-bottom-[1.4mm] -left-[1.4mm]",
  "-right-[1.4mm] -bottom-[1.4mm]",
];

// A sheet to print on A4 and put up at the venue. The code points at the
// live site, so print it from the deployed site, not from your computer.
export default function PrintPage() {
  return (
    <>
      <p className="py-5 text-center text-sm text-ivory/70 italic print:hidden">
        Print on A4 with Ctrl + P (⌘ + P on a Mac), with margins set to none.
      </p>

      <main className="print-sheet relative mx-auto flex flex-col items-center bg-white px-[22mm] pt-[24mm] pb-[18mm] text-center text-maroon-900">
        <div
          aria-hidden="true"
          className="absolute inset-[9mm] border-[0.3mm] border-gold-500"
        >
          <div className="absolute inset-[1.6mm] border-[0.2mm] border-gold-500/50" />
          {corners.map((corner) => (
            <span
              key={corner}
              className={`absolute size-[2.8mm] rotate-45 bg-gold-500 ${corner}`}
            />
          ))}
        </div>

        <p className="font-display text-[8.5pt] tracking-[0.35em] uppercase">
          {event.presentedBy} presents
        </p>
        <h1 className="mt-[3mm] font-display text-[60pt] leading-none tracking-wide text-maroon-700 uppercase">
          {event.title}
        </h1>
        <Ornament className="mt-[4mm] justify-center" />
        <p className="mt-[4mm] text-[26pt] leading-tight">{event.dancer}</p>
        <p className="mt-[1.5mm] text-[12pt] italic opacity-80">
          Under the tutelage of {guru.name}
        </p>
        <p className="mt-[3mm] font-display text-[9pt] tracking-[0.25em] uppercase">
          {formatDate(event.startsAt)} · {formatTime(event.startsAt)}
        </p>

        <div className="flex flex-1 flex-col items-center justify-center py-[6mm]">
          <div className="border-[0.3mm] border-gold-500 p-[1.6mm]">
            <div className="border-[0.2mm] border-gold-500/50 p-[3mm]">
              <QrCode value={siteUrl} className="size-[92mm]" />
            </div>
          </div>

          <p className="mt-[8mm] font-display text-[12pt] tracking-[0.3em] uppercase">
            Scan with your phone camera
          </p>
          <p className="mt-[2mm] text-[14pt] italic opacity-85">
            The programme, the lyrics, and a guestbook for your wishes
          </p>
          <p className="mt-[2mm] text-[10pt] tracking-wide opacity-70">
            {siteUrl.replace(/^https?:\/\//, "")}
          </p>
        </div>

        <div className="flex items-center gap-[3mm]">
          <Lamp lit className="h-[14mm]" />
          <p className="text-[11pt] italic opacity-80">
            Light the lamp to begin
          </p>
        </div>
      </main>
    </>
  );
}

// Plain square modules in near-black maroon on white, with the standard
// quiet zone around them, so any phone camera reads it first time.
function QrCode({ value, className }: { value: string; className: string }) {
  const { modules } = QRCode.create(value, { errorCorrectionLevel: "Q" });
  const size = modules.size;
  let path = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (modules.get(y, x)) path += `M${x} ${y}h1v1h-1z`;
    }
  }

  return (
    <svg
      viewBox={`-4 -4 ${size + 8} ${size + 8}`}
      role="img"
      aria-label={`QR code for ${value}`}
      shapeRendering="crispEdges"
      className={className}
    >
      <rect
        x="-4"
        y="-4"
        width={size + 8}
        height={size + 8}
        className="fill-white"
      />
      <path d={path} className="fill-maroon-900" />
    </svg>
  );
}
