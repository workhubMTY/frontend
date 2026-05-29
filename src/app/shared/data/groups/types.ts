import type { User } from "../users/types";

export type WorkGroup = {
  id: number;
  name: string;
  description: string | null;
  memberCount?: number;
};

export type WorkGroupMembers = WorkGroup & {
  users: User[];
};

export type CreateGroupDto = {
  name: string;
  description?: string;
  memberEIds: string[];
};

export type UpdateGroupDto = {
  name?: string;
  description?: string;
};

export type GroupMembersDto = {
  memberEIds: string[];
};