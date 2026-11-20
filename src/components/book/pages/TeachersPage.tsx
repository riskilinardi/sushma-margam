import { formerTeachers, guru, type Teacher } from "@/content/teachers";
import { event } from "@/content/event";
import { Page } from "./Page";
import { labelClass } from "./PageHeading";

// Guru parampara: the line of teachers, read from the past down to her.
export function TeachersPage() {
  return (
    <Page eyebrow="Guru Parampara" title="Her Teachers" className="max-w-sm">
      <div data-settle>
        <p className={labelClass}>In gratitude to former teachers</p>
        {formerTeachers.map((teacher) => (
          <p key={teacher.name} className="mt-2 text-xl">
            <TeacherName teacher={teacher} />
          </p>
        ))}
      </div>

      <Thread />

      <div data-settle>
        <p className={labelClass}>Under the tutelage of</p>
        <p className="mt-2 text-3xl">
          <TeacherName teacher={guru} />
        </p>
      </div>

      <Thread />

      <p data-settle className="text-xl text-ivory/85 italic">
        {event.dancer}
      </p>
    </Page>
  );
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

function Thread() {
  return (
    <div
      aria-hidden="true"
      data-settle
      className="mx-auto my-4 flex flex-col items-center"
    >
      <span className="h-6 w-px bg-gold-500/40" />
      <span className="size-2 rotate-45 bg-gold-500" />
      <span className="h-6 w-px bg-gold-500/40" />
    </div>
  );
}
