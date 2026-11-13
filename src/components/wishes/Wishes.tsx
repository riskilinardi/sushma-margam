import { buttonClass } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { sampleWishes } from "@/content/wishes";

const fieldClass =
  "mt-2 block w-full rounded-sm border border-gold-500/30 bg-maroon-900/70 px-4 py-3 text-base text-ivory placeholder:text-ivory/35 focus:border-gold-200 focus:outline-none";

const labelClass =
  "font-display text-[0.65rem] tracking-[0.3em] text-gold-500 uppercase";

export function Wishes() {
  return (
    <Section
      id="wishes"
      eyebrow="Guestbook"
      title="Wishes"
      intro="Leave a few words for Sushma before her big night."
    >
      <form className="mx-auto max-w-xl" aria-describedby="wishes-status">
        <fieldset disabled className="space-y-5 disabled:opacity-60">
          <label className="block">
            <span className={labelClass}>Your name</span>
            <input
              name="name"
              autoComplete="name"
              maxLength={60}
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Your wish</span>
            <textarea
              name="message"
              rows={4}
              maxLength={500}
              className={`${fieldClass} resize-none`}
            />
          </label>
          <div className="text-center">
            <button type="submit" className={buttonClass("solid")}>
              Offer your wish
            </button>
          </div>
        </fieldset>
        <p
          id="wishes-status"
          className="mt-4 text-center text-sm text-ivory/60 italic"
        >
          The guestbook opens soon.
        </p>
      </form>

      <ul className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {sampleWishes.map((wish) => (
          <li
            key={wish.name}
            className="mb-5 break-inside-avoid border border-gold-500/20 bg-maroon-900/60 p-6"
          >
            <p className="text-lg leading-relaxed">{wish.message}</p>
            <p className="mt-3 text-gold-200/80 italic">— {wish.name}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
