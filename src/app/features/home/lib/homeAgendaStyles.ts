import {
  CalendarDays,
  Car,
  Clock,
  Monitor,
  Users,
} from "lucide-react";

import type { ScheduleItem } from "@/app/features/reservaciones/crear/types/schedule";

export function getAgendaItemStyles(item: ScheduleItem) {
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
      className:
        "border-sky-200 bg-sky-50 text-sky-700 shadow-sky-100/70",
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

  if (
    item.kind === "my_reservation" &&
    item.officeCategory === "RESERVATION"
  ) {
    return {
      icon: Monitor,
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100/70",
      labelClassName: "text-emerald-500",
    };
  }

  return {
    icon: Clock,
    className:
      "border-neutral-200 bg-white text-slate-700 shadow-slate-100/70",
    labelClassName: "text-slate-500",
  };
}