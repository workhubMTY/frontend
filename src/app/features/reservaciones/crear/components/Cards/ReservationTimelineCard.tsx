import { CalendarCheck, Lock } from "lucide-react";

import type { TimeBlock, TimelineEvent } from "../../types/reservaciones";
import { cn } from "../../../../../shared/lib/cn";
import { to24Hour } from "../../lib/time";
import { TimelineAxis } from "../Timeline/TimelineAxis";

function createTimelineLanes(ranges: TimelineRange[]): TimelineRange[][] {
  const sortedRanges = [...ranges].sort((a, b) => {
    if (a.startHour !== b.startHour) return a.startHour - b.startHour;
    return a.endHour - b.endHour;
  });

  const lanes: TimelineRange[][] = [];

  for (const range of sortedRanges) {
    const availableLane = lanes.find((lane) => {
      const lastRange = lane[lane.length - 1];

      if (!lastRange) return true;

      return lastRange.endHour <= range.startHour;
    });

    if (availableLane) {
      availableLane.push(range);
    } else {
      lanes.push([range]);
    }
  }

  return lanes;
}

function getLaneHeightClassName(laneCount: number): string {
  if (laneCount <= 1) return "min-h-[76px]";
  if (laneCount === 2) return "min-h-[92px]";
  if (laneCount === 3) return "min-h-[126px]";
  return "min-h-[160px]";
}

type ReservationTimelineCardProps = {
  activeDayId: string;
  proposedBlocks: TimeBlock[];
  spaceReservationsForActiveDay: TimelineEvent[];
  externalTimelineEventsForActiveDay: TimelineEvent[];
};

type TimelineRange = {
  id: string;
  startHour: number;
  endHour: number;
  label?: string;
  title?: string;
};

type OverlapSegment = {
  left: number;
  width: number;
};

