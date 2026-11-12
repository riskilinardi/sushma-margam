import { Ornament } from "@/components/ui/Ornament";
import { Placeholder } from "@/components/ui/Placeholder";
import { event } from "@/content/event";
import { formatDate, formatTime } from "@/lib/date";
import { Countdown } from "./Countdown";
import { FireRing } from "./FireRing";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh items-center overflow-hidden px-6 py-24 sm:px-12">
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

      <div className="mx-auto grid w-full max-w-6xl gap-y-12 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-8">
        <header className="text-center lg:col-start-2 lg:row-start-1 lg:self-end lg:text-left">
          <p className="font-display text-[0.7rem] tracking-[0.35em] text-balance text-gold-500 uppercase sm:text-xs">
            {event.presentedBy} presents
          </p>
          <h1 className="mt-5 text-gilded font-display text-[clamp(3.25rem,15vw,6rem)] leading-none tracking-wide uppercase lg:text-[clamp(4.5rem,7vw,6.5rem)]">
            {event.title}
          </h1>
          <p className="mt-4 text-[clamp(1.75rem,7vw,2.75rem)] leading-tight">
            {event.dancer}
          </p>
        </header>

        <div className="relative mx-auto w-full max-w-60 sm:max-w-xs lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:max-w-sm lg:self-center">
          <div
            aria-hidden="true"
            className="absolute -inset-1/4 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(201_162_77/0.2),transparent)]"
          />
          <FireRing className="absolute top-[42%] left-1/2 -z-10 w-[150%] -translate-x-1/2 -translate-y-1/2 text-gold-500 opacity-35 lg:w-[165%]" />
          <Placeholder
            label="Paint me like one of your Indian gurl"
            className="aspect-3/4 rounded-t-full"
          />
        </div>

        <div className="text-center lg:col-start-2 lg:row-start-2 lg:self-start lg:text-left">
          <Ornament className="justify-center lg:justify-start" />
          <p className="mt-6 text-lg text-ivory/80 italic sm:text-xl">
            Under the tutelage of {event.guru}
          </p>
          <p className="mt-6 font-display text-sm tracking-[0.2em] text-gold-200 uppercase">
            {formatDate(event.startsAt)}
          </p>
          <p className="mt-2 text-lg text-balance text-ivory/75">
            {formatTime(event.startsAt)} · {event.venue.name}
          </p>
          <Countdown to={event.startsAt} className="mt-10" />
        </div>
      </div>
    </section>
  );
}
