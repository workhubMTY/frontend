import type { ParkingReservation, OfficeReservation } from "../data/types";
import type { AgendaFilter } from "../hooks/unused/useHomePage";
import type { ExternalEvent } from "../types/unused/Agenda";

const PALETTE: Record<AgendaFilter, {
  own:    { bg: string; border: string; text: string; sub: string };
  friend: { bg: string; border: string; text: string; sub: string };
}> = {
  juntas: {
    own:    { bg: "#EDE9FE", border: "#7C3AED", text: "#4C1D95", sub: "#6D28D9" },
    friend: { bg: "#F5F3FF", border: "#C4B5FD", text: "#7C3AED", sub: "#A78BFA" },
  },
  coworking: {
    own:    { bg: "#DBEAFE", border: "#2563EB", text: "#1E3A8A", sub: "#1D4ED8" },
    friend: { bg: "#EFF6FF", border: "#93C5FD", text: "#2563EB", sub: "#60A5FA" },
  },
  estacionamientos: {
    own:    { bg: "#D1FAE5", border: "#059669", text: "#064E3B", sub: "#047857" },
    friend: { bg: "#ECFDF5", border: "#6EE7B7", text: "#059669", sub: "#34D399" },
  },
  eventos: {
    own:    { bg: "#FEF3C7", border: "#D97706", text: "#78350F", sub: "#B45309" },
    friend: { bg: "#FFFBEB", border: "#FCD34D", text: "#D97706", sub: "#F59E0B" },
  },
};

function isoToLocalHour(iso: string): number {
  const d = new Date(iso);
  return d.getHours() + d.getMinutes() / 60;
}

function isoToLocalWeekday(iso: string): number {
  const d = new Date(iso);
  const jsDay = d.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function parkingToEvents(
  reservations: ParkingReservation[],
  isFriend: boolean,
): ExternalEvent[] {
  const colors = isFriend ? PALETTE.estacionamientos.friend : PALETTE.estacionamientos.own;
  return reservations.map((r) => {
    const startH = isoToLocalHour(r.start_time);
    let   endH   = isoToLocalHour(r.end_time);
    if (endH <= startH) endH = 18;
    return {
      kind:      "holiday" as const,
      day:       isoToLocalWeekday(r.start_time),
      start:     startH,
      end:       endH,
      startAt:   r.start_time,
      label:     r.parking_lot?.name ?? "Estacionamiento",
      sublabel:  undefined,
      _colors:   colors,
      _category: "estacionamientos" as AgendaFilter,
      _isFriend: isFriend,
    } as any;
  });
}

export function officeToEvents(
  reservations: OfficeReservation[],
  isFriend: boolean,
): ExternalEvent[] {
  return reservations.map((r) => {
    const realParticipants = (r.participants ?? []).filter((p) => p.user_id !== null).length;
    const isJunta  = (r.reservable?.capacity ?? 1) > 1 || realParticipants > 1;
    const category: AgendaFilter = isJunta ? "juntas" : "coworking";
    const colors   = isFriend ? PALETTE[category].friend : PALETTE[category].own;
    const startH   = isoToLocalHour(r.start_time);
    let   endH     = isoToLocalHour(r.end_time);
    if (endH <= startH) endH = 18;
    return {
      kind:      "friend" as const,
      day:       isoToLocalWeekday(r.start_time),
      start:     startH,
      end:       endH,
      startAt:   r.start_time,
      label:     r.reservable?.name ?? (isJunta ? "Junta" : "Coworking"),
      sublabel:  r.description || undefined,
      _colors:   colors,
      _category: category,
      _isFriend: isFriend,
    } as any;
  });
}

export function filterEvents(events: ExternalEvent[], activeFilters: AgendaFilter[]): ExternalEvent[] {
  if (activeFilters.length === 0) return [];
  return events.filter((ev) => activeFilters.includes((ev as any)._category));
}