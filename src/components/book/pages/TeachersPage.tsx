import type { CSSProperties } from "react";
import { formerTeachers, guru, type Teacher } from "@/content/teachers";
import { event } from "@/content/event";
import { Page } from "./Page";
import { labelClass } from "./PageHeading";
import "./teachers.css";

// Guru parampara: the line of teachers, read from the past down to her. Once
// the page settles, a light is handed down it like a flame: her former
// teachers glow, it runs down the thread to her guru, then on to her, and
// her name stays warm (see teachers.css).
export function TeachersPage() {
  return (
    <Page eyebrow="Guru Parampara" title="Her Teachers" className="max-w-sm">
      <div data-settle>
        <p className={labelClass}>In gratitude to former teachers</p>
        <div className="parampara-glow" style={at(1.1)}>
          {formerTeachers.map((teacher) => (
            <p key={teacher.name} className="mt-2 text-xl">
              <TeacherName teacher={teacher} />
            </p>
          ))}
        </div>
      </div>

      <Thread from={1.5} />

      <div data-settle>
        <p className={labelClass}>Under the tutelage of</p>
        <p className="parampara-glow mt-2 text-3xl" style={at(2.4)}>
          <TeacherName teacher={guru} />
        </p>
      </div>

      <Thread from={2.9} />

      <p data-settle className="text-xl text-ivory/85 italic">
        <span className="parampara-heir" style={at(3.8)}>
          {event.dancer}
        </span>
      </p>
    </Page>
  );
}

// When, in seconds after the page settles, the light reaches this part.
function at(seconds: number) {
  return { "--at": `${seconds}s` } as CSSProperties;
}

function TeacherName({ teacher }: { teacher: Teacher }) {
  if (!teacher.link) return teacher.name;
  return (
    <a
      href={teacher.link}
      target="_blank"
      rel="noreferrer"
      className="underline decoration-gold-500/50 underline-offset-[6px] transition-colors hover:text-gold-200"
    >
      {teacher.name}
      <span aria-hidden="true" className="ml-1 text-[0.7em] text-gold-200">
        ↗
      </span>
    </a>
  );
}

function Thread({ from }: { from: number }) {
  return (
    <div
      aria-hidden="true"
      data-settle
      className="relative mx-auto my-4 flex flex-col items-center"
      style={at(from)}
    >
      <span className="parampara-line h-6 w-px bg-gold-500/40" />
      <span className="parampara-knot size-2 rotate-45 bg-gold-500" />
      <span
        className="parampara-line h-6 w-px bg-gold-500/40"
        style={{ "--after": "0.5s" } as CSSProperties}
      />
      <span className="parampara-spark" />
    </div>
  );
}
