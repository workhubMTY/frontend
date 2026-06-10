// src/app/features/home/types/homeAgenda.ts

export type HomeAgendaFilter =
  | "all"
  | "meeting"
  | "coworking"
  | "parking"
  | "events";

export type HomeAgendaDay = {
  id: string;
  date: Date;
  dayLabel: string;
  dayNumber: number;
  monthLabel: string;
  isToday: boolean;
};