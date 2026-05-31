import type { TimeBlock } from "@/app/features/reservaciones/types/reservaciones";
import { TimelineGrid } from "./TimelineGrid";
import type { ConflictRange } from "../types";
import { formatBlockLabel, getHourFromTimeLabel } from "../utils";

type SelectedBlocksRowProps = {
  blocks: TimeBlock[];
  conflictRange: ConflictRange;
};

export function SelectedBlocksRow({
  blocks,
  conflictRange,
}: SelectedBlocksRowProps) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)]">
      <div className="flex items-center border-r border-slate-200 bg-white px-3 text-sm font-semibold leading-5 text-slate-800">
        Tu
        <br />
        selección
      </div>

      <div className="relative h-[76px] bg-white">
        <TimelineGrid />

        {blocks.map((block) => (
          <SelectedParkingBlock
            key={block.id}
            block={block}
            conflictRange={conflictRange}
          />
        ))}
      </div>
    </div>
  );
}

type SelectedParkingBlockProps = {
  block: TimeBlock;
  conflictRange: ConflictRange;
};

function SelectedParkingBlock({
  block,
  conflictRange,
}: SelectedParkingBlockProps) {
  const startHour = getHourFromTimeLabel(block.start);
  const endHour = getHourFromTimeLabel(block.end);

  const duration = endHour - startHour;
  const left = (startHour / 24) * 100;
  const width = (duration / 24) * 100;

  const hasConflict =
    startHour < conflictRange.endHour && endHour > conflictRange.startHour;

  const conflictStart = Math.max(conflictRange.startHour, startHour);
  const conflictEnd = Math.min(conflictRange.endHour, endHour);

  const conflictLeft = hasConflict
    ? ((conflictStart - startHour) / duration) * 100
    : 0;

  const conflictWidth = hasConflict
    ? ((conflictEnd - conflictStart) / duration) * 100
    : 0;

  return (
    <div
      className="absolute top-1/2 h-10 -translate-y-1/2 overflow-hidden rounded-md bg-violet-700 shadow-sm"
      style={{
        left: `${left}%`,
        width: `${width}%`,
      }}
    >
      <div className="relative flex h-full items-center justify-center px-3">
        {hasConflict ? (
          <div
            className="absolute inset-y-0 bg-[repeating-linear-gradient(135deg,#f97316_0px,#f97316_4px,transparent_4px,transparent_8px)]"
            style={{
              left: `${conflictLeft}%`,
              width: `${conflictWidth}%`,
            }}
          />
        ) : null}

        <span className="relative z-10 truncate text-sm font-semibold text-white">
          {formatBlockLabel(block.start, block.end)}
        </span>
      </div>
    </div>
  );
}