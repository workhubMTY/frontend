import { cn } from "@/app/features/reservaciones/lib/cn";
import { CalendarCell } from "@/app/features/reservaciones/types/reservaciones";

type CalendarDayButtonProps = {
  cell: CalendarCell;
  variant: "default" | "compact";
  isActive: boolean;
  isSelected: boolean;
  hasConflict: boolean;
  isPreview: boolean;
  onPointerDown: (dayId: string) => void;
  onPointerEnter: (dayId: string) => void;
};

function formatCalendarDayTitle(date: Date) {
  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

type GetCalendarDayClassNameParams = {
  cell: CalendarCell;
  variant: "default" | "compact";
  isActive: boolean;
  isSelected: boolean;
  hasConflict: boolean;
  isPreview: boolean;
};

function getCalendarDayClassName({
  cell,
  variant,
  isActive,
  isSelected,
  hasConflict,
  isPreview,
}: GetCalendarDayClassNameParams) {
  const isConflictAndSelected = hasConflict && isSelected;

  return cn(
    "relative mx-auto flex flex-col items-center justify-center rounded-md text-xs font-medium transition",
    variant === "compact" ? "h-8 w-8" : "h-10 w-10",

    cell.isWeekend &&
      "cursor-not-allowed border border-slate-200 bg-slate-200 text-slate-400 opacity-70 shadow-inner",

    !cell.isWeekend &&
      cell.isMonthBoundary &&
      !cell.isStartMonth &&
      "border-l-4 border-slate-300",

    !cell.isWeekend &&
      !isSelected &&
      !hasConflict &&
      !isPreview &&
      "hover:bg-slate-100",

    !cell.isWeekend &&
      isSelected &&
      !hasConflict &&
      "border border-violet-200 bg-violet-50 text-violet-700",

    // !cell.isWeekend &&
    //   isSelected &&
    //   !hasConflict &&
    //   "bg-violet-600 text-white shadow-sm",

    // !cell.isWeekend &&
    //   isSelected &&
    //   !hasConflict &&
    //   "border-2 border-violet-950 bg-violet-600 text-white shadow-sm ring-4 ring-violet-100",

    !cell.isWeekend &&
      hasConflict &&
      !isConflictAndSelected &&
      "bg-red-500 text-white shadow-sm ring-2 ring-red-100",

    !cell.isWeekend &&
      isConflictAndSelected &&
      "border-2 border-red-950 bg-red-500 text-white shadow-sm ring-4 ring-red-100",

    !cell.isWeekend &&
      isPreview &&
      !hasConflict &&
      "border-2 border-violet-600 bg-violet-50 text-violet-700",

    !cell.isWeekend &&
      isPreview &&
      (isSelected || hasConflict) &&
      "ring-4 ring-violet-100",

    !cell.isWeekend &&
      isActive &&
      !isPreview &&
      "outline outline-2 outline-offset-2 outline-violet-300",
  );
}

export function CalendarDayButton({
  cell,
  variant,
  isActive,
  isSelected,
  hasConflict,
  isPreview,
  onPointerDown,
  onPointerEnter,
}: CalendarDayButtonProps) {
  return (
    <button
      type="button"
      disabled={cell.isWeekend}
      onPointerDown={() => onPointerDown(cell.id)}
      onPointerEnter={() => onPointerEnter(cell.id)}
      title={formatCalendarDayTitle(cell.date)}
      className={getCalendarDayClassName({
        cell,
        variant,
        isActive,
        isSelected,
        hasConflict,
        isPreview,
      })}
    >
      <span>{cell.dayNumber}</span>
    </button>
  );
}
