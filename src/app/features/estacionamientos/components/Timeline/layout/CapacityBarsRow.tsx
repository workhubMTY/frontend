import { cn } from "@/app/features/reservaciones/lib/cn";
import { TimelineGrid } from "./TimelineGrid";
import type { ConflictRange, ParkingCapacityBar } from "../types";

type CapacityBarsRowProps = {
  capacity: number;
  bars: ParkingCapacityBar[];
  myReservationRanges?: ConflictRange[];
};

export function CapacityBarsRow({
  capacity,
  bars,
  myReservationRanges = [],
}: CapacityBarsRowProps) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] border-b border-slate-200">
      <div className="flex items-center border-r border-slate-200 bg-white px-3 text-sm font-semibold leading-5 text-slate-800">
        Cajones
        <br />
        ocupados
      </div>

      <div className="relative h-[76px] bg-white">
        <TimelineGrid />

        <MyReservationMarkers ranges={myReservationRanges} />

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

type MyReservationMarkersProps = {
  ranges: ConflictRange[];
};
function MyReservationMarkers({ ranges }: MyReservationMarkersProps) {
  return (
    <>
      {ranges.map((range, index) => (
        <div key={`${range.startHour}-${range.endHour}-${index}`}>
          <MyReservationRangeBackground range={range} />

          <ReservationBoundaryLine
            hour={range.startHour}
            label="Inicio de mi reservación"
          />

          <ReservationBoundaryLine
            hour={range.endHour}
            label="Fin de mi reservación"
          />
        </div>
      ))}
    </>
  );
}

type ReservationBoundaryLineProps = {
  hour: number;
  label: string;
};
function ReservationBoundaryLine({
  hour,
  label,
}: ReservationBoundaryLineProps) {
  const left = (hour / 24) * 100;

  return (
    <div
      title={label}
      className="absolute bottom-0 top-0 z-20 border-l-2 border-dashed border-blue-600"
      style={{
        left: `${left}%`,
      }}
    >
      <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-600" />
    </div>
  );
}

type MyReservationRangeBackgroundProps = {
  range: ConflictRange;
};

function MyReservationRangeBackground({
  range,
}: MyReservationRangeBackgroundProps) {
  const duration = range.endHour - range.startHour;

  if (duration <= 0) return null;

  const left = (range.startHour / 24) * 100;
  const width = (duration / 24) * 100;

  return (
    <div
      title="Horario donde ya tienes una reservación"
      className="absolute bottom-2 top-2 z-10 rounded-md border border-blue-200 bg-blue-50/70"
      style={{
        left: `${left}%`,
        width: `${width}%`,
      }}
    />
  );
}
