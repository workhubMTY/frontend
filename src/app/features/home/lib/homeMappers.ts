import {
  formatHourRange,
  toAgendaDay,
  toDate,
  toDecimalHour,
} from "@/app/features/home/utils/utils";

import type {
  ReservationEvent,
  ReservationSummary,
} from "@/app/features/cubiculos/data/types";

import type {
  EventoGeneral,
  Invitacion,
  Reserva,
} from "@/app/features/home/types/types";

export const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export function getEventType(evt: ReservationEvent): EventoGeneral["tipo"] {
  const text = `${evt.title} ${evt.description ?? ""}`.toLowerCase();

  if (text.includes("holiday") || text.includes("festivo")) return "Festivo";
  if (text.includes("social") || text.includes("happy")) return "Social";

  return "Corporativo";
}

export function getEventIcon(tipo: EventoGeneral["tipo"]) {
  if (tipo === "Festivo") return "🎉";
  if (tipo === "Social") return "🤝";
  return "🏢";
}

export function mapReservationToReserva(res: ReservationSummary): Reserva {
  const start = toDate(res.start_time);
  const end = toDate(res.end_time);

  return {
    id: res.id,
    titulo: "Reservación",
    hora: formatHourRange(res.start_time, res.end_time),
    lugar: `${res.reservable_name} · ${res.floor_name}`,
    estado: res.status === "ACCEPTED" ? "Confirmada" : "Pendiente",
    day: toAgendaDay(start),
    start: toDecimalHour(start),
    end: toDecimalHour(end),
  };
}

export function mapPendingReservationToInvitacion(
  res: ReservationSummary,
): Invitacion {
  const start = toDate(res.start_time);
  const end = toDate(res.end_time);

  return {
    nombre: "Invitación de reservación",
    sala: `${res.reservable_name} · ${res.floor_name}`,
    hora: formatHourRange(res.start_time, res.end_time),
    tipo: "PENDING",
    day: toAgendaDay(start),
    start: toDecimalHour(start),
    end: toDecimalHour(end),
  };
}

export function mapEventToEventoGeneral(evt: ReservationEvent): EventoGeneral {
  const start = toDate(evt.start_time);
  const end = toDate(evt.end_time);
  const tipo = getEventType(evt);

  return {
    titulo: evt.title,
    descripcion: evt.description || "Sin descripción",
    tipo,
    icono: getEventIcon(tipo),
    day: toAgendaDay(start),
    start: toDecimalHour(start),
    end: toDecimalHour(end),
  };
}

export function getEmptyEventoGeneral(): EventoGeneral {
  return {
    titulo: "Sin eventos",
    descripcion: "No hay eventos cargados",
    tipo: "Corporativo",
    icono: "🏢",
    day: 0,
    start: 0,
    end: 0,
  };
}