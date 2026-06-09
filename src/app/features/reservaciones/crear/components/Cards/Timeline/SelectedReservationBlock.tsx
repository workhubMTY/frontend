import type { TimeBlock } from "@/app/features/reservaciones/crear/types/reservaciones";
import type { TimelineRange } from "./ReservationTimelineCard";

import { cn } from "@/app/shared/lib/cn";
import { to24Hour } from "@/app/features/reservaciones/crear/lib/time";

type SelectedReservationBlockProps = {
  block: TimeBlock;
  conflictRanges: TimelineRange[];
};

type OverlapSegment = {
  left: number;
  width: number;
};

export function SelectedReservationBlock({
  block,
  conflictRanges,
}: SelectedReservationBlockProps) {
  const startHour = getHourFromTimeLabel(block.start);
  const endHour = getHourFromTimeLabel(block.end);

  const duration = endHour - startHour;
  if (duration <= 0) return null;

  const left = (startHour / 24) * 100;
  const width = (duration / 24) * 100;

  const overlappingSegments = getOverlappingSegments({
    startHour,
    endHour,
    ranges: conflictRanges,
  });

  const hasConflict = overlappingSegments.length > 0;

  return (
    <div
      className={cn(
        "absolute inset-y-0 z-30 my-2 overflow-hidden rounded-[7px]",
        "border border-violet-200 bg-violet-50/60 shadow-[0_1px_3px_rgba(79,70,229,0.10)]",
        hasConflict && "border-orange-200 bg-orange-50/40",
      )}
      style={{
        left: `${left}%`,
        width: `${width}%`,
      }}
      title={formatBlockLabel(block.start, block.end)}
    >
      <SelectionBoundaryLine side="left" hasConflict={hasConflict} />
      <SelectionBoundaryLine side="right" hasConflict={hasConflict} />

      {overlappingSegments.map((segment, index) => (
        <div
          key={index}
          className="absolute top-1/2 z-40 h-9 -translate-y-1/2 overflow-hidden rounded-[6px] border border-orange-200 bg-[repeating-linear-gradient(135deg,rgba(249,115,22,0.42)_0px,rgba(249,115,22,0.42)_4px,transparent_4px,transparent_8px)]"
          style={{
            left: `${segment.left}%`,
            width: `${segment.width}%`,
          }}
          title="Empalme con una reservación del espacio"
        />
      ))}

      <div className="relative z-50 flex h-full items-center justify-center px-3">
        <span
          className={cn(
            "truncate text-[11px] font-semibold tracking-[-0.01em]",
            hasConflict ? "text-orange-800" : "text-violet-700",
          )}
        >
          {/* {formatBlockLabel(block.start, block.end)} */}
        </span>
      </div>
    </div>
  );
}

type SelectionBoundaryLineProps = {
  side: "left" | "right";
  hasConflict?: boolean;
};

function SelectionBoundaryLine({
  side,
  hasConflict = false,
}: SelectionBoundaryLineProps) {
  return (
    <div
      className={cn(
        "absolute inset-y-1 z-50 border-l-2 border-dashed",
        side === "left" ? "left-0" : "right-0",
        hasConflict ? "border-orange-500" : "border-violet-500",
      )}
    />
  );
}

function getOverlappingSegments({
  startHour,
  endHour,
  ranges,
}: {
  startHour: number;
  endHour: number;
  ranges: TimelineRange[];
}): OverlapSegment[] {
  const duration = endHour - startHour;

  if (duration <= 0) return [];

  return ranges
    .map((range) => {
      const hasOverlap = startHour < range.endHour && endHour > range.startHour;

      if (!hasOverlap) return null;

      const overlapStart = Math.max(range.startHour, startHour);
      const overlapEnd = Math.min(range.endHour, endHour);

      return {
        left: ((overlapStart - startHour) / duration) * 100,
        width: ((overlapEnd - overlapStart) / duration) * 100,
      };
    })
    .filter(Boolean) as OverlapSegment[];
}

function getHourFromTimeLabel(value: string): number {
  const normalized =
    value.includes("AM") || value.includes("PM") ? to24Hour(value) : value;

  const [rawHours = "0", rawMinutes = "0"] = normalized.split(":");

  const hours = Number(rawHours);
  const minutes = Number(rawMinutes);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;

  return hours + minutes / 60;
}

function formatBlockLabel(start: string, end: string): string {
  return `${cleanTimeLabel(start)} - ${cleanTimeLabel(end)}`;
}

function cleanTimeLabel(value: string): string {
  return value.replace(" AM", "").replace(" PM", "");
}