import { Placeholder } from "@/components/ui/Placeholder";
import { story } from "@/content/story";
import { PageHeading } from "./PageHeading";

// Then and now: her first dance beside her today, the earlier one a little
// smaller.
export function StoryPage() {
  const [then, now] = story.photos;

  return (
    <div className="mx-auto max-w-md text-center lg:max-w-2xl">
      <PageHeading eyebrow="The Dancer" title="Her Story" />

      <div className="mt-6 flex items-end justify-center gap-5">
        {[
          { photo: then, size: "h-[24cqh]" },
          { photo: now, size: "h-[30cqh]" },
        ].map(({ photo, size }) => (
          <figure key={photo.caption} data-settle>
            <Placeholder
              label={photo.alt}
              className={`aspect-3/4 rounded-t-full ${size}`}
            />
            <figcaption className="mt-2 font-display text-[0.6rem] tracking-[0.25em] text-gold-200 uppercase">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-6 space-y-3 text-lg leading-relaxed text-ivory/85">
        {story.bio.map((paragraph) => (
          <p key={paragraph} data-settle>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
