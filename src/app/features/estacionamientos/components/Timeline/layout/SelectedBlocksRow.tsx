import type { TimeBlock } from "@/app/features/reservaciones/types/reservaciones";
import { TimelineGrid } from "./TimelineGrid";
import type { ConflictRange } from "../types";
import { formatBlockLabel, getHourFromTimeLabel } from "../utils";

type SelectedBlocksRowProps = {
  blocks: TimeBlock[];
  myReservationRanges: ConflictRange[];
};

export function SelectedBlocksRow({
  blocks,
  myReservationRanges,
}: SelectedBlocksRowProps) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)]">
      <div className="flex items-center border-r border-slate-200 bg-white px-3 text-sm font-semibold leading-5 text-slate-800">
        Tus
        <br />
        reservaciones
      </div>

      <div className="relative h-[76px] bg-white">
        <TimelineGrid />

        <ExistingMyReservationRanges ranges={myReservationRanges} />

        {blocks.map((block) => (
          <SelectedParkingBlock
            key={block.id}
            block={block}
            myReservationRanges={myReservationRanges}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reservaciones que YA tenía                                                 */
/* -------------------------------------------------------------------------- */

type ExistingMyReservationRangesProps = {
  ranges: ConflictRange[];
};

function ExistingMyReservationRanges({
  ranges,
}: ExistingMyReservationRangesProps) {
  return (
    <>
      {ranges.map((range, index) => (
        <ExistingMyReservationRange
          key={`${range.startHour}-${range.endHour}-${index}`}
          range={range}
        />
      ))}
    </>
  );
}

type ExistingMyReservationRangeProps = {
  range: ConflictRange;
};

function ExistingMyReservationRange({ range }: ExistingMyReservationRangeProps) {
  const duration = range.endHour - range.startHour;

  if (duration <= 0) return null;

  const left = (range.startHour / 24) * 100;
  const width = (duration / 24) * 100;

  return (
    <div
      className="absolute top-1/2 z-20 h-10 -translate-y-1/2 overflow-hidden bg-slate-200 border border-grid-lines"
      style={{
        left: `${left}%`,
        width: `${width}%`,
      }}
      title="Ya tienes una reservación en este horario"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Selección nueva                                                            */
/* -------------------------------------------------------------------------- */

type SelectedParkingBlockProps = {
  block: TimeBlock;
  myReservationRanges: ConflictRange[];
};

function SelectedParkingBlock({
  block,
  myReservationRanges,
}: SelectedParkingBlockProps) {
  const startHour = getHourFromTimeLabel(block.start);
  const endHour = getHourFromTimeLabel(block.end);

  const duration = endHour - startHour;
  if (duration <= 0) return null;

  const left = (startHour / 24) * 100;
  const width = (duration / 24) * 100;

  const overlappingSegments = myReservationRanges
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
    .filter(Boolean) as Array<{ left: number; width: number }>;

  return (
    <div
      className="absolute inset-y-0 z-30 bg-purple-50/80"
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
          title="Empalme con una reservación tuya"
        />
      ))}

      <div className="relative z-50 flex h-full items-center justify-center px-3">
        <span className="truncate text-sm font-semibold text-slate-800">
          {/* {formatBlockLabel(block.start, block.end)} */}
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
      className={[
        "absolute inset-y-0 z-30 border-l-2 border-dashed border-primary-2",
        side === "left" ? "left-0" : "right-0",
      ].join(" ")}
    />
  );
}