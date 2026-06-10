import { authFetch } from "@/app/shared/data/api";
import type { Friendship, FriendRequest, CreateFriendRequestDto, AcceptFriendRequestDto, RemoveRelationDto } from "./types";
import { SentFriendRequest } from "@/app/features/perfil/components/drawers/Friends/types";

export const friendshipsApi = {
  getAll: () => authFetch<Friendship[]>("/friendships"),

  create: (payload: { userLow: string; userHigh: string; source: string }) =>
    authFetch<Friendship>("/friendships", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  remove: (payload: RemoveRelationDto) =>
    authFetch<void>(`/friendships/${payload}`, {
      method: "DELETE",
    }),

  getReceivedRequests: () =>
    authFetch<FriendRequest[]>("/friendships/requests/received"),

  getSentRequests: () =>
    authFetch<SentFriendRequest[]>("/friendships/requests/sent"),

  createRequest: (payload: CreateFriendRequestDto) =>
    authFetch<FriendRequest>("/friendships/requests", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  acceptRequest: (payload: AcceptFriendRequestDto) =>
    authFetch<Friendship>("/friendships/requests/received", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  cancelSentRequest: (toUser: string) =>
    authFetch<void>(`/friendships/requests/sent/${toUser}`, {
      method: "DELETE",
    }),

  rejectReceivedRequest: (fromUser: string) =>
    authFetch<void>(`/friendships/requests/received/${fromUser}`, {
      method: "DELETE",
    }),
};
