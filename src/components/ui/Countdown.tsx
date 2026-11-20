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

type CountdownProps = {
  to: Date;
  // Shown above the digits while counting down.
  label?: string;
  className?: string;
};

export function Countdown({ to, label, className = "" }: CountdownProps) {
  const now = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  const remaining = now === null ? null : to.getTime() - now;

  if (remaining !== null && remaining <= 0) {
    return (
      <p className={`text-xl text-ivory/80 italic ${className}`}>
        Thank you for celebrating with us.
      </p>
    );
  }

  const left = remaining === null ? null : split(remaining);
  // On the day itself, "00 days" is noise: show hours and minutes only.
  const units = [
    { word: "Day", value: left?.days },
    { word: "Hour", value: left?.hours },
    { word: "Minute", value: left?.minutes },
  ].filter(({ word, value }) => !(word === "Day" && value === 0));

  return (
    <div className={className}>
      {label && (
        <p className="mb-1.5 font-display text-[0.55rem] tracking-[0.35em] text-gold-200/85 uppercase lg:text-[0.6rem]">
          {label}
        </p>
      )}
      <div
        role="timer"
        aria-label={
          left
            ? `${left.days} days, ${left.hours} hours and ${left.minutes} minutes to go`
            : undefined
        }
        className="flex divide-x divide-gold-500/30"
      >
        {units.map(({ word, value }) => (
          <div
            key={word}
            aria-hidden="true"
            className="px-4 text-center first:pl-0 last:pr-0 sm:px-6"
          >
            <span className="block text-gilded font-display text-[min(1.65rem,5.5cqh)] leading-tight lg:text-4xl">
              {value === undefined ? "–" : String(value).padStart(2, "0")}
            </span>
            <span className="mt-1 block font-display text-[0.6rem] tracking-[0.3em] text-ivory/75 uppercase">
              {value === 1 ? word : `${word}s`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
