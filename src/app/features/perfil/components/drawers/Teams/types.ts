import { User } from "../../../types/profile";

export type TeamSummary = {
  id: string;
  name: string;
  membersCount: number;
  userRole?: string;
};

export type TeamMembersState = {
  loading: boolean;
  error?: string;
  members: User[];
};

export type CreateTeamPayload = {
  name: string;
  description: string;
  memberEIds: string[];
};