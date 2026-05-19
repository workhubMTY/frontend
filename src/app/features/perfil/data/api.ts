import { authFetch } from "@/lib/api";

import type {
  Achievement,
  Friend,
  UserProfile,
} from "@/app/features/perfil/types/profile";

export const perfilApi = {
  getProfile: () =>
    authFetch<UserProfile>("/users/profile"),

  getFriends: () =>
    authFetch<Friend[]>("/friendships/me"),
  
  getAchievements: (userId: string) =>
   authFetch<Achievement[]>(`/achievements/${userId}/list`),

  getAchievementsByUser: (userId: string) =>
    authFetch<Achievement[]>(`/achievements/${userId}/list`),

  getSummary: (userId: string) =>
    authFetch(`/achievements/${userId}/summary`),

};

