import { timelineHours } from "../../constants/reservaciones";
import { cn } from "../../lib/cn";
import { timeToPercent } from "../../lib/time";

export function TimelineAxis() {
  return (
    <div className="relative ml-32 h-7 text-xs font-medium text-slate-500">
      {timelineHours.map((hour, index) => {
        const left = hour === "23:59" ? 100 : timeToPercent(hour);
        const isFirst = index === 0;
        const isLast = index === timelineHours.length - 1;

        return (
          <span
            key={hour}
            className={cn(
              "absolute top-0 whitespace-nowrap",
              isFirst && "translate-x-0 text-left",
              isLast && "-translate-x-full text-right",
              !isFirst && !isLast && "-translate-x-1/2 text-center",
            )}
            style={{ left: `${left}%` }}
          >
            {hour}
          </span>
        );
      })}
    </div>
  );
}
