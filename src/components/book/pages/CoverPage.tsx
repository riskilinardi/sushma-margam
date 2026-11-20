import Image from "next/image";
import type { CSSProperties } from "react";
import cover from "@/assets/sushma-cover.webp";
import { Countdown } from "@/components/ui/Countdown";
import { Halo } from "@/components/ui/Halo";
import { Ornament } from "@/components/ui/Ornament";
import { event } from "@/content/event";
import { guru } from "@/content/teachers";
import { formatDate, formatTime } from "@/lib/date";
import { Motes } from "./Motes";
import "./cover.css";

// Laid out like a magazine cover. The title sits behind her: her photo
// starts a fixed share of the title's size above the title's bottom edge, so
// her head tucks into the letters by the same amount on every screen. Her
// lower half fades into the page beneath the details.
//
// Everything hangs on one line down the middle: her photo is shifted so the
// line through her head and pendant is centred (see .cover-light), which
// puts her head between MAR and GAM, and the glow, rays and halo are
// centred on her chest.
//
// Back to front: drifting motes, the lamp's glow with the rays and halo, the
// title, her photo, a few soft out-of-focus motes, then the details.
export function CoverPage() {
  return (
    <div className="relative isolate mx-auto flex h-full flex-col text-center lg:max-w-[160cqh]">
      <Motes count={26} className="-z-10" />

      <header className="cover-near">
        <p className="font-display text-[0.6rem] tracking-[0.3em] text-balance text-gold-200 uppercase lg:text-xs lg:tracking-[0.35em]">
          {event.presentedBy} presents
        </p>
        {/* Each letter catches the lamp's light in turn (see cover.css). */}
        <h1 className="cover-title mt-1 font-display text-[18cqw] leading-none tracking-wide uppercase lg:mt-2 lg:text-[min(12.5cqw,24cqh)]">
          <span className="sr-only">{event.title}</span>
          {[...event.title].map((letter, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="cover-letter"
              style={{ "--i": i } as CSSProperties}
            >
              {letter}
            </span>
          ))}
        </h1>
      </header>

      <div className="relative -mt-[6.5cqw] min-h-0 flex-1 lg:-mt-[min(5.25cqw,10cqh)]">
        <div aria-hidden="true" className="cover-aura absolute inset-0 -z-10">
          <div className="cover-glow absolute top-[33%] left-1/2 aspect-square h-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_190_110/0.3),rgb(201_162_77/0.08)_55%,transparent)]" />
          <div className="cover-rays absolute top-[33%] left-1/2 aspect-square h-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <Halo className="cover-halo absolute top-[33%] left-1/2 h-[66%] -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="cover-stage absolute inset-0 z-10 flex justify-center">
          {/* Three layers: the outer one comes into focus on arrival; the
              light sits on the middle one, because on the image itself the
              fade would clip it to a visible rectangle. */}
          <div className="cover-figure h-full">
            <div className="cover-light h-full">
              <Image
                src={cover}
                alt="Sushma in a Bharatanatyam pose, holding a lotus"
                preload
                quality={90}
                sizes="(min-width: 1024px) 40vw, 85vw"
                className="h-full w-auto max-w-none [mask-image:linear-gradient(to_bottom,#000_50%,transparent_92%)]"
              />
            </div>
          </div>
        </div>
      </div>

      <Motes count={4} soft className="z-[15]" />

      <div
        data-settle
        className="cover-details absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-maroon-950/90 via-maroon-950/45 to-transparent pt-20 lg:flex lg:items-end lg:justify-between lg:bg-none lg:pt-0 lg:text-left"
      >
        <div>
          <p className="text-[min(9cqw,6.5cqh)] leading-tight lg:text-[min(3.4cqw,6.5cqh)]">
            {event.dancer}
          </p>
          <Ornament className="mt-1.5 justify-center lg:justify-start" />
          <p className="mt-2 text-ivory/85 italic lg:text-lg [@container(max-height:26rem)]:hidden">
            Under the tutelage of {guru.name}
          </p>
          <p className="mt-1.5 font-display text-xs tracking-[0.2em] text-gold-200 uppercase lg:text-sm">
            {formatDate(event.startsAt)} · {formatTime(event.startsAt)}
          </p>
        </div>
        <Countdown
          to={event.startsAt}
          label="The curtain rises in"
          className="mt-4 flex flex-col items-center lg:mt-0 lg:items-end"
        />
      </div>
    </div>
  );
}
