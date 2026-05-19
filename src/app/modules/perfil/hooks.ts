"use client";

import { useQuery } from "@tanstack/react-query";
import { perfilApi } from "./api";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => perfilApi.getProfile(),
  });
}

export function useFriends() {
  return useQuery({
    queryKey: ["friendships"],
    queryFn: () => perfilApi.getFriends(),
  });
}

export function useAchievements(userId: string) {
  return useQuery({
    queryKey: ["achievements", userId], 
    queryFn: () => perfilApi.getAchievements(userId),
    enabled: !!userId, 
  });
}