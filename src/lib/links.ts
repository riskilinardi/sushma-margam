import { event } from "@/content/event";
import { formatDate, formatTime } from "@/lib/date";
import { siteUrl } from "@/lib/site";

const address = event.venue.address.join(", ");

export const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
export const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(address)}`;

const shareText = [
  `${event.title} · ${event.dancer}`,
  `${formatDate(event.startsAt)}, ${formatTime(event.startsAt)}`,
  `${event.venue.name}, ${event.venue.host}`,
  siteUrl,
].join("\n");

export const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
