import { authFetch } from "@/app/shared/data/api";
import type {
  WorkGroup,
  WorkGroupMembers,
  CreateGroupDto,
  UpdateGroupDto,
  GroupMembersDto,
} from "./types";

export const groupsApi = {
  getAll: () =>
    authFetch<WorkGroup[]>("/users/groups"),

  getMyGroups: () =>
    authFetch<WorkGroup[]>("/users/groups/me"),

  getById: (groupId: number) =>
    authFetch<WorkGroupMembers>(`/users/groups/${groupId}`),

  create: (payload: CreateGroupDto) =>
    authFetch<WorkGroupMembers>("/users/groups", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (groupId: number, payload: UpdateGroupDto) =>
    authFetch<WorkGroupMembers>(`/users/groups/${groupId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (groupId: number) =>
    authFetch<void>(`/users/groups/${groupId}`, {
      method: "DELETE",
    }),

  addMembers: (groupId: number, payload: GroupMembersDto) =>
    authFetch<WorkGroupMembers>(`/users/groups/${groupId}/members`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  removeMembers: (groupId: number, payload: GroupMembersDto) =>
    authFetch<WorkGroupMembers>(`/users/groups/${groupId}/members`, {
      method: "DELETE",
      body: JSON.stringify(payload),
    }),
};
