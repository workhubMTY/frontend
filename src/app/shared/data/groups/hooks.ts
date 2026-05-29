"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupsApi } from "./api";
import type { CreateGroupDto, UpdateGroupDto, GroupMembersDto } from "./types";

export const groupsKeys = {
  all: ["groups"] as const,

  lists: () => [...groupsKeys.all, "list"] as const,

  me: () => [...groupsKeys.all, "me"] as const,

  detail: (groupId: number) =>
    [...groupsKeys.all, "detail", groupId] as const,
};

export function useGroups() {
  return useQuery({
    queryKey: groupsKeys.lists(),
    queryFn: groupsApi.getAll,
  });
}

export function useMyGroups() {
  return useQuery({
    queryKey: groupsKeys.me(),
    queryFn: groupsApi.getMyGroups,
  });
}

export function useGroup(groupId?: number) {
  return useQuery({
    queryKey: groupsKeys.detail(groupId ?? 0),
    queryFn: () => groupsApi.getById(groupId!),
    enabled: groupId != null && groupId > 0,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGroupDto) => groupsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupsKeys.me() });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: number;
      payload: UpdateGroupDto;
    }) => groupsApi.update(groupId, payload),
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
    },
  });
}

export function useRemoveGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number) => groupsApi.remove(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
    },
  });
}

export function useAddGroupMembers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: number;
      payload: GroupMembersDto;
    }) => groupsApi.addMembers(groupId, payload),
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
    },
  });
}

export function useRemoveGroupMembers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: number;
      payload: GroupMembersDto;
    }) => groupsApi.removeMembers(groupId, payload),
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
    },
  });
}
