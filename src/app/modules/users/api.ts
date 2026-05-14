import { authFetch } from "@/lib/api";
import type { User, UserProfile, CreateUserDto } from "./types";

export const usersApi = {
  getAll: () => authFetch<User[]>("/users"),

  getById: (eId: string) => authFetch<User>(`/users/${eId}`),

  getMeFriendships: () => authFetch<User[]>("/users/me/friendships"),

  getFriendships: (eId: string) => authFetch<User[]>(`/users/${eId}/friendships`),

  searchByName: (name: string) => authFetch<User[]>(`/users/name/${name}`),

  getMyProfile: () => authFetch<UserProfile>("/users/profile/me"),

  getProfile: (eId: string) => authFetch<UserProfile>(`/users/profile/${eId}`),

  create: (user: CreateUserDto) =>
    authFetch<User>("/users/create", {
      method: "POST",
      body: JSON.stringify(user),
    }),
};
