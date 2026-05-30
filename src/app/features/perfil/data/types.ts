// export type FriendStatus = "En línea" | "Ausente" | "Desconectado";

export type UserProfile = {
  eId: string;
  name: string;
  role: string;
  // status: FriendStatus;
  avatar: string;
  createdAt: string;
};

export type AchievementTone = "purple" | "red" | "blue" | "green" | "yellow";

export type AchievementFromApi = {
  name: string;
  progress: number;
  goal: number;
  completed: 0 | 1;
};

export type Achievement = AchievementFromApi & {
  icon: React.ElementType;
  tone: AchievementTone;
};
