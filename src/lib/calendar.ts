import { event } from "@/content/event";

const title = `${event.title} · ${event.dancer}`;
const location = [
  event.venue.name,
  event.venue.host,
  ...event.venue.address,
].join(", ");
const details = `A Bharatanatyam Margam by ${event.dancer}. Please be seated by ${event.arriveBy}.`;

// iCalendar wants UTC written as 20261205T113000Z.
function utcStamp(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function escapeText(value: string) {
  return value.replace(/[\\;,]/g, (char) => `\\${char}`);
}

// iCalendar lines should stay under 75 characters; longer ones continue
// on the next line after a single space.
function fold(line: string) {
  return line.match(/.{1,73}/g)!.join("\r\n ");
}

export function icsFile() {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//sushma-margam//EN",
    "BEGIN:VEVENT",
    `UID:margam-${utcStamp(event.startsAt)}@sushma-margam`,
    `DTSTAMP:${utcStamp(event.startsAt)}`,
    `DTSTART:${utcStamp(event.startsAt)}`,
    `DTEND:${utcStamp(event.endsAt)}`,
    `SUMMARY:${escapeText(title)}`,
    `LOCATION:${escapeText(location)}`,
    `DESCRIPTION:${escapeText(details)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n");
}
