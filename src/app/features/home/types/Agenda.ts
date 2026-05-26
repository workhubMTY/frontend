// types/agenda.ts  →  src/app/types/agenda.ts
// (o donde prefieras dentro de src/)

export interface CalEvent {
  day: number;
  start: number;
  end: number;
  title: string;
  color: "purple" | "blue" | "green" | "red";
  hora: string;
  lugar: string;
  tipo: string;
}

export type EventColorKey = "purple" | "blue" | "green" | "red";

export const EVENT_COLORS: Record<EventColorKey, {
  bg: string; border: string; text: string; sub: string;
}> = {
  purple: { bg: "#E8E6F8", border: "#7F77DD", text: "#534AB7", sub: "#8B7FCC" },
  blue:   { bg: "#DDEEFE", border: "#378ADD", text: "#185FA5", sub: "#5A9BC9" },
  green:  { bg: "#D6F5E6", border: "#1D9E75", text: "#0F6E56", sub: "#3BAA80" },
  red:    { bg: "#FFE0E6", border: "#E05070", text: "#C0304A", sub: "#D06070" },
};

export const CAL_EVENTS: CalEvent[] = [
  { day: 0, start: 8, end: 9.5, title: "Standup", color: "purple", hora: "8:00–9:30", lugar: "Sala Virtual", tipo: "Reunión" },
  { day: 0, start: 11, end: 12.5, title: "Design Review", color: "blue", hora: "11:00–12:30", lugar: "ISJ03", tipo: "Review" },
  { day: 1, start: 9, end: 11, title: "Sprint Planning", color: "purple", hora: "9:00–11:00", lugar: "Sala Magna", tipo: "Planeación" },
  { day: 1, start: 14, end: 15, title: "1:1 con manager", color: "red", hora: "14:00–15:00", lugar: "Oficina Dir.", tipo: "1:1" },
  { day: 2, start: 8, end: 9, title: "Standup", color: "purple", hora: "8:00–9:00", lugar: "Sala Virtual", tipo: "Reunión" },
  { day: 2, start: 10, end: 12, title: "Workshop UX", color: "green", hora: "10:00–12:00", lugar: "Sala UX", tipo: "Workshop" },
  { day: 2, start: 15, end: 16.5, title: "Demo día", color: "blue", hora: "15:00–16:30", lugar: "Auditorio", tipo: "Demo" },
  { day: 3, start: 9, end: 10, title: "Standup", color: "purple", hora: "9:00–10:00", lugar: "Sala Virtual", tipo: "Reunión" },
  { day: 3, start: 13, end: 14, title: "Revisión QA", color: "red", hora: "13:00–14:00", lugar: "ISJ04", tipo: "QA" },
  { day: 4, start: 8, end: 9, title: "Standup", color: "purple", hora: "8:00–9:00", lugar: "Sala Virtual", tipo: "Reunión" },
  { day: 4, start: 11, end: 13, title: "Retrospectiva", color: "green", hora: "11:00–13:00", lugar: "Sala 2", tipo: "Retro" },
];