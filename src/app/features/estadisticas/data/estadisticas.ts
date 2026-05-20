export type Period = "dia" | "semana" | "mes";

export interface EstadisticasBucket {
  period_label: string;
  total: number;
  attended: number;
  missed: number;
  attendance_rate: number;
}

export interface ReservationBucket {
  period_label: string;
  total: number;
  checked_in: number;
  not_checked_in: number;
}