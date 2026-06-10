import { UserViewModel } from "@/app/shared/data/users/types";

export type HomeAgendaFilter =
  | "all"
  | "meeting"
  | "coworking"
  | "parking"
  | "events";

export type HomeAgendaViewMode = "agenda" | "list";

export type HomeAgendaDay = {
  id: string;
  date: Date;
  dayLabel: string;
  dayNumber: number;
  monthLabel: string;
  isToday: boolean;
};

export type HomeAgendaOwner =
  | {
      kind: "me";
      eId: string;
      name: string;
      avatarUrl?: string | null;
      raw?: unknown;
    }
  | {
      kind: "friend";
      eId: string;
      name: string;
      avatarUrl?: string | null;
      raw: UserViewModel;
    };