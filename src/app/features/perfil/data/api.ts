import { authFetch } from "@/app/shared/data/api";
import type { Achievement, Friend, UserProfile } from "./perfil.types";

export const perfilApi = {
  getProfile: () => authFetch<UserProfile>("/users/profile"),

  getFriends: () => authFetch<Friend[]>("/friendships/me"),

  getAchievements: () => authFetch<Achievement[]>("/achievements/me"),
};
