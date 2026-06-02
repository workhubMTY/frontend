import { addDays, dateToId } from "./dates";

export function uniqueSortedIds(ids: string[]) {
  return Array.from(new Set(ids)).sort((a, b) => a.localeCompare(b));
}

export function formatShortDateById(id: string) {
  const [year, month, day] = id.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date
    .toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    .replaceAll(".", "");
}

export function formatDateRanges(ids: string[]) {
  const sortedIds = uniqueSortedIds(ids);

  if (sortedIds.length === 0) return "Sin días seleccionados";

  const ranges: Array<{ start: string; end: string }> = [];
  let start = sortedIds[0];
  let end = sortedIds[0];

  for (let index = 1; index < sortedIds.length; index += 1) {
    const currentId = sortedIds[index];
    const previousDate = new Date(`${end}T00:00:00`);
    const expectedNextId = dateToId(addDays(previousDate, 1));

    if (currentId === expectedNextId) {
      end = currentId;
    } else {
      ranges.push({ start, end });
      start = currentId;
      end = currentId;
    }
  }

  ranges.push({ start, end });

  return ranges
    .map((range) => {
      if (range.start === range.end) return formatShortDateById(range.start);
      return `${formatShortDateById(range.start)} - ${formatShortDateById(range.end)}`;
    })
    .join(", ");
}

export function normalizeTimeInput(value: string): string | null {
  const trimmed = value.trim().toLowerCase();

  const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);

  if (!match) return null;

  const [, hourText, minuteText = "00", period] = match;

  let hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  if (minute < 0 || minute > 59) return null;

  if (period) {
    if (hour < 1 || hour > 12) return null;

    if (period === "am") {
      hour = hour === 12 ? 0 : hour;
    }

    if (period === "pm") {
      hour = hour === 12 ? 12 : hour + 12;
    }
  } else {
    if (hour < 0 || hour > 23) return null;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}