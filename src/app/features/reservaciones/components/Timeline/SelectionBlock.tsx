import type { TimeBlock } from "../../types/reservaciones";
import { cn } from "../../lib/cn";
import { blockStyle, getDurationPercent, to24Hour } from "../../lib/time";
import { ConflictOverlay } from "./ConflictOverlay";

type SelectionBlockProps = {
  block: TimeBlock;
  variant?: "saved" | "pending";
  conflictSegments?: Array<{ left: string; width: string }>;
};

export function SelectionBlock({
  block,
  variant = "pending",
  conflictSegments = [],
}: SelectionBlockProps) {
  const start =
    block.start.includes("AM") || block.start.includes("PM")
      ? to24Hour(block.start)
      : block.start;

  const end =
    block.end.includes("AM") || block.end.includes("PM")
      ? to24Hour(block.end)
      : block.end;

  const durationPercent = getDurationPercent(start, end);
  const isShort = durationPercent < 8;

  return (
    <div
      title={`${block.label}: ${block.start} - ${block.end}`}
      className={cn(
        "absolute top-1/2 flex h-10 -translate-y-1/2 items-center justify-center overflow-hidden rounded-lg border-2 px-3 text-xs font-semibold shadow-sm",
        variant === "saved" && "border-slate-400 bg-slate-100 text-slate-700",
        variant === "pending" &&
          "border-violet-600 bg-violet-50/80 text-violet-700",
      )}
      style={blockStyle(start, end)}
    >
      <span
        className={cn(
          "absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 bg-white",
          variant === "saved" ? "border-slate-400" : "border-violet-600",
        )}
      />

      <span className="block max-w-full truncate px-1">
        {isShort
          ? block.start.replace(" AM", "").replace(" PM", "")
          : `${block.start.replace(" AM", "").replace(" PM", "")} - ${block.end.replace(" AM", "").replace(" PM", "")}`}
      </span>

      {conflictSegments.map((segment, index) => (
        <ConflictOverlay
          key={`${block.id}-conflict-${index}`}
          style={{ left: segment.left, width: segment.width }}
        />
      ))}

      <span
        className={cn(
          "absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 bg-white",
          variant === "saved" ? "border-slate-400" : "border-violet-600",
        )}
      />
    </div>
  );
}
