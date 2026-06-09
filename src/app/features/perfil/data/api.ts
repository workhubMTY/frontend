import { authFetch } from "@/app/shared/data/api";

import type {
  Achievement,
  AchievementUserData,
  Friend,
  Team,
  User,
  UserProfile,
} from "@/app/features/perfil/types/profile";
import {
  SendFriendRequestsPayload,
  SentFriendRequest,
} from "../components/drawers/Friends/types";
import { UpdateTeamPayload } from "./types";
// export const parkingReservationsApi = {
//   create: (payload: CreateParkingReservation) =>
//     authFetch<ParkingReservation>(`${BASE}/reservations`, {
//       method: "POST",
//       body: JSON.stringify(payload),
//     }),

//   list: (query?: ListReservationsQuery) => {
//     const qs = query
//       ? `?${toSearchParams(query as Record<string, unknown>)}`
//       : "";
//     return authFetch<ListReservationsResponse>(
//       `${BASE}/reservations/${qs}`
//     );
//   },

//   getBuckets: (query: ReservationBucketsQuery) => {
//     const qs = toSearchParams(query as Record<string, unknown>);
//     return authFetch<ReservationBucketsResponse>(
//       `${BASE}/reservations/buckets?${qs}`
//     );
//   },

//   getDetail: (id: number) =>
//     authFetch<ReservationDetailResponse>(`${BASE}/reservations/${id}`),

//   patchAttendance: (id: number, payload: PatchAttendance) =>
//     authFetch<ParkingReservation>(`${BASE}/reservations/${id}/attendance`, {
//       method: "PATCH",
//       body: JSON.stringify(payload),
//     }),

//   cancel: (id: number) =>
//     authFetch<ParkingReservation>(`${BASE}/reservations/${id}`, {
//       method: "DELETE",
//     }),
// } as const;

export const perfilApi = {
  getProfile: () => authFetch<UserProfile>("/users/profile/me"),
  getUsers: (query?: string, excludeIds: string[] = []) => {
    const params = new URLSearchParams();

    if (query) params.set("query", query);

    excludeIds.forEach((id) => {
      params.append("excludeId", id);
    });

    return authFetch<User[]>(`/users?${params.toString()}`);
  },

  getFriends: () => authFetch<Friend[]>("/users/me/friendships"),

  getPotentialFriends: (query?: string) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    return authFetch<User[]>(
      `/users/me/potential-friends?${params.toString()}`,
    );
  },

  getSentRequests: () =>
    authFetch<SentFriendRequest[]>(`/friendships/requests/sent`),

  deleteFriendRequest: (userId: string) => {
    return authFetch(`/friendships/requests/sent/${userId}`, {
      method: "DELETE",
    });
  },

  removeFriend: (friendId: string) => {
    return authFetch(`/friendships/${friendId}`, {
      method: "DELETE",
    });
  },

  sendFriendRequest: (payload: SendFriendRequestsPayload) =>
    authFetch(`/friendships/requests`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getTeams: () => authFetch<Team[]>("/teams/me"),

  createTeam: (payload: any) =>
    authFetch<void>("/teams", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteTeam: (teamId: string) =>
    authFetch<void>(`/teams/${teamId}`, {
      method: "DELETE",
    }),

  getTeamMembers: (teamId: string) =>
    authFetch<User[]>(`/teams/${teamId}/members`),

  getAchievements: (userId: string) =>
    authFetch<Achievement[]>(`/achievements/user/${userId}`),

  getAchievementsByUser: (userId: string) =>
    authFetch<AchievementUserData>(`/achievements/user/${userId}`),

  updateTeam: (teamId: string, payload: UpdateTeamPayload) =>
    authFetch<Team>(`/teams/${teamId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  getSummary: (userId: string) => authFetch(`/achievements/${userId}/summary`),
};
