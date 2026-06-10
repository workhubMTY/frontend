import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";

export const HOME_AGENDA_START_HOUR = 6;
export const HOME_AGENDA_END_HOUR = 18;

export const HOME_AGENDA_TOTAL_MINUTES =
  (HOME_AGENDA_END_HOUR - HOME_AGENDA_START_HOUR) * 60;

export const HOME_AGENDA_ROW_MIN_HEIGHT = 92;
export const HOME_AGENDA_LANE_HEIGHT = 30;
export const HOME_AGENDA_LANE_GAP = 6;

export const HOME_AGENDA_HOUR_LABELS = Array.from(
  { length: HOME_AGENDA_END_HOUR - HOME_AGENDA_START_HOUR + 1 },
  (_, index) => HOME_AGENDA_START_HOUR + index,
);

export type PositionedAgendaItem = ScheduleItem & {
  lane: number;
  leftPercent: number;
  widthPercent: number;
};

export function timeToMinutes(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");

  return Number(hours) * 60 + Number(minutes);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getAgendaItemRange(item: ScheduleItem) {
  const startMinutes = timeToMinutes(item.start);
  const endMinutes = timeToMinutes(item.end);

  const visibleStart = clamp(
    startMinutes,
    HOME_AGENDA_START_HOUR * 60,
    HOME_AGENDA_END_HOUR * 60,
  );

  const visibleEnd = clamp(
    endMinutes,
    HOME_AGENDA_START_HOUR * 60,
    HOME_AGENDA_END_HOUR * 60,
  );

  return {
    startMinutes,
    endMinutes,
    visibleStart,
    visibleEnd,
  };
}

export function itemOverlapsHomeAgenda(item: ScheduleItem) {
  const { startMinutes, endMinutes } = getAgendaItemRange(item);

  return (
    startMinutes < HOME_AGENDA_END_HOUR * 60 &&
    endMinutes > HOME_AGENDA_START_HOUR * 60
  );
}

export function placeItemsInLanes(
  items: ScheduleItem[],
): PositionedAgendaItem[] {
  const sortedItems = [...items]
    .filter(itemOverlapsHomeAgenda)
    .sort((a, b) => {
      const aStart = timeToMinutes(a.start);
      const bStart = timeToMinutes(b.start);

      if (aStart !== bStart) return aStart - bStart;

      return timeToMinutes(a.end) - timeToMinutes(b.end);
    });

  const laneEndTimes: number[] = [];

  return sortedItems.map((item) => {
    const { visibleStart, visibleEnd, endMinutes } = getAgendaItemRange(item);

    const relativeStart = visibleStart - HOME_AGENDA_START_HOUR * 60;
    const relativeEnd = visibleEnd - HOME_AGENDA_START_HOUR * 60;

    const leftPercent =
      (relativeStart / HOME_AGENDA_TOTAL_MINUTES) * 100;

    const widthPercent = Math.max(
      ((relativeEnd - relativeStart) / HOME_AGENDA_TOTAL_MINUTES) * 100,
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

export function getMaxLane(items: PositionedAgendaItem[]) {
  if (items.length === 0) return 0;

  return Math.max(...items.map((item) => item.lane)) + 1;
}

export function getHomeAgendaRowHeight(laneCount: number) {
  return Math.max(
    HOME_AGENDA_ROW_MIN_HEIGHT,
    laneCount * HOME_AGENDA_LANE_HEIGHT +
      Math.max(laneCount - 1, 0) * HOME_AGENDA_LANE_GAP +
      24,
  );
}

export function formatHourLabel(hour: number) {
  return `${hour}:00`;
}

export function formatAgendaItemRange(item: ScheduleItem) {
  return `${item.start} - ${item.end}`;
}