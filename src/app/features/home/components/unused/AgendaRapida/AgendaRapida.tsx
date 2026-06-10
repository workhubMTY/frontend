"use client";

import { useState, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2, User, Users } from "lucide-react";
import type { ExternalEvent } from "../../../types/unused/Agenda";

const HOURS      = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const DAYS_SHORT = ["Lu", "Ma", "Mi", "Ju", "Vi"];
const START_H    = HOURS[0];
const TOTAL_H    = HOURS.length;
const COL_MIN_PX = 70;
const DAY_COL_PX = 38;
const GRID_MIN_W = DAY_COL_PX + COL_MIN_PX * TOTAL_H;

const FALLBACK_COLORS: Record<string, { bg: string; border: string; text: string; sub: string }> = {
  friend:     { bg: "#FFF0E6", border: "#F97316", text: "#9A3412", sub: "#C2663A" },
  invitation: { bg: "#E6F4FF", border: "#3B82F6", text: "#1E3A8A", sub: "#3B6CB7" },
  holiday:    { bg: "#FEF9C3", border: "#EAB308", text: "#713F12", sub: "#A16207" },
};

function getMonday(offset: number): Date {
  const now  = new Date();
  const day  = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon  = new Date(now);
  mon.setDate(now.getDate() + diff + offset * 7);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

function fmtRange(mon: Date, short = false): string {
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 4);
  if (short)
    return `${mon.toLocaleDateString("es-MX", { day: "2-digit", month: "short" })} - ${fri.toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}`;
  return `${mon.toLocaleDateString("es-MX", { day: "2-digit", month: "short" })} - ${fri.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}`;
}

