import type { UpdateTeamPayload } from "../../../../../data/hooks/useTeams";

type BuildUpdateTeamPayloadParams = {
  originalName: string;
  nextName: string;
  originalDescription?: string | null;
  nextDescription: string;
  addedMemberEIds: Array<string | number>;
  removedMemberEIds: Array<string | number>;
};

export function buildUpdateTeamPayload({
  originalName,
  nextName,
  originalDescription,
  nextDescription,
  addedMemberEIds,
  removedMemberEIds,
}: BuildUpdateTeamPayloadParams): UpdateTeamPayload {
  const payload: UpdateTeamPayload = {};

  const normalizedOriginalName = originalName.trim();
  const normalizedNextName = nextName.trim();

  const normalizedOriginalDescription = (originalDescription ?? "").trim();
  const normalizedNextDescription = nextDescription.trim();

  if (normalizedNextName !== normalizedOriginalName) {
    payload.name = normalizedNextName;
  }

  if (normalizedNextDescription !== normalizedOriginalDescription) {
    payload.description = normalizedNextDescription;
  }

  const addMemberEIds = uniqueStringIds(addedMemberEIds);
  const removeMemberEIds = uniqueStringIds(removedMemberEIds);

  const removeSet = new Set(removeMemberEIds);

  const safeAddMemberEIds = addMemberEIds.filter(
    (memberEId) => !removeSet.has(memberEId),
  );

  if (safeAddMemberEIds.length > 0) {
    payload.addMemberEIds = safeAddMemberEIds;
  }

  if (removeMemberEIds.length > 0) {
    payload.removeMemberEIds = removeMemberEIds;
  }

  return payload;
}

function uniqueStringIds(ids: Array<string | number>): string[] {
  return Array.from(
    new Set(
      ids
        .map((id) => String(id).trim())
        .filter((id) => id.length > 0),
    ),
  );
}