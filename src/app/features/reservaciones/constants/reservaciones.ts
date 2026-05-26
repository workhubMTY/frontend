import type { TimeBlock } from "../types/reservaciones";

export const DAYS_TO_SHOW = 21;

export const timelineHours = [
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
  "23:59",
];

export const initialBlocks: TimeBlock[] = [
  {
    id: "b1",
    label: "Bloque 1",
    start: "08:00 AM",
    end: "09:30 AM",
    conflict: true,
  },
  {
    id: "b2",
    label: "Bloque 2",
    start: "02:00 PM",
    end: "04:00 PM",
    conflict: true,
  },
  {
    id: "b3",
    label: "Bloque 3",
    start: "06:00 PM",
    end: "07:30 PM",
  },
];
