import { Lamp } from "@/components/ui/Lamp";
import { credits, thanks } from "@/content/credits";
import { event } from "@/content/event";
import { labelClass, PageHeading } from "./PageHeading";

// The back cover. The lamp from the opening is still burning.
export function ThanksPage() {
  return (
    <div className="mx-auto max-w-md text-center lg:max-w-2xl">
      <PageHeading eyebrow="With Gratitude" title="Thank You" />
      <p data-settle className="mt-4 text-lg text-balance text-ivory/85">
        {thanks}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3.5 lg:grid-cols-4">
        {credits.map(({ role, name }) => (
          <div key={role} data-settle>
            <dt className={labelClass}>{role}</dt>
            <dd className="mt-1">{name}</dd>
          </div>
        ))}
      </dl>

      <Lamp lit className="mx-auto mt-6 h-16" />
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
    </div>
  );
}
