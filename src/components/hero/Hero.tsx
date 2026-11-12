import { Ornament } from "@/components/ui/Ornament";
import { Placeholder } from "@/components/ui/Placeholder";
import { event } from "@/content/event";
import { formatDate, formatTime } from "@/lib/date";
import { Countdown } from "./Countdown";
import { FireRing } from "./FireRing";

// On phones the hero is exactly one screen tall: the text keeps its size and
// the portrait takes whatever height is left. From lg up it sits side by side.
export function Hero() {
  return (
    <section className="relative isolate flex h-svh min-h-[34rem] overflow-hidden px-6 py-8 sm:px-12 lg:h-auto lg:min-h-svh lg:items-center lg:py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,var(--maroon-800),var(--maroon-950)_70%)] lg:bg-[radial-gradient(ellipse_at_30%_50%,var(--maroon-800),var(--maroon-950)_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 border border-gold-500/30 sm:inset-5"
      >
        <div className="absolute inset-1.5 border border-gold-500/15" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-rows-[auto_minmax(0,1fr)_auto] gap-y-5 lg:grid-cols-2 lg:grid-rows-none lg:gap-x-20 lg:gap-y-8">
        <header className="text-center lg:col-start-2 lg:row-start-1 lg:self-end lg:text-left">
          <p className="font-display text-[0.7rem] tracking-[0.35em] text-balance text-gold-500 uppercase sm:text-xs">
            {event.presentedBy} presents
          </p>
          <h1 className="mt-3 text-gilded font-display text-[min(15vw,8svh,6rem)] leading-none tracking-wide uppercase lg:mt-5 lg:text-[clamp(4.5rem,7vw,6.5rem)]">
            {event.title}
          </h1>
          <p className="mt-2 text-[clamp(1.75rem,7vw,2.75rem)] leading-tight lg:mt-4">
            {event.dancer}
          </p>
        </header>

        <div className="flex min-h-0 justify-center lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div className="relative aspect-3/4 h-full max-h-[30rem] lg:h-auto lg:max-h-none lg:w-full lg:max-w-sm">
            <div
              aria-hidden="true"
              className="absolute -inset-1/4 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(201_162_77/0.2),transparent)]"
            />
            <FireRing className="absolute top-[42%] left-1/2 -z-10 w-[150%] -translate-x-1/2 -translate-y-1/2 text-gold-500 opacity-35 lg:w-[165%]" />
            <Placeholder
              label="Paint me like one of your Indian gurl"
              className="size-full rounded-t-full"
            />
          </div>
        </div>

        <div className="text-center lg:col-start-2 lg:row-start-2 lg:self-start lg:text-left">
          <Ornament className="justify-center lg:justify-start" />
          <p className="mt-3 text-base text-ivory/80 italic sm:text-xl lg:mt-6">
            Under the tutelage of {event.guru}
          </p>
          <p className="mt-3 font-display text-xs tracking-[0.2em] text-gold-200 uppercase sm:text-sm lg:mt-6">
            {formatDate(event.startsAt)}
          </p>
          <p className="mt-1 text-base text-ivory/75 sm:text-lg lg:mt-2">
            {formatTime(event.startsAt)} · {event.venue.name}
            <span className="max-lg:hidden">, {event.venue.host}</span>
          </p>
          <Countdown to={event.startsAt} className="mt-5 lg:mt-10" />
        </div>
      </div>
    </section>
  );
}
