"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/app/shared/socket/socket.context";
import type {
  TeamPublicUpdate,
  TeamMembersUpdate,
} from "@/app/shared/socket/socket.context";

import { groupsApi } from "./api";
import type { CreateGroupDto, UpdateGroupDto, GroupMembersDto, WorkGroup, WorkGroupMembers } from "./types";

export const groupsKeys = {
  all: ["groups"] as const,

  lists: () => [...groupsKeys.all, "list"] as const,

  me: () => [...groupsKeys.all, "me"] as const,

  detail: (groupId: number) =>
    [...groupsKeys.all, "detail", groupId] as const,
};

export function useGroups() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: groupsKeys.lists(),
    queryFn: groupsApi.getAll,
  });

  useEffect(() => {
    function onTeamPublicUpdate(msg: TeamPublicUpdate) {
      if (msg.type === "team.updated") {
        queryClient.setQueryData<WorkGroup[]>(groupsKeys.lists(), (prev) => {
          if (!prev) return prev;
          return prev.map((g) =>
            g.id === msg.payload.id ? { ...g, ...msg.payload } : g,
          );
        });
        return;
      }

      if (msg.type === "team.deleted") {
        queryClient.setQueryData<WorkGroup[]>(groupsKeys.lists(), (prev) => {
          if (!prev) return prev;
          return prev.filter((g) => g.id !== msg.payload.teamId);
        });
        queryClient.removeQueries({
          queryKey: groupsKeys.detail(msg.payload.teamId),
        });
      }
    }

    socket.on("teamPublicUpdate", onTeamPublicUpdate);
    return () => {
      socket.off("teamPublicUpdate", onTeamPublicUpdate);
    };
  }, [socket, queryClient]);

  return query;
}

export function useMyGroups() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: groupsKeys.me(),
    queryFn: groupsApi.getMyGroups,
  });

  useEffect(() => {
    function onTeamPublicUpdate(msg: TeamPublicUpdate) {
      if (msg.type === "team.updated") {
        queryClient.setQueryData<WorkGroup[]>(groupsKeys.me(), (prev) => {
          if (!prev) return prev;
          return prev.map((g) =>
            g.id === msg.payload.id ? { ...g, ...msg.payload } : g,
          );
        });
        return;
      }

      if (msg.type === "team.deleted") {
        queryClient.setQueryData<WorkGroup[]>(groupsKeys.me(), (prev) => {
          if (!prev) return prev;
          return prev.filter((g) => g.id !== msg.payload.teamId);
        });
      }
    }

    socket.on("teamPublicUpdate", onTeamPublicUpdate);
    return () => {
      socket.off("teamPublicUpdate", onTeamPublicUpdate);
    };
  }, [socket, queryClient]);

  return query;
}

export function useGroup(groupId?: number) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: groupsKeys.detail(groupId ?? 0),
    queryFn: () => groupsApi.getById(groupId!),
    enabled: groupId != null && groupId > 0,
  });

  useEffect(() => {
    if (!groupId || groupId <= 0) return;

    socket.emit("joinTeamRoom", groupId);

    function onTeamMembersUpdate(msg: TeamMembersUpdate) {
      if (msg.payload.id !== groupId) return;

      if (
        msg.type === "team.updated" ||
        msg.type === "team.memberAdded" ||
        msg.type === "team.memberRemoved"
      ) {
        queryClient.setQueryData<WorkGroupMembers>(
          groupsKeys.detail(groupId),
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              ...msg.payload,
              // members viene en TeamMembersWS como array de objetos con eId/name/email/role
              // lo mapeamos al tipo User del shared
              users: msg.payload.members?.map((m) => ({
                eId: m.eId,
                name: m.name,
                email: m.email,
                roleName: m.role,
                status: "offline" as const,
              })) ?? prev.users,
            };
          },
        );
      }
    }

    socket.on("teamMembersUpdate", onTeamMembersUpdate);
    return () => {
      socket.off("teamMembersUpdate", onTeamMembersUpdate);
      socket.emit("leaveTeamRoom", groupId);
    };
  }, [socket, queryClient, groupId]);

  return query;
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
