// What a guest's browser remembers through the evening: when they lit the
// lamp, the page they were on and whether they turned the sound off. Phones
// often reload a page left in the background, and nobody should have to
// find their place again after taking a photo: the lamp, once lit again,
// opens the book where they left it.

const KEY = "margam-visit";

// Long enough to last the evening; the next day starts with the lamp again.
const LASTS = 12 * 60 * 60 * 1000;

type Visit = { litAt?: number; page?: string; muted?: boolean };

// Storage can be refused (private browsing, full disk), so failures are
// ignored and the guest simply starts at the lamp.
function read(): Visit {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function remember(change: Visit) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...read(), ...change }));
  } catch {}
}

let arrival: { page?: string; muted: boolean } | undefined;

// Read once per page load: it describes how the guest arrived, not where
// they are now.
export function lastVisit() {
  if (!arrival) {
    const { litAt, page, muted } = read();
    const recent = litAt !== undefined && Date.now() - litAt < LASTS;
    arrival = { page: recent ? page : undefined, muted: muted === true };
  }
  return arrival;
}
