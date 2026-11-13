import { Placeholder } from "@/components/ui/Placeholder";
import { story } from "@/content/story";
import { PageHeading } from "./PageHeading";

export function StoryPage() {
  return (
    <div className="mx-auto max-w-md text-center lg:max-w-4xl">
      <PageHeading eyebrow="The Dancer" title="Her Story" />
      <div className="mt-6 flex flex-col items-center gap-6 lg:flex-row lg:gap-12 lg:text-left">
        <Placeholder
          data-settle
          label="Photo of Sushma"
          className="aspect-4/5 h-[30cqh] shrink-0 rounded-t-full lg:h-[55cqh]"
        />
        <div className="space-y-3 text-lg leading-relaxed text-ivory/85 lg:text-xl">
          {story.bio.map((paragraph) => (
            <p key={paragraph} data-settle>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
