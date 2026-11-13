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
  className?: string;
};

export function Countdown({ to, className = "" }: CountdownProps) {
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
  const units = [
    { word: "Day", value: left?.days },
    { word: "Hour", value: left?.hours },
    { word: "Minute", value: left?.minutes },
  ];

  return (
    <div
      role="timer"
      aria-label={
        left
          ? `${left.days} days, ${left.hours} hours and ${left.minutes} minutes to go`
          : undefined
      }
      className={`flex justify-center divide-x divide-gold-500/30 lg:justify-start ${className}`}
    >
      {units.map(({ word, value }) => (
        <div
          key={word}
          aria-hidden="true"
          className="px-5 text-center sm:px-7 lg:first:pl-0"
        >
          <span className="block text-gilded font-display text-3xl sm:text-4xl lg:text-5xl">
            {value === undefined ? "–" : String(value).padStart(2, "0")}
          </span>
          <span className="mt-2 block font-display text-[0.65rem] tracking-[0.3em] text-ivory/75 uppercase">
            {value === 1 ? word : `${word}s`}
          </span>
        </div>
      ))}
    </div>
  );
}
