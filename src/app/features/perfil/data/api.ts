import { authFetch } from "@/app/shared/data/api";

import type {
  Achievement,
  AchievementUserData,
  Friend,
  Team,
  User,
  UserProfile,
} from "@/app/features/perfil/types/profile";

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

  getTeams: (userId: string) => authFetch<Team[]>("/users/me/teams"),

  getTeamMembers: (teamId: string) =>
    authFetch<User[]>(`/teams/${teamId}/members`),

  getAchievements: (userId: string) =>
    authFetch<Achievement[]>(`/achievements/user/${userId}`),

  getAchievementsByUser: (userId: string) =>
    authFetch<AchievementUserData>(`/achievements/user/${userId}`),

  getSummary: (userId: string) => authFetch(`/achievements/${userId}/summary`),
};
