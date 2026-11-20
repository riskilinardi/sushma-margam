import { Placeholder } from "@/components/ui/Placeholder";
import type { ProgrammeItem } from "@/content/programme";
import { LyricsLink } from "./LyricsLink";
import { Page } from "./Page";

type ItemPageProps = {
  item: ProgrammeItem;
  number: number;
};

// One page for each piece in the programme.
export function ItemPage({ item, number }: ItemPageProps) {
  return (
    <Page
      eyebrow={`${String(number).padStart(2, "0")} · ${item.kind}`}
      title={item.name}
      className="max-w-md"
    >
      {/* Pieces without lyrics have room for a larger photo. */}
      <Placeholder
        data-settle
        label={`Sushma dancing ${item.name}`}
        className={`mx-auto aspect-4/5 rounded-t-full ${item.lyrics ? "h-[32cqh]" : "h-[40cqh]"}`}
      />
      <p data-settle className="mt-5 text-lg leading-relaxed text-ivory/85">
        {item.story}
      </p>
      {item.lyrics && (
        <LyricsLink slug={item.slug} opening={item.lyrics[0].transliteration} />
      )}
    </Page>
  );
}
