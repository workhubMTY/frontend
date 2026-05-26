export type ReservationSummary = {
  id: number;
  reservable_id: number;
  reservable_name: string;
  floor_id: number;
  floor_name: string;
  start_time: string;
  end_time: string;
  checked_in: boolean;
};

export type UserReservationSummary = {
  user_id: string;
  user_name: string;
  reservations: ReservationSummary[];
};

export type FriendReservationsSummary = UserReservationSummary[];

export interface Invitacion {
  nombre: string;
  sala: string;
  hora: string;
  tipo: string;
  day: number;
  start: number;
  end: number;
}
export interface DiaInvitaciones {
  dia: string;
  dayIndex: number;
  items: Invitacion[];
}
export interface Reserva {
  id: number;
  titulo: string;
  hora: string;
  lugar: string;
  estado: "Confirmada" | "Pendiente";
  day: number;
  start: number;
  end: number;
}
export interface Persona {
  id: string;
  initials: string;
  name: string;
  role: string;
  reservas: Reserva[];
}
export interface EventoGeneral {
  titulo: string;
  descripcion: string;
  tipo: "Festivo" | "Corporativo" | "Social";
  icono: string;
  day: number;
  start: number;
  end: number;
}

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

export const EVENT_COLORS: Record<
  EventColorKey,
  {
    bg: string;
    border: string;
    text: string;
    sub: string;
  }
> = {
  purple: { bg: "#E8E6F8", border: "#7F77DD", text: "#534AB7", sub: "#8B7FCC" },
  blue: { bg: "#DDEEFE", border: "#378ADD", text: "#185FA5", sub: "#5A9BC9" },
  green: { bg: "#D6F5E6", border: "#1D9E75", text: "#0F6E56", sub: "#3BAA80" },
  red: { bg: "#FFE0E6", border: "#E05070", text: "#C0304A", sub: "#D06070" },
};

export interface EventoGeneral {
  titulo: string;
  descripcion: string;
  tipo: "Festivo" | "Corporativo" | "Social";
  icono: string;
  day: number;
  start: number;
  end: number;
}
