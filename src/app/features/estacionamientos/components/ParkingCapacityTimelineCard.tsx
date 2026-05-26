"use client";

import { CalendarDays } from "lucide-react";

import { cn } from "@/app/features/reservaciones/lib/cn";
import type { TimeBlock } from "@/app/features/reservaciones/types/reservaciones";

type ParkingCapacityTimelineCardProps = {
  capacity: number;
  blocks: TimeBlock[];
  highOccupationRange?: {
    startHour: number;
    endHour: number;
  };
  conflictRange?: {
    startHour: number;
    endHour: number;
  };
};

const HOURS = [
  "00:00",
  "02:00",
  "04:00",
  "06:00",
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
  "24:00",
];

const CAPACITY_BARS = Array.from({ length: 96 }, (_, index) => {
  const hour = index / 4;

  const morningWave = Math.sin((hour / 24) * Math.PI * 4 - 0.6);
  const middayWave = Math.sin((hour / 24) * Math.PI * 7 + 1.1);

  const normalized = 0.48 + morningWave * 0.22 + middayWave * 0.08;

  const height = Math.max(18, Math.min(58, normalized * 58));

  return {
    index,
    hour,
    height,
  };
});

export function ParkingCapacityTimelineCard({
  capacity,
  blocks,
  highOccupationRange = {
    startHour: 8,
    endHour: 13,
  },
  conflictRange = {
    startHour: 10.5,
    endHour: 12,
  },
}: ParkingCapacityTimelineCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-950">
            Capacidad del estacionamiento y tu selección
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Capacidad máxima: {capacity} cajones
          </p>
        </div>

        <ParkingCapacityLegend />
      </header>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[920px]">
          <TimelineHours />

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-[120px_minmax(0,1fr)] border-b border-slate-200">
              <div className="flex items-center border-r border-slate-200 bg-white px-3 text-sm font-semibold leading-5 text-slate-800">
                Capacidad
                <br />
                disponible
              </div>

              <div className="relative h-[76px] bg-white">
                <TimelineGrid />

                <div className="absolute inset-x-0 bottom-2 flex h-[60px] items-end gap-[3px] px-1">
                  {CAPACITY_BARS.map((bar) => {
                    const isHighOccupation =
                      bar.hour >= highOccupationRange.startHour &&
                      bar.hour <= highOccupationRange.endHour;

                    const isConflict =
                      bar.hour >= conflictRange.startHour &&
                      bar.hour <= conflictRange.endHour;

                    return (
                      <div
                        key={bar.index}
                        className={cn(
                          "relative flex-1 rounded-t-[3px] bg-slate-300",
                          isHighOccupation && "bg-orange-400",
                          isConflict &&
                            "bg-[repeating-linear-gradient(135deg,#fb923c_0px,#fb923c_3px,transparent_3px,transparent_7px)]",
                        )}
                        style={{
                          height: `${bar.height}px`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[120px_minmax(0,1fr)]">
              <div className="flex items-center border-r border-slate-200 bg-white px-3 text-sm font-semibold leading-5 text-slate-800">
                Tu
                <br />
                selección
              </div>

              <div className="relative h-[76px] bg-white">
                <TimelineGrid />

                {blocks.map((block, index) => (
                  <SelectedParkingBlock
                    key={block.id}
                    block={block}
                    index={index}
                    conflictRange={conflictRange}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ParkingCapacityLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-600">
      <LegendItem label="Disponibilidad" markerClassName="bg-slate-300" />

      <LegendItem label="Tu selección" markerClassName="bg-violet-700" />

      <LegendItem label="Alta ocupación" markerClassName="bg-orange-400" />

      <div className="flex items-center gap-2">
        <span className="h-4 w-4 rounded-sm bg-[repeating-linear-gradient(135deg,#fb923c_0px,#fb923c_2px,transparent_2px,transparent_5px)]" />
        <span>Sin cupo / conflicto</span>
      </div>
    </div>
  );
}

type LegendItemProps = {
  label: string;
  markerClassName: string;
};

function LegendItem({ label, markerClassName }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-4 w-4 rounded-sm", markerClassName)} />
      <span>{label}</span>
    </div>
  );
}
function TimelineHours() {
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
              style={{
                left: `${left}%`,
              }}
            >
              {hour}
            </span>
          );
        })}
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

type SelectedParkingBlockProps = {
  block: TimeBlock;
  index: number;
  conflictRange: {
    startHour: number;
    endHour: number;
  };
};

function SelectedParkingBlock({
  block,
  index,
  conflictRange,
}: SelectedParkingBlockProps) {
  const startHour = getHourFromTimeLabel(block.start);
  const endHour = getHourFromTimeLabel(block.end);

  const left = (startHour / 24) * 100;
  const width = ((endHour - startHour) / 24) * 100;

  const hasConflict =
    startHour < conflictRange.endHour && endHour > conflictRange.startHour;

  const conflictLeft = hasConflict
    ? ((Math.max(conflictRange.startHour, startHour) - startHour) /
        (endHour - startHour)) *
      100
    : 0;

  const conflictWidth = hasConflict
    ? ((Math.min(conflictRange.endHour, endHour) -
        Math.max(conflictRange.startHour, startHour)) /
        (endHour - startHour)) *
      100
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

function getHourFromTimeLabel(value: string) {
  const normalizedValue = value.trim().toUpperCase();
  const [time = "00:00", period = "AM"] = normalizedValue.split(" ");
  const [rawHours = "0", rawMinutes = "0"] = time.split(":");

  let hours = Number(rawHours);
  const minutes = Number(rawMinutes);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours + minutes / 60;
}

function formatBlockLabel(start: string, end: string) {
  return `${start.replace(" AM", "").replace(" PM", "")} – ${end}`;
}