function isToday(d: Date): boolean {
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

function isSameLocalDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Divide eventos en propios (isFriend=false) y del amigo (isFriend=true)
function splitEvents(evts: ExternalEvent[]) {
  const own:    ExternalEvent[] = [];
  const friend: ExternalEvent[] = [];
  for (const ev of evts) {
    if ((ev as any)._isFriend) friend.push(ev);
    else own.push(ev);
  }
  return { own, friend };
}

function EventBar({ ev, totalH, startH }: { ev: ExternalEvent; totalH: number; startH: number }) {
  const c     = (ev as any)._colors ?? FALLBACK_COLORS[ev.kind] ?? FALLBACK_COLORS.friend;
  const left  = `${((ev.start - startH) / totalH) * 100}%`;
  const width = `${Math.max(((ev.end - ev.start) / totalH) * 100, 3)}%`;

  return (
    <div
      className="absolute overflow-hidden rounded cursor-default flex flex-col justify-center"
      style={{
        left,
        width,
        top:          "1px",
        bottom:       "1px",
        background:   c.bg,
        borderLeft:   `3px solid ${c.border}`,
        paddingLeft:  "5px",
        paddingRight: "4px",
        zIndex:       2,
      }}
      title={`${ev.label}${ev.sublabel ? ` · ${ev.sublabel}` : ""}`}
    >
      <p className="text-[0.5rem] font-semibold leading-tight truncate" style={{ color: c.text }}>
        {ev.label}
      </p>
      {ev.sublabel && (
        <p className="text-[0.44rem] leading-tight truncate" style={{ color: c.sub }}>
          {ev.sublabel}
        </p>
      )}
    </div>
  );
}

interface AgendaRapidaProps {
  externalEvents?:      ExternalEvent[];
  loading?:             boolean;
  friendName?:          string | null;   // nombre del amigo seleccionado
  onWeekOffsetChange?:  (offset: number) => void;
}

export default function AgendaRapida({
  externalEvents = [],
  loading        = false,
  friendName     = null,
  onWeekOffsetChange,
}: AgendaRapidaProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const changeWeek = (delta: number) => {
    const next = weekOffset + delta;
    setWeekOffset(next);
    onWeekOffsetChange?.(next);
  };

  const monday    = useMemo(() => getMonday(weekOffset), [weekOffset]);
  const weekDates = useMemo(
    () => Array.from({ length: 5 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    }),
    [monday],
  );

  const hasFriendEvents = externalEvents.some((ev) => (ev as any)._isFriend);
  // Altura de cada carril: si hay amigo → dos carriles por día, si no → uno
  const laneH = hasFriendEvents ? "calc(50% - 1px)" : "100%";

  return (
    <div className="flex h-full flex-col border border-gray-100 overflow-hidden bg-white">

      {/* ── Header ── */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-3 py-2 gap-2">
        <span className="text-sm font-semibold text-gray-900">Agenda rápida</span>

        {loading && (
          <span className="flex items-center gap-1 text-[0.6rem] text-violet-500">
            <Loader2 size={10} className="animate-spin" /> Actualizando...
          </span>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <button type="button" onClick={() => changeWeek(-1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
            <ChevronLeft size={13} />
          </button>
          <span className="text-[0.68rem] font-semibold text-gray-500 whitespace-nowrap px-1 hidden sm:block">
            {fmtRange(monday)}
          </span>
          <span className="text-[0.68rem] font-semibold text-gray-500 whitespace-nowrap px-0.5 sm:hidden">
            {fmtRange(monday, true)}
          </span>
          <button type="button" onClick={() => changeWeek(1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* ── Leyenda de carriles (solo cuando hay amigo) ── */}
      {hasFriendEvents && (
        <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 px-3 py-1.5 bg-gray-50">
          <span className="flex items-center gap-1 text-[0.6rem] font-medium text-neutral-500">
            <span className="inline-block h-2 w-2 rounded-sm bg-violet-500" />
            <User size={9} className="text-neutral-400" />
            Tú
          </span>
          <span className="flex items-center gap-1 text-[0.6rem] font-medium text-neutral-500">
            <span className="inline-block h-2 w-2 rounded-sm bg-violet-300" />
            <Users size={9} className="text-neutral-400" />
            {friendName ?? "Amigo"}
          </span>
        </div>
      )}

      {/* ── Grid ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-auto"
          style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="flex flex-col h-full px-2 py-2 gap-0" style={{ minWidth: `${GRID_MIN_W}px` }}>

            {/* Encabezado horas */}
            <div className="grid shrink-0 mb-1"
              style={{ gridTemplateColumns: `${DAY_COL_PX}px repeat(${TOTAL_H}, minmax(${COL_MIN_PX}px, 1fr))` }}>
              <div />
              {HOURS.map((h) => (
                <div key={h} className="text-center text-[0.6rem] font-semibold text-gray-400">{h}:00</div>
              ))}
            </div>

            {/* Filas de días */}
            <div className="flex flex-1 flex-col gap-1 min-h-0">
              {DAYS_SHORT.map((dayName, di) => {
                const date  = weekDates[di];
                const today = isToday(date);

                const dayEvts = externalEvents.filter((ev) =>
                  ev.startAt
                    ? isSameLocalDate(new Date(ev.startAt), date)
                    : ev.day === di,
                );

                const { own, friend } = splitEvents(dayEvts);

                return (
                  <div key={di} className="grid"
                    style={{
                      gridTemplateColumns: `${DAY_COL_PX}px repeat(${TOTAL_H}, minmax(${COL_MIN_PX}px, 1fr))`,
                      minHeight: hasFriendEvents ? "52px" : "36px",
                      flex: `1 0 ${hasFriendEvents ? "52px" : "36px"}`,
                    }}
                  >
                    {/* Columna día */}
                    <div className="flex flex-col items-center justify-center gap-0.5 pr-1">
                      <span className="text-[0.52rem] font-bold uppercase tracking-wide text-gray-400">{dayName}</span>
                      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[0.6rem] font-bold"
                        style={today ? { background: "#6d28d9", color: "#fff" } : { color: "#374151" }}>
                        {date?.getDate()}
                      </span>
                    </div>

                    {/* Área de eventos */}
                    <div className="relative rounded-md overflow-hidden bg-gray-50"
                      style={{ gridColumn: `2 / ${TOTAL_H + 2}` }}>

                      {/* Líneas verticales de horas */}
                      {HOURS.map((_, si) => (
                        <div key={si} className="absolute top-0 bottom-0 border-r border-gray-200"
                          style={{ left: `${(si / TOTAL_H) * 100}%` }} />
                      ))}

                      {hasFriendEvents && (
                        <>
                          {/* Carril superior: mis eventos */}
                          <div className="absolute left-0 right-0" style={{ top: 0, height: laneH }}>
                            {own.map((ev, ei) => (
                              <EventBar key={`own-${ei}`} ev={ev} totalH={TOTAL_H} startH={START_H} />
                            ))}
                          </div>

                          {/* Separador */}
                          <div className="absolute left-0 right-0 bg-gray-200" style={{ top: "50%", height: "1px" }} />

                          {/* Carril inferior: eventos del amigo */}
                          <div className="absolute left-0 right-0" style={{ top: "calc(50% + 1px)", height: laneH }}>
                            {friend.map((ev, ei) => (
                              <EventBar key={`frd-${ei}`} ev={ev} totalH={TOTAL_H} startH={START_H} />
                            ))}
                          </div>
                        </>
                      )}

                      {/* Sin amigo: carril único */}
                      {!hasFriendEvents && own.map((ev, ei) => (
                        <EventBar key={`ev-${ei}`} ev={ev} totalH={TOTAL_H} startH={START_H} />
                      ))}
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