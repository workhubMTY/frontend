import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";
import type {
  TimelineOfficeReservationCategory,
  UserTimelineQuery,
} from "@/app/features/reservaciones/crear/types/timeline";

import type {
  HomeAgendaDay,
  HomeAgendaFilter,
} from "../types/homeAgenda";

export function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function toDateId(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Tu backend espera YYYY-MM-DD, no ISO datetime.
 */
export function toApiDate(date: Date) {
  return toDateId(date);
}

export function getDaysBetween(from: Date, count: number): HomeAgendaDay[] {
  const todayId = toDateId(startOfLocalDay(new Date()));

  return Array.from({ length: count }, (_, index) => {
    const date = addDays(from, index);
    const id = toDateId(date);

    return {
      id,
      date,
      dayLabel: date
        .toLocaleDateString("es-MX", { weekday: "short" })
        .slice(0, 2)
        .toUpperCase(),
      dayNumber: date.getDate(),
      monthLabel: date.toLocaleDateString("es-MX", { month: "short" }),
      isToday: id === todayId,
    };
  });
}

export function clampDate(date: Date, min: Date, max: Date) {
  if (date < min) return min;
  if (date > max) return max;

  return date;
}
export function getHomeAgendaQuery(params: {
  from: Date;
  to: Date;
  filter: HomeAgendaFilter;
  includeEIds?: string[];
}): UserTimelineQuery {
  const { from, to, filter, includeEIds } = params;

  const includeOfficeReservations =
    filter === "all" || filter === "meeting" || filter === "coworking";

  const officeCategories =
    filter === "meeting"
      ? ["MEETING" as const]
      : filter === "coworking"
        ? ["RESERVATION" as const]
        : includeOfficeReservations
          ? (["MEETING", "RESERVATION"] as const)
          : undefined;

  return {
    from: toDateId(from),
    to: toDateId(to),

    includeOfficeReservations,
    officeCategories: officeCategories ? [...officeCategories] : undefined,

    includeParkingReservations: filter === "all" || filter === "parking",
    includeEvents: filter === "all" || filter === "events",

    includeFriends: true,
    includeEIds,
  };
}
export function filterHomeAgendaItems(
  items: ScheduleItem[],
  filter: HomeAgendaFilter,
) {
  const activeItems = items.filter((item) => item.lifecycleStatus === "ACTIVE");

  if (filter === "all") return activeItems;

  if (filter === "parking") {
    return activeItems.filter((item) => item.kind === "parking_reservation");
  }

  if (filter === "events") {
    return activeItems.filter((item) => item.kind === "calendar_event");
  }

  if (filter === "meeting") {
    return activeItems.filter(
      (item) =>
        item.kind === "my_reservation" && item.officeCategory === "MEETING",
    );
  }

  if (filter === "coworking") {
    return activeItems.filter(
      (item) =>
        item.kind === "my_reservation" &&
        item.officeCategory === "RESERVATION",
    );
  }

  return activeItems;
}

export function getMondayOfWeek(date: Date) {
  const current = startOfLocalDay(date);

  /**
   * JS:
   * domingo = 0
   * lunes = 1
   * martes = 2
   */
  const day = current.getDay();

  const diffToMonday = day === 0 ? -6 : 1 - day;

  return addDays(current, diffToMonday);
}

export function formatAgendaRangeLabel(days: { id: string }[]) {
  if (days.length === 0) return "";

  const first = days[0]?.id;
  const last = days[days.length - 1]?.id;

  return `${first} - ${last}`;
}