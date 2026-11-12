import { Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { event } from "@/content/event";
import { story } from "@/content/story";

export function Story() {
  return (
    <Section id="story" eyebrow="The Dancer" title="Her Story">
      <div className="grid items-center gap-10 md:grid-cols-[2fr_3fr] md:gap-16">
        <Placeholder
          label="Photo of Sushma"
          className="mx-auto aspect-4/5 w-full max-w-56 md:max-w-xs"
        />
        <div className="space-y-5 text-lg leading-relaxed text-ivory/85 md:text-xl">
          {story.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="mt-16 border-t border-gold-500/20 pt-12 text-center">
        <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold-500 uppercase">
          Under the tutelage of
        </p>
        <p className="mt-2 text-3xl">{event.guru}</p>
        <p className="mt-8 font-display text-[0.7rem] tracking-[0.35em] text-gold-500 uppercase">
          In gratitude to former teachers
        </p>
        <p className="mt-2 text-2xl text-ivory/85">
          {event.formerTeachers.join(" & ")}
        </p>
      </div>
    </Section>
  );
}
