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

  getAchievements: () =>
    authFetch<Achievement[]>("/achievements/me"),
};