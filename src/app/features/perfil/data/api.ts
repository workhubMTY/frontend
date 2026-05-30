import { authFetch } from "@/app/shared/data/api";

import type {
  Achievement,
  AchievementUserData,
  Friend,
  Team,
  User,
  UserProfile,
} from "@/app/features/perfil/types/profile";


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

  getUsers: (query?: string, excludeId?: string) => {
    const params = new URLSearchParams();

    if (query) {
      params.set("query", query);
    }

    if (excludeId) {
      params.set("excludeId", excludeId);
    }

    const queryString = params.toString();

    return authFetch<User[]>(`/users${queryString ? `?${queryString}` : ""}`);
  },
  getFriends: () => authFetch<Friend[]>("/users/me/friendships"),

  getTeams: () => authFetch<Team[]>("/users/teams/me"),

  createTeam: (payload: any) => authFetch<void>("/teams", {
    method: "POST",
    body: JSON.stringify(payload),
  }),


  getTeamMembers: (teamId: string) =>
    authFetch<User[]>(`/teams/${teamId}/members`),

  getAchievements: (userId: string) =>
    authFetch<Achievement[]>(`/achievements/user/${userId}`),

  getAchievementsByUser: (userId: string) =>
    authFetch<AchievementUserData>(`/achievements/user/${userId}`),

  getSummary: (userId: string) => authFetch(`/achievements/${userId}/summary`),
};
