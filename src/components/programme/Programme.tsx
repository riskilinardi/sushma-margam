import { Section } from "@/components/ui/Section";
import { programme } from "@/content/programme";

// "Margam" means path: the items hang off a single gold thread, alternating
// sides on wider screens.
export function Programme() {
  return (
    <Section
      id="programme"
      eyebrow="The Repertoire"
      title="Programme"
      intro="A Margam follows a set path: it opens with an invocation, builds to the Varnam and ends in celebration."
    >
      <ol className="relative mx-auto max-w-4xl space-y-12 before:absolute before:inset-y-0 before:left-4 before:w-px before:bg-linear-to-b before:from-transparent before:via-gold-500/50 before:to-transparent md:before:left-1/2">
        {programme.map((item, index) => {
          const details = [item.raga, item.tala, item.composer]
            .filter(Boolean)
            .join(" · ");

          return (
            <li key={item.name} className="group relative pl-12 md:pl-0">
              <span
                aria-hidden="true"
                className="absolute top-1.5 left-2.5 size-3 rotate-45 border border-gold-500 bg-maroon-950 md:left-1/2 md:-translate-x-1/2"
              />
              <div className="md:w-1/2 md:pr-14 md:text-right md:group-even:ml-auto md:group-even:pr-0 md:group-even:pl-14 md:group-even:text-left">
                <p className="font-display text-[0.65rem] tracking-[0.3em] text-gold-500 uppercase">
                  {String(index + 1).padStart(2, "0")} · {item.kind}
                </p>
                <h3 className="mt-2 text-3xl">{item.name}</h3>
                {details && (
                  <p className="mt-1 text-sm text-ivory/55">{details}</p>
                )}
                <p className="mt-3 text-lg leading-relaxed text-ivory/80">
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
