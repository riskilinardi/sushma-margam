import { Countdown } from "@/components/ui/Countdown";
import { FireRing } from "@/components/ui/FireRing";
import { Ornament } from "@/components/ui/Ornament";
import { Placeholder } from "@/components/ui/Placeholder";
import { event } from "@/content/event";
import { formatDate, formatTime } from "@/lib/date";

// The portrait is sized by the page's height (cqh), so the cover keeps its
// proportions on any screen. Side by side from lg up.
export function CoverPage() {
  return (
    <div className="isolate mx-auto grid max-w-5xl items-center gap-y-5 text-center lg:grid-cols-2 lg:gap-x-16 lg:text-left">
      <header className="lg:col-start-2 lg:row-start-1 lg:self-end">
        <p className="font-display text-[0.65rem] tracking-[0.35em] text-balance text-gold-200 uppercase sm:text-xs">
          {event.presentedBy} presents
        </p>
        <h1
          data-glint
          className="mt-2 text-gilded font-display text-[clamp(2.75rem,13vw,4.5rem)] leading-none tracking-wide uppercase lg:text-[5.5rem]"
        >
          {event.title}
        </h1>
        <p className="mt-2 text-[clamp(1.5rem,6.5vw,2.25rem)] leading-tight lg:text-[2.75rem]">
          {event.dancer}
        </p>
      </header>

      <div
        data-settle
        className="relative mx-auto aspect-3/4 h-[34cqh] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-[72cqh]"
      >
        <div
          aria-hidden="true"
          className="absolute -inset-1/4 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(201_162_77/0.2),transparent)]"
        />
        <FireRing className="absolute top-[42%] left-1/2 -z-10 w-[150%] -translate-x-1/2 -translate-y-1/2 text-gold-500 opacity-35" />
        <Placeholder
          label="Paint me like one of your Indian gurl"
          className="size-full rounded-t-full"
        />
      </div>

      <div data-settle className="lg:col-start-2 lg:row-start-2 lg:self-start">
        <Ornament className="justify-center lg:justify-start" />
        <p className="mt-3 text-base text-ivory/80 italic sm:text-lg">
          Under the tutelage of {event.guru}
        </p>
        <p className="mt-3 font-display text-xs tracking-[0.2em] text-gold-200 uppercase sm:text-sm">
          {formatDate(event.startsAt)}
        </p>
        <p className="mt-1 text-base text-ivory/75 sm:text-lg">
          {formatTime(event.startsAt)} · {event.venue.name}
        </p>
        <Countdown to={event.startsAt} className="mt-4" />
      </div>
    </div>
  );
}
