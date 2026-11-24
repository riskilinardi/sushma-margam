"use client";

import { useSyncExternalStore } from "react";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 1000);
  return () => clearInterval(timer);
}

// Rounded down to the minute so React sees the same value until it changes.
function getMinute() {
  return Math.floor(Date.now() / MINUTE) * MINUTE;
}

function getServerMinute() {
  return null;
}

function split(ms: number) {
  return {
    days: Math.floor(ms / DAY),
    hours: Math.floor((ms % DAY) / HOUR),
    minutes: Math.floor((ms % HOUR) / MINUTE),
  };
}

const labelClass =
  "font-display text-[0.55rem] tracking-[0.35em] text-gold-200/85 uppercase lg:text-[0.6rem]";

type CountdownProps = {
  to: Date;
  // Shown above the digits while counting down.
  label?: string;
  className?: string;
};

export function Countdown({ to, label, className = "" }: CountdownProps) {
  const now = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  const remaining = now === null ? null : to.getTime() - now;

  // From the moment the curtain rises, and for good after, the same place
  // gives thanks instead.
  if (remaining !== null && remaining <= 0) {
    return (
      <div className={className}>
        <p className={labelClass}>With gratitude</p>
        <p className="mt-1 text-xl text-ivory/85 italic lg:text-2xl">
          Thank you for celebrating with us
        </p>
      </div>
    );
  }

  const left = remaining === null ? null : split(remaining);
  // Leading zeros are noise: on the day itself show hours and minutes, and
  // in the last hour only the minutes.
  const units = [
    { word: "day", value: left?.days },
    { word: "hour", value: left?.hours },
    { word: "minute", value: left?.minutes },
  ];
  const first = units.findIndex(
    ({ word, value }) => value !== 0 || word === "minute",
  );

  // Set as a line of text rather than a row of boxes, so it reads as part
  // of the invitation: 14 days · 20 hours · 6 minutes.
  return (
    <div className={className}>
      {label && <p className={labelClass}>{label}</p>}
      <p
        role="timer"
        aria-label={
          left
            ? `${left.days} days, ${left.hours} hours and ${left.minutes} minutes to go`
            : undefined
        }
        className="mt-0.5 text-lg text-ivory/80 italic lg:text-xl"
      >
        {units.slice(first).map(({ word, value }, i) => (
          <span key={word} aria-hidden="true">
            {i > 0 && <span className="mx-2 text-gold-500 not-italic">·</span>}
            <span className="text-gilded font-display text-[min(1.6rem,5.5cqh)] not-italic lg:text-3xl">
              {value ?? "–"}
            </span>{" "}
            {value === 1 ? word : `${word}s`}
          </span>
        ))}
      </p>
    </div>
  );
}
