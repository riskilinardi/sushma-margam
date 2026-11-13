import { buttonClass } from "@/components/ui/Button";
import { sampleWishes } from "@/content/wishes";
import { PageHeading } from "./PageHeading";

export function WishesPage() {
  return (
    <div className="mx-auto max-w-md text-center">
      <PageHeading eyebrow="Guestbook" title="Wishes" />
      <p data-settle className="mt-4 text-lg text-ivory/75 italic">
        Leave a few words for Sushma before her big night.
      </p>

      <ul className="mt-5 space-y-3 text-left">
        {sampleWishes.map((wish) => (
          <li
            key={wish.name}
            data-settle
            className="border border-gold-500/20 bg-maroon-900/60 px-4 py-3"
          >
            <p className="leading-snug">{wish.message}</p>
            <p className="mt-1 text-sm text-gold-200/80 italic">
              — {wish.name}
            </p>
          </li>
        ))}
      </ul>

      <div data-settle>
        <button
          type="button"
          disabled
          className={`mt-6 ${buttonClass("solid")}`}
        >
          Write a wish
        </button>
        <p className="mt-2 text-sm text-ivory/70 italic">
          The guestbook opens soon.
        </p>
      </div>
    </div>
  );
}
