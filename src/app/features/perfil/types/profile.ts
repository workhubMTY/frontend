export type User = {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
};

export type Friend = User;

export type Team = {
  id: string;
  name: string;
  membersCount: number;
};
export type DetailedTeam = Team & {
  members: User[];
};
export type AchievementStatus = "completed" | "in_progress" | "locked";

export type AchievementProgress = {
  current: number;
  target: number;
  status: AchievementStatus;
};

export type AchievementUserData = {
  name: string;
  avatarUrl?: string;
  achievements: Achievement[];
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: "users" | "network" | "flame";
  userProgress: AchievementProgress;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  stats: {
    points: number;
    streakDays: number;
    friendsCount: number;
    completedAchievements: number;
    inProgressAchievements: number;
    pendingAchievements: number;
  };
};

export type FriendSuggestion = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  status?: string;
};

// export type ProfileApiResponse = {
//   profile: UserProfile;
// };
