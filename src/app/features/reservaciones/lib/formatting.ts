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
