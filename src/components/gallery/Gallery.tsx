import { Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { gallery, type Photo } from "@/content/gallery";

const shapes: Record<Photo["shape"], string> = {
  portrait: "aspect-3/4",
  tall: "aspect-2/3",
  square: "aspect-square",
  landscape: "aspect-4/3",
};

export function Gallery() {
  return (
    <Section
      id="gallery"
      eyebrow="Moments"
      title="Gallery"
      intro="From the photoshoot, rehearsals and the months in between."
    >
      <div className="columns-2 gap-4 md:columns-3">
        {gallery.map((photo) => (
          <Placeholder
            key={photo.alt}
            label={photo.alt}
            className={`mb-4 break-inside-avoid ${shapes[photo.shape]}`}
          />
        ))}
      </div>
    </Section>
  );
}
