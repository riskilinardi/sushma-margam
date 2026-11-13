import { Placeholder } from "@/components/ui/Placeholder";
import { gallery } from "@/content/gallery";
import { PageHeading } from "./PageHeading";

export function GalleryPage() {
  return (
    <div className="mx-auto max-w-md lg:max-w-3xl">
      <PageHeading eyebrow="Moments" title="Gallery" />
      <div className="mt-6 grid grid-cols-3 gap-2 lg:gap-3">
        {gallery.map((photo) => (
          <Placeholder
            key={photo.alt}
            label={photo.alt}
            className="aspect-3/4"
          />
        ))}
      </div>
    </div>
  );
}
