import type { TimelineEvent } from "../../types/reservaciones";
import { cn } from "../../lib/cn";
import { blockStyle, getDurationPercent } from "../../lib/time";

type TimelineBlockProps = {
  event: TimelineEvent;
  variant: "reserved" | "external";
};

export function TimelineBlock({ event, variant }: TimelineBlockProps) {
  const durationPercent = getDurationPercent(event.start, event.end);
  const isVeryShort = durationPercent < 5;
  const isShort = durationPercent < 7;

  return (
    <div
      title={event.title ?? event.label}
      className={cn(
        "group absolute top-1/2 flex h-8 -translate-y-1/2 items-center justify-center rounded-lg border text-xs font-medium",
        "overflow-hidden whitespace-nowrap",
        isVeryShort ? "px-1" : "px-3",
        variant === "reserved" &&
          "border-slate-300 bg-slate-200 text-slate-700",
        variant === "external" &&
          "border-slate-300 bg-slate-100 text-slate-600",
      )}
      style={blockStyle(event.start, event.end)}
    >
      {isVeryShort ? (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      ) : (
        <span className="block max-w-full truncate">
          {isShort ? event.start : event.label}
        </span>
      )}
    </div>
  );
}
