// The Supabase client, fetched the first time the guestbook or gallery needs
// it instead of with the page, so the lamp can be lit sooner on a weak
// signal.
export const getSupabase = () =>
  import("./supabase").then((module) => module.supabase);
