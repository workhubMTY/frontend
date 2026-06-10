"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/app/shared/socket/socket.context";
import type {
  TeamPublicUpdate,
  TeamMembersUpdate,
} from "@/app/shared/socket/socket.context";
import { User } from "@/app/features/perfil/types/profile";

import { perfilApi } from "../api";
import { UpdateTeamPayload } from "../types";

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      payload,
    }: {
      teamId: string;
      payload: UpdateTeamPayload;
    }) => perfilApi.updateTeam(teamId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({
        queryKey: ["team-members", variables.teamId],
      });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => perfilApi.deleteTeam(teamId),

    onMutate: async (teamId) => {
      await queryClient.cancelQueries({ queryKey: ["teams"] });

      const previousTeams = queryClient.getQueryData(["teams"]);

      queryClient.setQueryData(["teams"], (currentTeams: unknown) => {
        if (!Array.isArray(currentTeams)) return currentTeams;

        return currentTeams.filter((team) => team.id !== teamId);
      });

      queryClient.removeQueries({
        queryKey: ["team-members", teamId],
      });

      return { previousTeams };
    },

    onError: (_error, _teamId, context) => {
      if (context?.previousTeams) {
        queryClient.setQueryData(["teams"], context.previousTeams);
      }
    },

    onSettled: (_data, _error, teamId) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });

      queryClient.removeQueries({
        queryKey: ["team-members", teamId],
      });
    },
  });
}

type UseTeamsOptions = {
  enabled?: boolean;
};

export function useTeams(options?: UseTeamsOptions) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: ["teams"],
    queryFn: () => {
      return perfilApi.getTeams();
    },
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    function onTeamPublicUpdate(msg: TeamPublicUpdate) {
      if (msg.type === "team.updated") {
        queryClient.setQueryData<any[]>(["teams"], (prev) => {
          if (!prev) return prev;
          return prev.map((t: any) =>
            t.id === msg.payload.id ? { ...t, ...msg.payload } : t,
          );
        });
        return;
      }

      if (msg.type === "team.deleted") {
        queryClient.setQueryData<any[]>(["teams"], (prev) => {
          if (!prev) return prev;
          return prev.filter((t: any) => t.id !== msg.payload.teamId);
        });
        queryClient.removeQueries({
          queryKey: ["team-members", String(msg.payload.teamId)],
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

type UseTeamMembersOptions = {
  enabled?: boolean;
};

export function useTeamMembers(
  teamId?: string | null,
  options?: UseTeamMembersOptions,
) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: ["team-members", teamId],
    queryFn: () => {
      if (!teamId) {
        throw new Error("teamId is required to fetch team members.");
      }

      return perfilApi.getTeamMembers(teamId);
    },
    enabled: Boolean(teamId) && (options?.enabled ?? true),
  });

  useEffect(() => {
    if (!teamId) return;

    const numericId = Number(teamId);

    socket.emit("joinTeamRoom", numericId);

    function onTeamMembersUpdate(msg: TeamMembersUpdate) {
      if (String(msg.payload.id) !== teamId) return;

      if (
        msg.type === "team.updated" ||
        msg.type === "team.memberAdded" ||
        msg.type === "team.memberRemoved"
      ) {
        queryClient.setQueryData<User[]>(["team-members", teamId], (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            ...msg.payload,
          };
        });
      }
    }

    socket.on("teamMembersUpdate", onTeamMembersUpdate);
    return () => {
      socket.off("teamMembersUpdate", onTeamMembersUpdate);
      socket.emit("leaveTeamRoom", numericId);
    };
  }, [socket, queryClient, teamId]);

  return query;
}

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: perfilApi.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}