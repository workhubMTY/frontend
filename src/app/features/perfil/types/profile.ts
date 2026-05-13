export type Friend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type Team = {
  id: string;
  name: string;
  initials: string;
  membersCount: number;
  role: string;
};

export type AchievementStatus = "completed" | "in_progress" | "locked";

export type AchievementProgress = {
  current: number;
  target: number;
  status: AchievementStatus;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: "users" | "network" | "flame";
  userProgress: AchievementProgress;
  friendsProgress: Record<string, AchievementProgress>;
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
  friends: Friend[];
  teams: Team[];
  achievements: Achievement[];
};

export type ProfileApiResponse = {
  profile: UserProfile;
};
