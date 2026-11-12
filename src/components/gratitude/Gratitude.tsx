import { Section } from "@/components/ui/Section";
import { credits, thanks } from "@/content/credits";
import { event } from "@/content/event";

export function Gratitude() {
  return (
    <Section id="gratitude" eyebrow="With Gratitude" title="Thank You">
      <p className="mx-auto max-w-2xl text-center text-xl leading-relaxed text-balance text-ivory/85">
        {thanks}
      </p>

      <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 text-center md:grid-cols-4">
        {credits.map(({ role, name }) => (
          <div key={role}>
            <dt className="font-display text-[0.65rem] tracking-[0.3em] text-gold-500 uppercase">
              {role}
            </dt>
            <dd className="mt-2 text-lg">{name}</dd>
          </div>
        ))}
      </dl>

      <footer className="mt-20 text-center text-sm text-ivory/50">
        <p>
          {event.title} · {event.dancer} · {event.startsAt.getFullYear()}
        </p>
        <p className="mt-1">
          Website by{" "}
          <a
            href="https://riskilinardi.vercel.app"
            className="underline decoration-gold-500/40 underline-offset-4 transition-colors hover:text-gold-200"
          >
            Riski Linardi
          </a>
        </p>
      </footer>
    </Section>
  );
}
