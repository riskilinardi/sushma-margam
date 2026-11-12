# Margam · Sushma Sekaran

Website for Sushma's Bharatanatyam Margam on 5 December 2026 at Nrityalaya Aesthetics Society, Singapore.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Where things live

- `src/content/` holds every word on the site: event details, story, programme, gallery, lyrics and credits. Change text here, not in the components.
- `src/components/` has one folder per section of the page, with shared pieces (section frame, buttons, ornament) in `ui`.
- `src/lib/sections.ts` sets the order of the sections and which ones appear in the phone navigation.
- `src/app/globals.css` has the colour palette and fonts.
- `src/app/opengraph-image.tsx` draws the preview image shown when the link is shared, and `src/app/margam.ics` serves the calendar invite.

Run `npm run format` before committing.
