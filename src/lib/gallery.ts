import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type Photo = {
  id: number;
  path: string;
  width: number;
  height: number;
  created_at: string;
};

const bucket = () => supabase.storage.from("gallery");

export function photoUrl(path: string) {
  return bucket().getPublicUrl(path).data.publicUrl;
}

// Phone photos are 3–10 MB. Shrinking them first makes uploads quick on
// mobile data and keeps the gallery fast for guests.
async function shrink(file: File, longest = 2000) {
  const image = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });
  const scale = Math.min(1, longest / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85),
  );
  if (!blob) throw new Error("Could not read this photo.");
  return { blob, width: canvas.width, height: canvas.height };
}

export async function uploadPhoto(file: File) {
  const { blob, width, height } = await shrink(file);
  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.jpg`;

  const upload = await bucket().upload(path, blob, {
    contentType: "image/jpeg",
    cacheControl: "31536000",
  });
  if (upload.error) throw upload.error;

  const { error } = await supabase
    .from("photos")
    .insert({ path, width, height });
  if (error) {
    await bucket().remove([path]);
    throw error;
  }
}

export async function removePhoto(photo: Photo) {
  const { error } = await supabase.from("photos").delete().eq("id", photo.id);
  if (error) throw error;
  await bucket().remove([photo.path]);
}

// Photos newest first, kept live while `live` is true. Null until loaded.
export function useGallery(live: boolean) {
  const [photos, setPhotos] = useState<Photo[] | null>(null);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;

    supabase
      .from("photos")
      .select("id, path, width, height, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled && data) setPhotos(data);
      });

    const channel = supabase
      .channel("gallery")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "photos" },
        ({ new: photo }) =>
          setPhotos((list) => [photo as Photo, ...(list ?? [])]),
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "photos" },
        ({ old }) =>
          setPhotos(
            (list) => list?.filter((photo) => photo.id !== old.id) ?? null,
          ),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [live]);

  return photos;
}
