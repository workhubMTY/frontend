export type User = {
  eId: string;
  name: string;
  role?: string;
  title:string;
  email: string;
  avatarUrl?: string;
};
  
export type Friend = User;

export type FriendSuggestion = Friend & {
  friendshipStatus?: null | "PENDING_SENT" | "PENDING_RECEIVED" ;
};

export type Team = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
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
  id: number;
  title: string;
  description: string;
  icon: "users" | "network" | "flame";
  userProgress: AchievementProgress;
};

export type UserProfile = {
  eId: string;
  name: string;
  email: string;
  role: string;
  title:string;
  avatarUrl?: string;
  stats: {
    hoursInOffice: number;
    streak: number;
    friendCount: number;
    levelsPassed: number;
    ap:number
  };
};

// export type ProfileApiResponse = {
//   profile: UserProfile;
// };
