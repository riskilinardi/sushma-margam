import { ButtonLink } from "@/components/ui/Button";
import { event } from "@/content/event";
import { formatDate, formatTime } from "@/lib/date";
import { googleMapsUrl, whatsappShareUrl } from "@/lib/links";
import { labelClass, PageHeading } from "./PageHeading";

export function EveningPage() {
  return (
    <div className="mx-auto max-w-md text-center">
      <PageHeading eyebrow="You are invited" title="The Evening" />

      <dl className="mt-6 space-y-5">
        <div>
          <dt className={labelClass}>When</dt>
          <dd className="mt-2 font-display text-base tracking-wide text-gold-200 uppercase">
            {formatDate(event.startsAt)}
          </dd>
          <dd className="mt-1 text-lg">
            {formatTime(event.startsAt)}
            <span className="text-ivory/70 italic">
              {" "}
              · seated by {event.arriveBy}
            </span>
          </dd>
        </div>
        <div>
          <dt className={labelClass}>Where</dt>
          <dd className="mt-2 text-xl">
            {event.venue.name}, {event.venue.host}
          </dd>
          <dd className="mt-1 text-ivory/70">
            {event.venue.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <div className="mt-7 flex flex-wrap justify-center gap-2.5">
        <ButtonLink href="/margam.ics" className="px-4">
          Calendar
        </ButtonLink>
        <ButtonLink
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4"
        >
          Directions
        </ButtonLink>
        <ButtonLink
          variant="solid"
          href={whatsappShareUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4"
        >
          Share
        </ButtonLink>
      </div>
    </div>
  );
}
