import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => {
      return perfilApi.getTeams();
    },
    enabled: options?.enabled ?? true,
  });
}
type UseTeamMembersOptions = {
  enabled?: boolean;
};

export function useTeamMembers(
  teamId?: string | null,
  options?: UseTeamMembersOptions,
) {
  return useQuery({
    queryKey: ["team-members", teamId],
    queryFn: () => {
      if (!teamId) {
        throw new Error("teamId is required to fetch team members.");
      }

      return perfilApi.getTeamMembers(teamId);
    },
    enabled: Boolean(teamId) && (options?.enabled ?? true),
  });
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