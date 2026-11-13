import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { event } from "@/content/event";
import { googleCalendarUrl } from "@/lib/calendar";
import { formatDate, formatTime } from "@/lib/date";
import { appleMapsUrl, googleMapsUrl, whatsappShareUrl } from "@/lib/links";

const date = formatDate(event.startsAt);
const time = formatTime(event.startsAt);

export function Invitation() {
  return (
    <Section id="invitation" eyebrow="You are invited" title="The Evening">
      <div className="grid gap-6 md:grid-cols-2">
        <Card label="When">
          <p className="font-display text-lg tracking-wide text-balance text-gold-200 uppercase sm:text-xl">
            {date}
          </p>
          <p className="mt-2 text-2xl">{time}</p>
          <p className="mt-1 text-ivory/70 italic">
            Please be seated by {event.arriveBy}
          </p>
          <Actions>
            <ButtonLink
              href={googleCalendarUrl()}
              target="_blank"
              rel="noreferrer"
            >
              Google Calendar
            </ButtonLink>
            <ButtonLink href="/margam.ics">Apple / Outlook</ButtonLink>
          </Actions>
        </Card>

        <Card label="Where">
          <p className="text-2xl">{event.venue.name}</p>
          <p className="mt-1 text-ivory/85">{event.venue.host}</p>
          <address className="mt-3 text-ivory/70 not-italic">
            {event.venue.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <Actions>
            <ButtonLink href={googleMapsUrl} target="_blank" rel="noreferrer">
              Google Maps
            </ButtonLink>
            <ButtonLink href={appleMapsUrl} target="_blank" rel="noreferrer">
              Apple Maps
            </ButtonLink>
          </Actions>
        </Card>
      </div>

      <div className="mt-10 flex justify-center">
        <ButtonLink
          variant="solid"
          href={whatsappShareUrl}
          target="_blank"
          rel="noreferrer"
        >
          Share on WhatsApp
        </ButtonLink>
      </div>
    </Section>
  );
}

function Card({ label, children }: { label: string; children: ReactNode }) {
  return (
    <article className="flex flex-col items-center border border-gold-500/30 bg-maroon-900/60 p-8 text-center outline -outline-offset-8 outline-gold-500/10 sm:p-10">
      <h3 className="mb-4 font-display text-[0.7rem] tracking-[0.35em] text-gold-500 uppercase">
        {label}
      </h3>
      {children}
    </article>
  );
}

function Actions({ children }: { children: ReactNode }) {
  return (
    <div className="mt-auto flex flex-wrap justify-center gap-3 pt-6">
      {children}
    </div>
  );
}
