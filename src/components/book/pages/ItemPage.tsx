import { Placeholder } from "@/components/ui/Placeholder";
import type { ProgrammeItem } from "@/content/programme";
import { LyricsLink } from "./LyricsLink";
import { PageHeading } from "./PageHeading";

type ItemPageProps = {
  item: ProgrammeItem;
  number: number;
};

// One page for each piece in the programme.
export function ItemPage({ item, number }: ItemPageProps) {
  return (
    <div className="mx-auto max-w-md text-center">
      <PageHeading
        eyebrow={`${String(number).padStart(2, "0")} · ${item.kind}`}
        title={item.name}
      />
      <Placeholder
        data-settle
        label={`Sushma dancing ${item.name}`}
        className="mx-auto mt-6 aspect-4/5 h-[32cqh] rounded-t-full"
      />
      <p data-settle className="mt-5 text-lg leading-relaxed text-ivory/85">
        {item.story}
      </p>
      {item.lyrics && (
        <LyricsLink slug={item.slug} opening={item.lyrics[0].transliteration} />
      )}
    </div>
  );
}
