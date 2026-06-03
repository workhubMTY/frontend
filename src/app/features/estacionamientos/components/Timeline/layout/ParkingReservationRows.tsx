import type { TimeBlock } from "@/app/features/reservaciones/types/reservaciones";
import { TimelineGrid } from "./TimelineGrid";
import type { ConflictRange } from "../types";
import { formatBlockLabel, getHourFromTimeLabel } from "../utils";

type ParkingReservationRowsProps = {
  existingRanges: ConflictRange[];
  selectedBlocks: TimeBlock[];
};

export function ParkingReservationRows({
  existingRanges,
  selectedBlocks,
}: ParkingReservationRowsProps) {
  return (
    <>
      <ExistingReservationsRow ranges={existingRanges} />

      <NewSelectionRow
        blocks={selectedBlocks}
        existingRanges={existingRanges}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Existing reservations                                                       */
/* -------------------------------------------------------------------------- */

type ExistingReservationsRowProps = {
  ranges: ConflictRange[];
};

function ExistingReservationsRow({ ranges }: ExistingReservationsRowProps) {
  return (
    <TimelineRow labelTop="Tus" labelBottom="reservaciones">
      {ranges.length === 0 ? (
        <EmptyRowMessage>
          No tienes reservaciones en este día.
        </EmptyRowMessage>
      ) : null}

      {ranges.map((range, index) => (
        <ExistingReservationBlock
          key={`${range.startHour}-${range.endHour}-${index}`}
          range={range}
        />
      ))}
    </TimelineRow>
  );
}

type ExistingReservationBlockProps = {
  range: ConflictRange;
};

function ExistingReservationBlock({ range }: ExistingReservationBlockProps) {
  const duration = range.endHour - range.startHour;
  if (duration <= 0) return null;

  const left = (range.startHour / 24) * 100;
  const width = (duration / 24) * 100;

  return (
    <div
      className="absolute top-1/2 z-20 flex h-9 -translate-y-1/2 items-center justify-center overflow-hidden rounded-md border border-slate-300 bg-slate-200 px-3 shadow-sm"
      style={{
        left: `${left}%`,
        width: `${width}%`,
      }}
      title="Reservación existente"
    >
      <span className="truncate text-xs font-semibold text-slate-700">
        Reservado
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* New selection                                                               */
/* -------------------------------------------------------------------------- */

type NewSelectionRowProps = {
  blocks: TimeBlock[];
  existingRanges: ConflictRange[];
};

function NewSelectionRow({ blocks, existingRanges }: NewSelectionRowProps) {
  return (
    <TimelineRow labelTop="Nueva" labelBottom="selección" isLast>
      {blocks.length === 0 ? (
        <EmptyRowMessage>
          Selecciona un horario para previsualizarlo aquí.
        </EmptyRowMessage>
      ) : null}

      {blocks.map((block) => (
        <NewSelectionBlock
          key={block.id}
          block={block}
          existingRanges={existingRanges}
        />
      ))}
    </TimelineRow>
  );
}

type NewSelectionBlockProps = {
  block: TimeBlock;
  existingRanges: ConflictRange[];
};

function NewSelectionBlock({ block, existingRanges }: NewSelectionBlockProps) {
  const startHour = getHourFromTimeLabel(block.start);
  const endHour = getHourFromTimeLabel(block.end);

  const duration = endHour - startHour;
  if (duration <= 0) return null;

  const left = (startHour / 24) * 100;
  const width = (duration / 24) * 100;

  const overlappingSegments = existingRanges
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

  const hasConflict = overlappingSegments.length > 0;

  return (
    <div
      className="absolute inset-y-3 z-20 overflow-hidden rounded-md border-2 border-dashed border-primary-2 bg-purple-50/80 shadow-sm"
      style={{
        left: `${left}%`,
        width: `${width}%`,
      }}
      title={formatBlockLabel(block.start, block.end)}
    >
      {overlappingSegments.map((segment, index) => (
        <div
          key={index}
          className="absolute inset-y-0 z-30 bg-[repeating-linear-gradient(135deg,#f97316_0px,#f97316_4px,transparent_4px,transparent_8px)]"
          style={{
            left: `${segment.left}%`,
            width: `${segment.width}%`,
          }}
          title="Empalme con una reservación existente"
        />
      ))}

      <div className="relative z-40 flex h-full items-center justify-center px-3">
        <span
          className={[
            "truncate text-xs font-semibold",
            hasConflict ? "text-slate-900" : "text-primary-2",
          ].join(" ")}
        >
          {formatBlockLabel(block.start, block.end)}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared row                                                                  */
/* -------------------------------------------------------------------------- */

type TimelineRowProps = {
  labelTop: string;
  labelBottom: string;
  children: React.ReactNode;
  isLast?: boolean;
};

function TimelineRow({
  labelTop,
  labelBottom,
  children,
  isLast = false,
}: TimelineRowProps) {
  return (
    <div
      className={[
        "grid grid-cols-[120px_minmax(0,1fr)]",
        !isLast ? "border-b border-slate-200" : "",
      ].join(" ")}
    >
      <div className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold leading-5 text-slate-800">
        {labelTop}
        <br />
        {labelBottom}
      </div>

      <div className="relative h-[68px] bg-white">
        <TimelineGrid />
        {children}
      </div>
    </div>
  );
}

type EmptyRowMessageProps = {
  children: React.ReactNode;
};

function EmptyRowMessage({ children }: EmptyRowMessageProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center px-4">
      <span className="text-xs font-medium text-slate-400">
        {children}
      </span>
    </div>
  );
}