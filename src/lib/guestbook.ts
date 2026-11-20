import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type Wish = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

export async function addWish(name: string, message: string) {
  const { data, error } = await supabase
    .from("wishes")
    .insert({ name: name.trim(), message: message.trim() })
    .select()
    .single<Wish>();
  if (error) throw error;
  return data;
}

export async function removeWish(id: number) {
  const { error } = await supabase.from("wishes").delete().eq("id", id);
  if (error) throw error;
}

export async function setGuestbookOpen(open: boolean) {
  const { error } = await supabase
    .from("settings")
    .update({ guestbook_open: open })
    .eq("id", true);
  if (error) throw error;
}

// Wishes newest first, and whether guests can write, kept live while
// `live` is true. Returns null until the first load.
export function useGuestbook(live: boolean) {
  const [wishes, setWishes] = useState<Wish[] | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;

    Promise.all([
      supabase
        .from("wishes")
        .select("id, name, message, created_at")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase.from("settings").select("guestbook_open").single(),
    ]).then(([list, settings]) => {
      if (cancelled) return;
      if (list.data) setWishes(list.data);
      if (settings.data) setOpen(settings.data.guestbook_open);
    });

    const channel = supabase
      .channel("guestbook")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wishes" },
        ({ new: wish }) => setWishes((list) => withWish(list, wish as Wish)),
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "wishes" },
        ({ old }) =>
          setWishes(
            (list) => list?.filter((wish) => wish.id !== old.id) ?? null,
          ),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "settings" },
        ({ new: settings }) => setOpen(settings.guestbook_open),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [live]);

  // A wish we just sent shows at once; its live copy is then ignored.
  function show(wish: Wish) {
    setWishes((list) => withWish(list, wish));
  }

  return { wishes, open, show };
}

function withWish(list: Wish[] | null, wish: Wish) {
  if (list?.some((existing) => existing.id === wish.id)) return list;
  return [wish, ...(list ?? [])];
}
