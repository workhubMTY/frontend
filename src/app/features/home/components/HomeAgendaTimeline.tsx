"use client";

import { CalendarDays, Car, Clock, Monitor, Users } from "lucide-react";

import { cn } from "@/app/shared/lib/cn";
import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type { HomeAgendaDay } from "@/app/features/home/types/homeAgenda";

type HomeAgendaTimelineProps = {
  days: HomeAgendaDay[];
  itemsByDate: Record<string, ScheduleItem[]>;
  disabledDateIds?: string[];
  isLoading?: boolean;
};

const START_HOUR = 6;
const END_HOUR = 18;
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;

const HOUR_LABELS = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, index) => START_HOUR + index,
);

const ROW_MIN_HEIGHT = 92;
const LANE_HEIGHT = 30;
const LANE_GAP = 6;

type PositionedAgendaItem = ScheduleItem & {
  lane: number;
  leftPercent: number;
  widthPercent: number;
};

function timeToMinutes(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");

  return Number(hours) * 60 + Number(minutes);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getItemRange(item: ScheduleItem) {
  const startMinutes = timeToMinutes(item.start);
  const endMinutes = timeToMinutes(item.end);

  const visibleStart = clamp(startMinutes, START_HOUR * 60, END_HOUR * 60);
  const visibleEnd = clamp(endMinutes, START_HOUR * 60, END_HOUR * 60);

  return {
    startMinutes,
    endMinutes,
    visibleStart,
    visibleEnd,
  };
}

function itemOverlapsTimeline(item: ScheduleItem) {
  const { startMinutes, endMinutes } = getItemRange(item);

  return startMinutes < END_HOUR * 60 && endMinutes > START_HOUR * 60;
}

function placeItemsInLanes(items: ScheduleItem[]): PositionedAgendaItem[] {
  const sortedItems = [...items].filter(itemOverlapsTimeline).sort((a, b) => {
    const aStart = timeToMinutes(a.start);
    const bStart = timeToMinutes(b.start);

    if (aStart !== bStart) return aStart - bStart;

    return timeToMinutes(a.end) - timeToMinutes(b.end);
  });

  const laneEndTimes: number[] = [];

  return sortedItems.map((item) => {
    const { visibleStart, visibleEnd, endMinutes } = getItemRange(item);

    const relativeStart = visibleStart - START_HOUR * 60;
    const relativeEnd = visibleEnd - START_HOUR * 60;

    const leftPercent = (relativeStart / TOTAL_MINUTES) * 100;
    const widthPercent = Math.max(
      ((relativeEnd - relativeStart) / TOTAL_MINUTES) * 100,
      2.5,
    );

    let lane = laneEndTimes.findIndex((laneEnd) => {
      const itemStart = timeToMinutes(item.start);
      return itemStart >= laneEnd;
    });

    if (lane === -1) {
      lane = laneEndTimes.length;
      laneEndTimes.push(endMinutes);
    } else {
      laneEndTimes[lane] = endMinutes;
    }

    return {
      ...item,
      lane,
      leftPercent,
      widthPercent,
    };
  });
}

function getMaxLane(items: PositionedAgendaItem[]) {
  if (items.length === 0) return 0;

  return Math.max(...items.map((item) => item.lane)) + 1;
}

function getAgendaItemStyles(item: ScheduleItem) {
  if (item.kind === "parking_reservation") {
    return {
      icon: Car,
      className:
        "border-slate-300 bg-slate-100 text-slate-700 shadow-slate-100/70",
      labelClassName: "text-slate-500",
    };
  }

  if (item.kind === "calendar_event") {
    return {
      icon: CalendarDays,
      className: "border-sky-200 bg-sky-50 text-sky-700 shadow-sky-100/70",
      labelClassName: "text-sky-500",
    };
  }

  if (item.kind === "my_reservation" && item.officeCategory === "MEETING") {
    return {
      icon: Users,
      className:
        "border-violet-200 bg-violet-50 text-violet-700 shadow-violet-100/70",
      labelClassName: "text-violet-500",
    };
  }

  if (item.kind === "my_reservation" && item.officeCategory === "RESERVATION") {
    return {
      icon: Monitor,
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100/70",
      labelClassName: "text-emerald-500",
    };
  }

  return {
    icon: Clock,
    className: "border-neutral-200 bg-white text-slate-700 shadow-slate-100/70",
    labelClassName: "text-slate-500",
  };
}

function formatHourLabel(hour: number) {
  return `${hour}:00`;
}

function formatRangeLabel(item: ScheduleItem) {
  return `${item.start} - ${item.end}`;
}
export function HomeAgendaTimeline({
  days,
  itemsByDate,
  disabledDateIds = [],
  isLoading = false,
}: HomeAgendaTimelineProps) {
  const positionedItemsByDate = days.reduce<
    Record<string, PositionedAgendaItem[]>
  >((acc, day) => {
    acc[day.id] = placeItemsInLanes(itemsByDate[day.id] ?? []);
    return acc;
  }, {});

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-slate-100 px-6 py-3">
        <div className="grid grid-cols-[42px_minmax(0,1fr)]">
          <div />

          <div className="relative h-6">
            {HOUR_LABELS.map((hour) => {
              const left =
                ((hour - START_HOUR) / (END_HOUR - START_HOUR)) * 100;

              return (
                <div
                  key={hour}
                  className="absolute top-0 -translate-x-1/2 text-xs font-medium text-slate-400"
                  style={{ left: `${left}%` }}
                >
                  {formatHourLabel(hour)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2">
        <div className="space-y-2">
          {days.map((day) => {
            const positionedItems = positionedItemsByDate[day.id] ?? [];
            const laneCount = getMaxLane(positionedItems);
            const isDisabled = disabledDateIds.includes(day.id);

            const rowHeight = Math.max(
              ROW_MIN_HEIGHT,
              laneCount * LANE_HEIGHT +
                Math.max(laneCount - 1, 0) * LANE_GAP +
                24,
            );

            return (
              <div
                key={day.id}
                className="grid grid-cols-[42px_minmax(0,1fr)] gap-3"
              >
                <div className="flex flex-col items-center pt-9">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    {day.dayLabel}
                  </span>

                  <span
                    className={cn(
                      "mt-1 grid size-6 place-items-center rounded-full text-xs font-semibold",
                      day.isToday
                        ? "bg-violet-600 text-white shadow-sm"
                        : "text-slate-700",
                    )}
                  >
                    {day.dayNumber}
                  </span>
                </div>

                <div
                  className="relative overflow-hidden rounded-xl bg-slate-50"
                  style={{ minHeight: rowHeight }}
                >
                  <div className="absolute inset-0 grid grid-cols-12">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "border-l border-slate-200/80",
                          index === 0 && "border-l-0",
                        )}
                      />
                    ))}
                  </div>

                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-slate-400">
                        Cargando agenda...
                      </span>
                    </div>
                  ) : positionedItems.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-slate-300">
                        Sin actividades
                      </span>
                    </div>
                  ) : (
                    positionedItems.map((item) => {
                      const styles = getAgendaItemStyles(item);
                      const Icon = styles.icon;

                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "absolute z-10 flex h-[30px] min-w-[72px] items-center gap-2 overflow-hidden rounded-lg border px-2 text-[11px] font-medium shadow-sm transition hover:z-20 hover:shadow-md",
                            styles.className,
                          )}
                          style={{
                            left: `${item.leftPercent}%`,
                            width: `${item.widthPercent}%`,
                            top: 12 + item.lane * (LANE_HEIGHT + LANE_GAP),
                          }}
                          title={`${item.title} · ${formatRangeLabel(item)}`}
                        >
                          <Icon className="size-3 shrink-0" />

                          <div className="min-w-0 flex-1 truncate">
                            <span className="truncate">{item.title}</span>
                          </div>

                          <span
                            className={cn(
                              "hidden shrink-0 text-[10px] font-semibold lg:inline",
                              styles.labelClassName,
                            )}
                          >
                            {item.start}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
