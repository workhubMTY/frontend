export type NotificationType =
  | "ESTACIONAMIENTO_DISPONIBLE"
  | "SALA_DISPONIBLE"
  | "UN_AMIGO_RESERVO"
  | "ESCPACIO_BLOQUEADO"
  | "ESPACIO_DESBLOQUEADO";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  expires_at: string;
  metadata?: Record<string, unknown> | null;
}

export interface FriendRequest {
  fromUser: string;
  fromName: string;
  sentAt: string;
}
