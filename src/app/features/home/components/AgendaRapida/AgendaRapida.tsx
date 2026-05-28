"use client";

import { useState, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { CalEvent } from "../../types/types";
import { ExternalEvent } from "../../types/Agenda";

const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const DAYS_SHORT = ["Lu", "Ma", "Mi", "Ju", "Vi"];
const START_H = HOURS[0];
const TOTAL_H = HOURS.length;

const COL_MIN_PX = 56;
const DAY_COL_PX = 38;
const GRID_MIN_W = DAY_COL_PX + COL_MIN_PX * TOTAL_H;

const EXTERNAL_COLORS: Record<
  ExternalEvent["kind"],
  { bg: string; border: string; text: string; sub: string }
> = {
  friend: { bg: "#FFF0E6", border: "#F97316", text: "#9A3412", sub: "#C2663A" },
  invitation: {
    bg: "#E6F4FF",
    border: "#3B82F6",
    text: "#1E3A8A",
    sub: "#3B6CB7",
  },
  holiday: {
    bg: "#FEF9C3",
    border: "#EAB308",
    text: "#713F12",
    sub: "#A16207",
  },
};

function getMonday(offset: number): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(now);
  mon.setDate(now.getDate() + diff + offset * 7);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

function fmtRange(mon: Date, short = false): string {
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 4);
  if (short) {
    return `${mon.toLocaleDateString("es-MX", { day: "2-digit", month: "short" })} - ${fri.toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}`;
  }
  return `${mon.toLocaleDateString("es-MX", { day: "2-digit", month: "short" })} - ${fri.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}`;
}

function isToday(d: Date): boolean {
  const t = new Date();
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
}

function isSameLocalDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface AgendaRapidaProps {
  onEventClick?: (ev: CalEvent) => void;
  externalEvents?: ExternalEvent[];
}

export default function AgendaRapida({
  externalEvents = [],
}: AgendaRapidaProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const monday = useMemo(() => getMonday(weekOffset), [weekOffset]);
  const weekDates = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
      }),
    [monday],
  );

  const hasLegend =
    externalEvents.some((e) => e.kind === "friend") ||
    externalEvents.some((e) => e.kind === "invitation") ||
    externalEvents.some((e) => e.kind === "holiday");

  return (
    <div className="flex h-full flex-col shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-3 py-2.5 gap-2">
        <div className="flex items-center gap-2 shrink-0">
          {/* <div className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-violet-700">
            <CalendarDays size={12} className="text-white" />
          </div> */}
          <span className="text-xl font-semibold text-gray-900 hidden sm:block">
            Agenda rápida
          </span>
          <span className="text-xl font-semibold text-gray-900 sm:hidden">
            Agenda
          </span>
        </div>

        {hasLegend && (
          <div className="hidden md:flex items-center gap-3">
            {externalEvents.some((e) => e.kind === "friend") && (
              <span className="flex items-center gap-1 text-[0.6rem] text-gray-500">
                <span
                  className="inline-block h-2 w-2 rounded-sm"
                  style={{ background: EXTERNAL_COLORS.friend.border }}
                />
                Amigo
              </span>
            )}
            {externalEvents.some((e) => e.kind === "invitation") && (
              <span className="flex items-center gap-1 text-[0.6rem] text-gray-500">
                <span
                  className="inline-block h-2 w-2 rounded-sm"
                  style={{ background: EXTERNAL_COLORS.invitation.border }}
                />
                Invitación
              </span>
            )}
            {externalEvents.some((e) => e.kind === "holiday") && (
              <span className="flex items-center gap-1 text-[0.6rem] text-gray-500">
                <span
                  className="inline-block h-2 w-2 rounded-sm"
                  style={{ background: EXTERNAL_COLORS.holiday.border }}
                />
                Festivo
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer"
          >
            <ChevronLeft size={13} />
          </button>
          <span className="text-center text-[0.68rem] font-semibold text-gray-500 whitespace-nowrap px-1 hidden sm:block">
            {fmtRange(monday)}
          </span>
          <span className="text-center text-[0.68rem] font-semibold text-gray-500 whitespace-nowrap px-0.5 sm:hidden">
            {fmtRange(monday, true)}
          </span>
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto overflow-y-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div
            className="flex flex-col h-full px-2 py-2 gap-0"
            style={{ minWidth: `${GRID_MIN_W}px` }}
          >
            <div
              className="grid shrink-0 mb-1"
              style={{
                gridTemplateColumns: `${DAY_COL_PX}px repeat(${TOTAL_H}, minmax(${COL_MIN_PX}px, 1fr))`,
              }}
            >
              <div />
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="text-center text-[0.6rem] font-semibold text-gray-400"
                >
                  {h}:00
                </div>
              ))}
            </div>

            <div className="flex flex-1 flex-col gap-1 min-h-0">
              {DAYS_SHORT.map((dayName, di) => {
                const date = weekDates[di];
                const today = isToday(date);
                const extEvts = externalEvents.filter((ev) => {
                  if (ev.startAt)
                    return isSameLocalDate(new Date(ev.startAt), date);
                  return ev.day === di;
                });

                return (
                  <div
                    key={di}
                    className="grid"
                    style={{
                      gridTemplateColumns: `${DAY_COL_PX}px repeat(${TOTAL_H}, minmax(${COL_MIN_PX}px, 1fr))`,
                      minHeight: "36px",
                      flex: "1 0 36px",
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5 pr-1">
                      <span className="text-[0.52rem] font-bold uppercase tracking-wide text-gray-400">
                        {dayName}
                      </span>
                      <span
                        className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[0.6rem] font-bold"
                        style={
                          today
                            ? { background: "#6d28d9", color: "#fff" }
                            : { color: "#374151" }
                        }
                      >
                        {date?.getDate()}
                      </span>
                    </div>

                    <div
                      className="relative rounded-md bg-gray-50"
                      style={{ gridColumn: `2 / ${TOTAL_H + 2}` }}
                    >
                      {HOURS.map((_, si) => (
                        <div
                          key={si}
                          className="absolute top-0 bottom-0 border-r border-gray-200"
                          style={{ left: `${(si / TOTAL_H) * 100}%` }}
                        />
                      ))}

                      {extEvts.map((ev, ei) => {
                        const c = EXTERNAL_COLORS[ev.kind];
                        const left = `${((ev.start - START_H) / TOTAL_H) * 100}%`;
                        const width = `${Math.max(((ev.end - ev.start) / TOTAL_H) * 100, 3)}%`;
                        const isHoliday = ev.kind === "holiday";
                        return (
                          <div
                            key={`ext-${ei}`}
                            className="absolute overflow-hidden rounded cursor-default flex flex-col justify-center"
                            style={{
                              left,
                              width,
                              top: isHoliday ? "1px" : "35%",
                              bottom: "1px",
                              background: c.bg,
                              borderLeft: `3px solid ${c.border}`,
                              paddingLeft: "5px",
                              paddingRight: "4px",
                              zIndex: 2,
                              opacity: 0.88,
                            }}
                            title={`${ev.label}${ev.sublabel ? ` · ${ev.sublabel}` : ""}`}
                          >
                            <p
                              className="text-[0.5rem] font-semibold leading-tight truncate"
                              style={{ color: c.text }}
                            >
                              {ev.label}
                            </p>
                            {ev.sublabel && !isHoliday && (
                              <p
                                className="text-[0.44rem] leading-tight truncate"
                                style={{ color: c.sub }}
                              >
                                {ev.sublabel}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
