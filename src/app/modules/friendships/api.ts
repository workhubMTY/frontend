import { authFetch } from "@/lib/api";
import type {
  Friendship,
  FriendRequest,
  CreateFriendRequestDto,
  AcceptFriendRequestDto,
  RemoveRelationDto,
} from "./types";

export const friendshipsApi = {
  getAll: () => authFetch<Friendship[]>("/friendships"),

  create: (payload: { userLow: string; userHigh: string; source: string }) =>
    authFetch<Friendship>("/friendships", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  remove: (payload: RemoveRelationDto) =>
    authFetch<void>("/friendships", {
      method: "DELETE",
      body: JSON.stringify(payload),
    }),

  getReceivedRequests: () =>
    authFetch<FriendRequest[]>("/friendships/requests/received"),

  getSentRequests: () =>
    authFetch<FriendRequest[]>("/friendships/requests/sent"),

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
    authFetch<void>("/friendships/requests/sent", {
      method: "DELETE",
      body: JSON.stringify({ toUser }),
    }),

  rejectReceivedRequest: (fromUser: string) =>
    authFetch<void>("/friendships/requests/received", {
      method: "DELETE",
      body: JSON.stringify({ fromUser }),
    }),
};
