import { Placeholder } from "@/components/ui/Placeholder";
import { event } from "@/content/event";
import { labelClass, PageHeading } from "./PageHeading";

export function TeachersPage() {
  return (
    <div className="mx-auto max-w-md text-center">
      <PageHeading eyebrow="Guru Parampara" title="Her Teachers" />

      <figure data-settle className="mt-6">
        <Placeholder
          label="Photo"
          className="mx-auto aspect-square h-[20cqh] rounded-full"
        />
        <figcaption className="mt-3">
          <p className={labelClass}>Under the tutelage of</p>
          <p className="mt-1 text-2xl">{event.guru}</p>
        </figcaption>
      </figure>

      <p data-settle className={`mt-7 ${labelClass}`}>
        In gratitude to former teachers
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-4">
        {event.formerTeachers.map((name) => (
          <li key={name} data-settle>
            <Placeholder
              label="Photo"
              className="mx-auto aspect-square h-[13cqh] rounded-full"
            />
            <p className="mt-2 text-lg">{name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
