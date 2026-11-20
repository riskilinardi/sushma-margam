import Image from "next/image";
import cover from "@/assets/sushma-cover.webp";
import { Countdown } from "@/components/ui/Countdown";
import { Halo } from "@/components/ui/Halo";
import { Ornament } from "@/components/ui/Ornament";
import { event } from "@/content/event";
import { guru } from "@/content/teachers";
import { formatDate, formatTime } from "@/lib/date";

// Laid out like a magazine cover. The title sits behind her: her photo
// starts a fixed share of the title's size above the title's bottom edge, so
// her head tucks into the letters by the same amount on every screen. Her
// lower half fades into the page beneath the details.
export function CoverPage() {
  return (
    <div className="relative isolate mx-auto flex h-full flex-col text-center lg:max-w-[160cqh]">
      <header>
        <p className="font-display text-[0.6rem] tracking-[0.3em] text-balance text-gold-200 uppercase lg:text-xs lg:tracking-[0.35em]">
          {event.presentedBy} presents
        </p>
        <h1
          data-glint
          className="mt-1 text-gilded font-display text-[18cqw] leading-none tracking-wide uppercase lg:mt-2 lg:text-[min(13.5cqw,26cqh)]"
        >
          {event.title}
        </h1>
      </header>

      <div className="relative -mt-[6.5cqw] min-h-0 flex-1 lg:-mt-[min(5.7cqw,11cqh)]">
        <div
          aria-hidden="true"
          className="absolute top-[34%] left-1/2 -z-10 aspect-square h-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_190_110/0.28),rgb(201_162_77/0.07)_55%,transparent)]"
        />
        <Halo className="absolute top-[34%] left-[46%] -z-10 h-[78%] -translate-x-1/2 -translate-y-1/2 lg:left-[48.5%]" />

        {/* The glow sits on a wrapper: on the image itself, the fade would
            clip it to a visible rectangle. */}
        <div className="absolute inset-0 z-10 flex justify-center">
          <div
            data-settle
            className="h-full [filter:drop-shadow(0_0_24px_rgb(255_190_110/0.28))]"
          >
            <Image
              src={cover}
              alt="Sushma in a Bharatanatyam pose, holding a lotus"
              preload
              sizes="(min-width: 1024px) 40vw, 85vw"
              className="h-full w-auto max-w-none [mask-image:linear-gradient(to_bottom,#000_55%,transparent_97%)]"
            />
          </div>
        </div>
      </div>

      <div
        data-settle
        className="absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-maroon-950/95 via-maroon-950/75 to-transparent pt-20 lg:flex lg:items-end lg:justify-between lg:bg-none lg:pt-0 lg:text-left"
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
          className="mt-3 justify-center lg:mt-0 lg:justify-end"
        />
      </div>
    </div>
  );
}
