import { Lamp } from "@/components/ui/Lamp";
import { credits, thanks } from "@/content/credits";
import { event } from "@/content/event";
import { Page } from "./Page";
import { labelClass } from "./PageHeading";

// The back cover. The lamp from the opening is still burning.
export function ThanksPage() {
  return (
    <Page
      eyebrow="With Gratitude"
      title="Thank You for Joining Us"
      className="max-w-md lg:max-w-2xl"
    >
      <p data-settle className="text-lg text-balance text-ivory/85">
        {thanks}
      </p>

      {/* Set like the credits in a printed programme: roles to the left of
          the centre line, names to the right. */}
      <dl className="mt-6 space-y-2">
        {credits.map(({ role, name }) => (
          <div
            key={role}
            data-settle
            className="grid grid-cols-2 items-baseline gap-x-4"
          >
            <dt className={`text-right ${labelClass}`}>{role}</dt>
            <dd className="text-left">{name}</dd>
          </div>
        ))}
      </dl>

      <div className="relative mx-auto mt-6">
        <div
          aria-hidden="true"
          className="absolute top-[28%] left-1/2 size-44 -translate-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_190_110/0.22),transparent)]"
        />
        <Lamp lit className="relative h-24" />
      </div>
      <footer data-settle className="mt-3 text-sm text-ivory/70">
        <p>
          {event.title} · {event.dancer} · {event.startsAt.getFullYear()}
        </p>
        <p className="mt-0.5">
          Website by{" "}
          <a
            href="https://riskilinardi.vercel.app"
            className="underline decoration-gold-500/40 underline-offset-4 transition-colors hover:text-gold-200"
          >
            Riski Linardi
          </a>
        </p>
      </footer>
    </Page>
  );
}
