import { CalendarCheck, Lock } from "lucide-react";

import type { TimeBlock } from "../../types/reservaciones";
import type { ScheduleItem } from "../../types/schedule";

import { cn } from "../../../../../shared/lib/cn";
import { to24Hour } from "../../lib/time";
import { TimelineAxis } from "./TimelineAxis";
import { ExistingRangeBlock } from "./ExistingRangeBlock";
import { SelectedReservationBlock } from "./SelectedReservationBlock";

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
  proposedBlocks: TimeBlock[];

  /**
   * Reservaciones del espacio actual.
   * Estas son las únicas bloqueantes.
   */
  spaceItems: ScheduleItem[];

  /**
   * Agenda del usuario.
   * Es informativa y puede repetir elementos que también estén en spaceItems.
   */
  myItems: ScheduleItem[];
};
export type TimelineRange = {
  id: string;
  startHour: number;
  endHour: number;
  label?: string;
  title?: string;
  sourceLabel?: string;
  itemTitle?: string;
  kind:string;
  location?: string | null;
};

type OverlapSegment = {
  left: number;
  width: number;
};

export function ReservationTimelineCard({
  proposedBlocks,
  spaceItems,
  myItems,
}: ReservationTimelineCardProps) {
  const occupiedRanges = spaceItems
    .map(scheduleItemToRange)
    .filter(Boolean) as TimelineRange[];

  const myReservationRanges = myItems
    .map(scheduleItemToRange)
    .filter(Boolean) as TimelineRange[];

  return (
    <div className="flex flex-col gap-2 overflow-x-auto">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-bold text-slate-950">Línea de tiempo</h2>
        <TimelineLegend />
      </div>

      <div className="min-w-[880px]">
        <div className="mb-3 overflow-hidden rounded-xl border border-slate-200">
          <OccupiedSpaceRow
            ranges={occupiedRanges}
            selectedBlocks={proposedBlocks}
            conflictRanges={occupiedRanges}
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

  /**
   * Ranges contra los que la selección sí marca empalme.
   * Deben ser solamente del espacio actual.
   */
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
      labelBottom="actual"
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
/* Tus horarios                                                                */
/* -------------------------------------------------------------------------- */

type MyReservationsRowProps = {
  ranges: TimelineRange[];
};

function MyReservationsRow({ ranges }: MyReservationsRowProps) {
  const lanes = createTimelineLanes(ranges);

  return (
    <TimelineRow
      icon={<CalendarCheck className="h-4 w-4" />}
      labelTop="Tus"
      labelBottom="horarios"
      isLast
      heightClassName={getLaneHeightClassName(lanes.length)}
    >
      {ranges.length === 0 ? (
        <EmptyRowMessage>No tienes horarios en este día.</EmptyRowMessage>
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
  heightClassName = "min-h-[70px]",
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
    <div className="flex flex-wrap items-start gap-5 text-xs text-slate-600">
      {/* <LegendItem
        markerClassName="border border-slate-300 bg-slate-200"
        label="Espacio ocupado"
      /> */}

      <LegendItem
        markerClassName="border border-slate-300 bg-slate-100"
        label="Tus horarios"
      />

      <LegendItem
        markerClassName="border-y border-dashed border-violet-600 bg-violet-50"
        label="Nueva selección"
      />

      <LegendItem
        markerClassName="border border-orange-300 bg-[repeating-linear-gradient(135deg,#f97316_0px,#f97316_4px,transparent_4px,transparent_8px)]"
        label="Empalme con espacio"
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

function scheduleItemToRange(item: ScheduleItem): TimelineRange | null {
  const startHour = getHourFromTimeLabel(item.start);
  const endHour = getHourFromTimeLabel(item.end);

  if (endHour <= startHour) return null;

  return {
  id: item.id,
  startHour,
  endHour,
  label: `${item.start} - ${item.end}`,
  title: item.location
    ? `${item.sourceLabel} · ${item.title} · ${item.location}`
    : `${item.sourceLabel} · ${item.title}`,
  sourceLabel: item.sourceLabel,
  kind: item.kind, 
  itemTitle: item.title,
  location: item.location,
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