export function ReservationTimelineCard({
  activeDayId,
  proposedBlocks,
  spaceReservationsForActiveDay,
  externalTimelineEventsForActiveDay,
}: ReservationTimelineCardProps) {
  const occupiedRanges = spaceReservationsForActiveDay
    .map(timelineEventToRange)
    .filter(Boolean) as TimelineRange[];

  const myReservationRanges = externalTimelineEventsForActiveDay
    .map(timelineEventToRange)
    .filter(Boolean) as TimelineRange[];

  return (
    <div className="overflow-x-auto flex flex-col gap-2">
      <div className="flex items-top justify-between  items-start">
        <h2 className="text-lg font-bold text-slate-950">
          Línea de tiempo
        </h2>
        <TimelineLegend />
      </div>
      <div className="min-w-[880px]">
        <div className="mb-3 overflow-hidden rounded-xl border border-slate-200">
          <OccupiedSpaceRow
            ranges={occupiedRanges}
            selectedBlocks={proposedBlocks}
            conflictRanges={[...occupiedRanges, ...myReservationRanges]}
          />

          <MyReservationsRow ranges={myReservationRanges} />
        </div>
        <TimelineAxis />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Espacio ocupado                                                             */
/* -------------------------------------------------------------------------- */
type OccupiedSpaceRowProps = {
  ranges: TimelineRange[];
  selectedBlocks: TimeBlock[];
  conflictRanges: TimelineRange[];
};

function OccupiedSpaceRow({
  ranges,
  selectedBlocks,
  conflictRanges,
}: OccupiedSpaceRowProps) {
  return (
    <TimelineRow
      icon={<Lock className="h-4 w-4" />}
      labelTop="Espacio"
      labelBottom="ocupado"
    >
      {ranges.length === 0 && selectedBlocks.length === 0 ? (
        <EmptyRowMessage>El espacio está libre en este día.</EmptyRowMessage>
      ) : null}

      {ranges.map((range) => (
        <ExistingRangeBlock key={range.id} range={range} variant="occupied" />
      ))}

      {selectedBlocks.slice(0, 3).map((block) => (
        <SelectedReservationBlock
          key={block.id}
          block={block}
          conflictRanges={conflictRanges}
        />
      ))}
    </TimelineRow>
  );
}

/* -------------------------------------------------------------------------- */
/* Tus reservaciones + selección                                               */
/* -------------------------------------------------------------------------- */

type MySelectionRowProps = {
  activeDayId: string;
  blocks: TimeBlock[];
  myReservationRanges: TimelineRange[];
  occupiedRanges: TimelineRange[];
};
type MyReservationsRowProps = {
  ranges: TimelineRange[];
};

function MyReservationsRow({ ranges }: MyReservationsRowProps) {
  const lanes = createTimelineLanes(ranges);

  return (
    <TimelineRow
      icon={<CalendarCheck className="h-4 w-4" />}
      labelTop="Tus"
      labelBottom="reservaciones"
      isLast
      heightClassName={getLaneHeightClassName(lanes.length)}
    >
      {ranges.length === 0 ? (
        <EmptyRowMessage>No tienes reservaciones en este día.</EmptyRowMessage>
      ) : null}

      {lanes.map((lane, laneIndex) =>
        lane.map((range) => (
          <ExistingRangeBlock
            key={range.id}
            range={range}
            variant="mine"
            laneIndex={laneIndex}
            laneCount={lanes.length}
          />
        )),
      )}
    </TimelineRow>
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

function ExistingRangeBlock({
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

  return (
    <div
      className={cn(
        "absolute z-20 flex items-center justify-center overflow-hidden rounded-md border px-3 shadow-sm",
        !isLaned && "top-1/2 h-9 -translate-y-1/2",
        variant === "occupied" &&
          "border-slate-300 bg-slate-200 text-slate-700",
        variant === "mine" && "border-slate-300 bg-slate-100 text-slate-600",
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
      }}
      title={range.title ?? range.label ?? "Reservación existente"}
    >
      <span className="truncate text-xs font-semibold">
        {range.label ?? "Reservado"}
      </span>
    </div>
  );
}
/* -------------------------------------------------------------------------- */
/* Nueva selección                                                             */
/* -------------------------------------------------------------------------- */

type SelectedReservationBlockProps = {
  block: TimeBlock;
  conflictRanges: TimelineRange[];
};

function SelectedReservationBlock({
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
      className="absolute inset-y-0 z-30 my-2 overflow-hidden border-y border-dashed border-violet-600 bg-violet-50/80 shadow-sm"
      style={{
        left: `${left}%`,
        width: `${width}%`,
      }}
      title={formatBlockLabel(block.start, block.end)}
    >
      <SelectionBoundaryLine side="left" />
      <SelectionBoundaryLine side="right" />

      {overlappingSegments.map((segment, index) => (
        <div
          key={index}
          className="absolute top-1/2 z-40 h-10 -translate-y-1/2 overflow-hidden rounded-md bg-[repeating-linear-gradient(135deg,#f97316_0px,#f97316_4px,transparent_4px,transparent_8px)]"
          style={{
            left: `${segment.left}%`,
            width: `${segment.width}%`,
          }}
          title="Empalme con una reservación existente"
        />
      ))}

      <div className="relative z-50 flex h-full items-center justify-center px-3">
        <span
          className={cn(
            "truncate text-xs font-semibold",
            hasConflict ? "text-slate-900" : "text-violet-700",
          )}
        >
          {formatBlockLabel(block.start, block.end)}
        </span>
      </div>
    </div>
  );
}

type SelectionBoundaryLineProps = {
  side: "left" | "right";
};

function SelectionBoundaryLine({ side }: SelectionBoundaryLineProps) {
  return (
    <div
      className={cn(
        "absolute inset-y-0 z-50 border-l-2 border-dashed border-violet-600",
        side === "left" ? "left-0" : "right-0",
      )}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Shared row                                                                  */
/* -------------------------------------------------------------------------- */
type TimelineRowProps = {
  icon: React.ReactNode;
  labelTop: string;
  labelBottom: string;
  children: React.ReactNode;
  isLast?: boolean;
  heightClassName?: string;
};

function TimelineRow({
  icon,
  labelTop,
  labelBottom,
  children,
  isLast = false,
  heightClassName = "min-h-[76px]",
}: TimelineRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[128px_minmax(0,1fr)]",
        !isLast && "border-b border-slate-200",
      )}
    >
      <div className="flex items-center gap-3 border-r border-slate-200 bg-white px-3 py-5">
        {icon}

        <p className="text-xs font-semibold leading-tight text-slate-800">
          {labelTop}
          <br />
          {labelBottom}
        </p>
      </div>

      <div className={cn("relative bg-white", heightClassName)}>
        <TimelineGrid />
        {children}
      </div>
    </div>
  );
}

function TimelineGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 grid grid-cols-12">
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={index}
          className="border-l border-dashed border-slate-200 first:border-l-0"
        />
      ))}
    </div>
  );
}

type EmptyRowMessageProps = {
  children: React.ReactNode;
};

function EmptyRowMessage({ children }: EmptyRowMessageProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center px-4">
      <span className="text-xs font-medium text-slate-400">{children}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Legend                                                                      */
/* -------------------------------------------------------------------------- */

function TimelineLegend() {
  return (
    <div className=" flex flex-wrap items-start gap-5 text-xs text-slate-600">
      <LegendItem
        markerClassName="border border-slate-300 bg-slate-100"
        label="Reservación existente"
      />

      <LegendItem
        markerClassName="border-y border-dashed border-violet-600 bg-violet-50"
        label="Nueva selección"
      />

      <LegendItem
        markerClassName="border border-orange-300 bg-[repeating-linear-gradient(135deg,#f97316_0px,#f97316_4px,transparent_4px,transparent_8px)]"
        label="Empalme"
      />
    </div>
  );
}

type LegendItemProps = {
  markerClassName: string;
  label: string;
};

function LegendItem({ markerClassName, label }: LegendItemProps) {
  return (
    <span className="flex items-center gap-2">
      <span className={cn("h-4 w-7 rounded", markerClassName)} />
      {label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Utils                                                                       */
/* -------------------------------------------------------------------------- */

function timelineEventToRange(event: TimelineEvent): TimelineRange | null {
  const startHour = getHourFromTimeLabel(event.start);
  const endHour = getHourFromTimeLabel(event.end);

  if (endHour <= startHour) return null;

  return {
    id: String(event.id),
    startHour,
    endHour,
    label: event.label,
    title: event.title,
  };
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
