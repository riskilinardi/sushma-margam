"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { photoUrl, useGallery, type Photo } from "@/lib/gallery";
import { useIsNearby } from "../Book";
import { PageHeading } from "./PageHeading";

// Photos uploaded from /admin on the day appear here live.
export function GalleryPage() {
  const photos = useGallery(useIsNearby());
  const [viewing, setViewing] = useState<number | null>(null);

  return (
    <div className="mx-auto flex h-full max-w-md flex-col lg:max-w-3xl">
      <PageHeading eyebrow="Moments" title="Gallery" />

      {photos && photos.length > 0 ? (
        <ul className="page-scroll mt-5 grid min-h-0 flex-1 grid-cols-3 content-start gap-2 pb-4 lg:grid-cols-4 lg:gap-3">
          {photos.map((photo, index) => (
            <li
              key={photo.id}
              className="animate-[settle-rise_0.6s_cubic-bezier(0.2,0.7,0.2,1)_both]"
            >
              <button
                type="button"
                onClick={() => setViewing(index)}
                className="block w-full"
              >
                <Image
                  src={photoUrl(photo.path)}
                  alt={`Photo ${index + 1} from the evening`}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1024px) 20vw, 30vw"
                  className="aspect-square w-full border border-gold-500/20 object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        // Empty mounts where the photos will go, fading down the page.
        <div
          data-settle
          className="flex flex-1 flex-col items-center justify-center pb-[8cqh] text-center"
        >
          <div
            aria-hidden="true"
            className="grid w-full max-w-60 grid-cols-3 gap-2 [mask-image:linear-gradient(#000_20%,transparent)]"
          >
            {Array.from({ length: 6 }, (_, i) => (
              <span
                key={i}
                className="aspect-square border border-gold-500/30 bg-maroon-900/50"
              />
            ))}
          </div>
          <p className="mt-6 text-lg text-ivory/80 italic">
            Photos from the evening will appear here.
          </p>
        </div>
      )}

      {photos && (
        <Lightbox
          photos={photos}
          index={viewing}
          onChange={setViewing}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}

type LightboxProps = {
  photos: Photo[];
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
};

// A native modal dialog, so it sits above the whole book. Its pointer events
// stop here, or a swipe between photos would also turn the page behind it.
function Lightbox({ photos, index, onChange, onClose }: LightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = index === null ? undefined : photos[index];

  useEffect(() => {
    const element = dialog.current!;
    if (photo && !element.open) element.showModal();
    if (!photo && element.open) element.close();
  }, [photo]);

  const step = (by: number) =>
    index !== null && onChange((index + by + photos.length) % photos.length);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onPointerDown={(event) => event.stopPropagation()}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-maroon-950/95 p-0 text-ivory backdrop:bg-black/70"
    >
      {photo && index !== null && (
        <div className="relative flex h-full flex-col">
          <div className="relative min-h-0 flex-1">
            <Image
              key={photo.id}
              src={photoUrl(photo.path)}
              alt={`Photo ${index + 1} from the evening`}
              fill
              sizes="100vw"
              className="animate-[settle-rise_0.4s_ease-out_both] object-contain"
            />
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <RoundButton label="Previous photo" onClick={() => step(-1)}>
              <path d="M10 3L5 8l5 5" />
            </RoundButton>
            <p className="font-display text-xs tracking-[0.2em] text-gold-200">
              {index + 1} / {photos.length}
            </p>
            <RoundButton label="Next photo" onClick={() => step(1)}>
              <path d="M6 3l5 5-5 5" />
            </RoundButton>
            <RoundButton label="Close" onClick={onClose}>
              <path d="M4 4l8 8M12 4l-8 8" />
            </RoundButton>
          </div>
        </div>
      )}
    </dialog>
  );
}

type RoundButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
};

function RoundButton({ label, onClick, children }: RoundButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-gold-500/40 text-gold-200"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        {children}
      </svg>
    </button>
  );
}
