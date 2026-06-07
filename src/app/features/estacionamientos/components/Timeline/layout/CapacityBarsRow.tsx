import { cn } from "@/app/shared/lib/cn";
import { TimelineGrid } from "./TimelineGrid";
import type { ParkingCapacityBar } from "../types";

type CapacityBarsRowProps = {
  capacity: number;
  bars: ParkingCapacityBar[];
};

export function CapacityBarsRow({ capacity, bars }: CapacityBarsRowProps) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] border-b border-slate-200">
      <div className="flex items-center border-r border-slate-200 bg-white px-3 text-sm font-semibold leading-5 text-slate-800">
        Cajones
        <br />
        ocupados
      </div>

      <div className="relative h-[76px] bg-white">
        <TimelineGrid />

        <div className="absolute inset-x-0 bottom-2 flex h-[60px] items-end gap-[3px] px-1">
          {bars.map((bar) => (
            <div
              key={bar.index}
              title={`${bar.reservationCount}/${capacity} cajones ocupados`}
              className={cn(
                "relative flex-1 rounded-t-[3px] bg-slate-300",
                bar.isHighOccupation && "bg-orange-400",
                bar.isFull &&
                  "bg-[repeating-linear-gradient(135deg,#fb923c_0px,#fb923c_3px,transparent_3px,transparent_7px)]",
              )}
              style={{ height: `${bar.height}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}