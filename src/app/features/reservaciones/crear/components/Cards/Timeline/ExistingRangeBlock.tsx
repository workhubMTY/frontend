import { cn } from "@/app/shared/lib/cn";
import { TimelineRange } from "./ReservationTimelineCard";

type TimelineKind = "parking_reservation" | "my_reservation" | "calendar_event";

type TimelineKindStyle = {
  label: string;
  blockClassName: string;
  textClassName: string;
};

const timelineKindStyles: Record<TimelineKind, TimelineKindStyle> = {
  parking_reservation: {
    label: "Espacio ocupado",
    blockClassName:
      "border-slate-300 bg-red-500 border-l-blue-500 text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.08)]",
    textClassName: "text-slate-700",
  },

  my_reservation: {
    label: "Mi reservación",
    blockClassName:
      "border-slate-300 border-l-primary-2 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.06)]",
    textClassName: "text-slate-600",
  },

  calendar_event: {
    label: "Evento de calendario",
    blockClassName:
      "border-sky-100 text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
    textClassName: "text-slate-600",
  },
};

const fallbackKindStyle: TimelineKindStyle = {
  label: "Horario",
  blockClassName:
    "border-slate-200 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
  textClassName: "text-slate-600",
};

function getTimelineKindStyle(kind: string): TimelineKindStyle {
  return timelineKindStyles[kind as TimelineKind] ?? fallbackKindStyle;
}

type TimelineRangeBlockContentProps = {
  range: TimelineRange;
};

function TimelineRangeBlockContent({ range }: TimelineRangeBlockContentProps) {
  const kindStyle = getTimelineKindStyle(range.kind);

  return (
    <div className="min-w-0">
      <p
        className={cn(
          "truncate text-[11px] font-semibold leading-tight tracking-[-0.01em]",
          kindStyle.textClassName,
        )}
      >
        {range.itemTitle ?? kindStyle.label}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Bloques existentes                                                          */
/* -------------------------------------------------------------------------- */

type ExistingRangeBlockProps = {
  range: TimelineRange;
  variant: "occupied" | "mine";
  laneIndex?: number;
  laneCount?: number;
};

export function ExistingRangeBlock({
  range,
  variant,
  laneIndex,
  laneCount,
}: ExistingRangeBlockProps) {
  const duration = range.endHour - range.startHour;
  if (duration <= 0) return null;

  const left = (range.startHour / 24) * 100;
  const width = (duration / 24) * 100;

  const isLaned = laneIndex !== undefined && laneCount !== undefined;
  const kindStyle = getTimelineKindStyle(range.kind);

  return (
    <div
      className={cn(
        "bg-slate-100 absolute z-20 flex items-center overflow-hidden rounded-[6px] border px-2",
        "transition-[box-shadow,background-color,border-color] duration-150",
        "hover:shadow-[0_2px_6px_rgba(15,23,42,0.10)]",

        !isLaned && "top-1/2 h-9 -translate-y-1/2",
        isLaned && "h-7",

        kindStyle.blockClassName,

        variant === "occupied" && "ring-1 ring-inset ring-slate-900/[0.03]",
        variant === "mine" && "border-dashed border-l-10",
      )}
      style={{
        left: `${left}%`,
        width: `${width}%`,
        ...(isLaned
          ? {
              top: `${8 + laneIndex * 34}px`,
              height: "28px",
            }
          : {}),
          borderLeftStyle: "solid", 
      }}
      title={range.title ?? range.label ?? kindStyle.label}
    >
      <TimelineRangeBlockContent range={range} />
    </div>
  );
}