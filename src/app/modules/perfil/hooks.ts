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
    queryKey: ["friends"],
    queryFn: () => perfilApi.getFriends(),
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: () => perfilApi.getAchievements(),
  });
}