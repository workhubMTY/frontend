import { DAYS_TO_SHOW } from "../constants/reservaciones";
import type { CalendarCell } from "../types/reservaciones";

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function dateToId(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function createCalendarCells(): CalendarCell[] {
  const today = startOfDay(new Date());
  const startMonth = today.getMonth();

  return Array.from({ length: DAYS_TO_SHOW }, (_, index) => {
    const date = addDays(today, index);
    const previousDate = index > 0 ? addDays(today, index - 1) : null;
    const isMonthBoundary = previousDate
      ? previousDate.getMonth() !== date.getMonth()
      : true;

    return {
      id: dateToId(date),
      date,
      dayNumber: date.getDate(),
      shortLabel: date
        .toLocaleDateString("es-MX", { weekday: "short", day: "numeric" })
        .replace(".", ""),
      monthShort: date
        .toLocaleDateString("es-MX", { month: "short" })
        .replace(".", ""),
      isStartMonth: date.getMonth() === startMonth,
      isMonthBoundary,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    };
  });
}

export function getFirstAvailableDateId(calendarCells: CalendarCell[]) {
  return (
    calendarCells.find((cell) => !cell.isWeekend)?.id ??
    calendarCells[0]?.id ??
    dateToId(new Date())
  );
}

export function getRangeIds(
  startId: string,
  endId: string,
  calendarCells: CalendarCell[],
) {
  const startIndex = calendarCells.findIndex((cell) => cell.id === startId);
  const endIndex = calendarCells.findIndex((cell) => cell.id === endId);

  if (startIndex === -1 || endIndex === -1) return [];

  const min = Math.min(startIndex, endIndex);
  const max = Math.max(startIndex, endIndex);

  return calendarCells
    .slice(min, max + 1)
    .filter((cell) => !cell.isWeekend)
    .map((cell) => cell.id);
}
