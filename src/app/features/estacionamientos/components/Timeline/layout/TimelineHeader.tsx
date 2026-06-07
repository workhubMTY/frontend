import { cn } from "@/app/shared/lib/cn";
import { HOURS } from "../utils";

export function TimelineHeader() {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)]">
      <div />

      <div className="relative h-7 px-1 pb-3 text-sm text-slate-500">
        {HOURS.map((hour, index) => {
          const left = (index / (HOURS.length - 1)) * 100;

          return (
            <span
              key={hour}
              className={cn(
                "absolute top-0 whitespace-nowrap",
                index === 0 && "translate-x-0",
                index > 0 && index < HOURS.length - 1 && "-translate-x-1/2",
                index === HOURS.length - 1 && "-translate-x-full",
              )}
              style={{ left: `${left}%` }}
            >
              {hour}
            </span>
          );
        })}
      </div>
    </div>
  );
}