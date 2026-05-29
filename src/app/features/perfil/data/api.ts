import { authFetch } from "@/app/shared/data/api";

import type {
  Achievement,
  AchievementUserData,
  Friend,
  Team,
  UserProfile,
} from "@/app/features/perfil/types/profile";

export const perfilApi = {
  getProfile: () => authFetch<UserProfile>("/users/profile/me"),

  getFriends: () => authFetch<Friend[]>("/users/me/friendships"),

  getTeams: (userId: string) => authFetch<Team[]>("/users/me/teams"),

  getAchievements: (userId: string) =>
    authFetch<Achievement[]>(`/achievements/user/${userId}`),

  getAchievementsByUser: (userId: string) =>
    authFetch<AchievementUserData>(`/achievements/user/${userId}`),

  getSummary: (userId: string) => authFetch(`/achievements/${userId}/summary`),
};
