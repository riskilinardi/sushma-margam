# Margam · Sushma Sekaran

Website for Sushma's Bharatanatyam Margam on 5 December 2026 at Nrityalaya Aesthetics Society, Singapore. Guests open it on their phones on the day.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The guestbook and gallery need a `.env.local` (see below).

## Where things live

The site is a storybook: one page at a time, turned by swiping, with a dock along the bottom for page turning and sound.

- `src/content/` holds the words on the site: event details, story, teachers, programme (with each song's lyrics) and credits. Change text here, not in the components.
- `src/app/page.tsx` sets the order of the pages and which turns get a special transition.
- `src/components/book/` is the book itself: page turning, the dock and the lamp opening. Each page lives in `book/pages/`, and the transitions in `book/fx/`.
- `src/components/ui/` has the shared pieces: buttons, ornament, lamp, ring of fire and countdown.
- `src/lib/guestbook.ts` and `src/lib/gallery.ts` talk to Supabase.
- `src/app/admin/` is the page for running the evening: opening the guestbook, removing wishes, uploading photos.
- `src/app/print/` is an A4 sheet with a QR code to the site, for putting up at the venue. Open `/print` on the live site and print it.
- `src/app/globals.css` has the colour palette and fonts.

Run `npm run format` before committing.

## Guestbook and gallery (Supabase)

1. Put the project's URL and publishable key in `.env.local`, and in the Vercel project's environment variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   ```

2. In Supabase → SQL Editor, run `supabase/schema.sql`. Then, in a new query there (not in the file), add the admins: `insert into public.admins (email) values ('...'), ('...');`
3. In Supabase → Authentication → Users, add each admin with an email and password (tick "Auto Confirm User").
4. Sign in at `/admin`.

Free Supabase projects pause after a week without activity, so open the site in the days before the performance.
