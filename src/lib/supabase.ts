import { createClient } from "@supabase/supabase-js";

// The publishable key is meant to be public; what it can do is limited by
// the row-level security policies in supabase/schema.sql.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);
