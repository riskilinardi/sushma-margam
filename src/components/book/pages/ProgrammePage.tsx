import { programme } from "@/content/programme";
import { PageHeading } from "./PageHeading";

// The whole Margam on one page, strung on the gold thread.
export function ProgrammePage() {
  return (
    <div className="mx-auto max-w-sm">
      <PageHeading eyebrow="The Repertoire" title="Programme" />

      <ol
        data-thread
        className="relative mt-6 space-y-3 before:absolute before:inset-y-2 before:left-[4.5px] before:w-px before:origin-top before:bg-gold-500/40"
      >
        {programme.map((item, index) => (
          <li
            key={item.name}
            data-settle
            className="relative flex items-baseline gap-3 pl-7"
          >
            <span
              aria-hidden="true"
              className="absolute top-2 left-0 size-2.5 rotate-45 border border-gold-500 bg-maroon-950"
            />
            <span className="font-display text-[0.65rem] text-gold-200">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-xl">{item.name}</span>
            <span className="ml-auto font-display text-[0.6rem] tracking-[0.2em] text-ivory/70 uppercase">
              {item.kind}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
