import { NotificationType, Notification, FriendRequest} from '../../types/notificationInterfaces'

const BASE = process.env.NEXT_PUBLIC_API_URL;

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

export const api = {
  getNotifications: (unreadOnly = false) =>
    apiFetch<Notification[]>(`/notifications/me?unread_only=${unreadOnly}&limit=30`),
  getUnreadCount: () =>
    apiFetch<{ count: number }>("/notifications/me/unread-count"),
  markRead: (ids: number[]) =>
    apiFetch("/notifications/me/read", { method: "PATCH", body: JSON.stringify({ ids }) }),
  markAllRead: () =>
    apiFetch("/notifications/me/read-all", { method: "PATCH" }),
  deleteNotifications: (ids: number[]) =>
    apiFetch("/notifications/me", { method: "DELETE", body: JSON.stringify({ ids }) }),
  deleteAll: () =>
    apiFetch("/notifications/me/all", { method: "DELETE" }),

  // endpoints de solictudes de amistad
  getFriendRequests: () =>
    apiFetch<FriendRequest[]>("/friendships/requests/received"),
  acceptRequest: (fromUser: string) =>
    apiFetch("friendships/requests/received", {
      method: "POST",
      body: JSON.stringify({ fromUser }),
    }),
  rejectRequest: (userId: string) =>
    apiFetch("/friendships/requests/received", {
      method: "DELETE",
      body: JSON.stringify({ userId }),
    }),
};

export const TYPE_ICON: Record<NotificationType, string> = {
  ESTACIONAMIENTO_DISPONIBLE: "local_parking",
  SALA_DISPONIBLE: "meeting_room",
  UN_AMIGO_RESERVO: "group",
  ESCPACIO_BLOQUEADO: "block",
  ESPACIO_DESBLOQUEADO: "lock_open",
};

export const TYPE_COLOR: Record<NotificationType, string> = {
  ESTACIONAMIENTO_DISPONIBLE: "#7c3aed",
  SALA_DISPONIBLE: "#0891b2",
  UN_AMIGO_RESERVO: "#059669",
  ESCPACIO_BLOQUEADO: "#dc2626",
  ESPACIO_DESBLOQUEADO: "#7c3aed",
};