// Always show Singapore time, whatever time zone the guest's phone is set to.
const TIME_ZONE = "Asia/Singapore";

function format(date: Date, options: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString("en-GB", { ...options, timeZone: TIME_ZONE });
}

export function formatWeekday(date: Date) {
  return format(date, { weekday: "long" });
}

export function formatDay(date: Date) {
  return format(date, { day: "numeric", month: "long", year: "numeric" });
}

export function formatDate(date: Date) {
  return `${formatWeekday(date)}, ${formatDay(date)}`;
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}
