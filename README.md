# Margam · Sushma Sekaran

Website for Sushma's Bharatanatyam Margam on 5 December 2026 at Nrityalaya Aesthetics Society, Singapore.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Where things live

The site is a storybook: one page at a time, turned by swiping, with a dock along the bottom for page turning and sound.

- `src/content/` holds every word on the site: event details, story, programme, gallery, lyrics, wishes and credits. Change text here, not in the components.
- `src/app/page.tsx` sets the order of the pages and which turns get a special transition.
- `src/components/book/` is the book itself: page turning, the dock and the lamp opening. Each page lives in `book/pages/`, and the transitions in `book/fx/`.
- `src/components/ui/` has the shared pieces: buttons, ornament, lamp, ring of fire and countdown.
- `src/app/globals.css` has the colour palette and fonts.
- `src/app/opengraph-image.tsx` draws the preview image shown when the link is shared, and `src/app/margam.ics` serves the calendar invite.

Run `npm run format` before committing.
