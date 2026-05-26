import { CalendarCell } from "../../types/reservaciones";

type CalendarHeaderProps = {
  calendarCells: CalendarCell[];
};

export function formatCalendarRangeDate(date: Date) {
  return date.toLocaleDateString("es-MX", {
    month: "short",
    day: "numeric",
  });
}

export function CalendarHeader({ calendarCells }: CalendarHeaderProps) {
  const firstDate = calendarCells[0]?.date;
  const lastDate = calendarCells[calendarCells.length - 1]?.date;

  if (!firstDate || !lastDate) return null;

  return (
    <div className="mb-4 flex items-center justify-center">
      <p className="text-sm font-semibold text-slate-800">
        {formatCalendarRangeDate(firstDate)} -{" "}
        {formatCalendarRangeDate(lastDate)}
      </p>
    </div>
  );
}
