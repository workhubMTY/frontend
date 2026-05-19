export type FriendStatus = "En línea" | "Ausente" | "Desconectado";

export type Friend = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: FriendStatus;
  avatar: string;
};

export type UserProfile = {
  id: number;
  name: string;
  role: string;
  status: FriendStatus;
  avatar: string;
  createdAt: string;
};

export type AchievementTone = "purple" | "red" | "blue" | "green" | "yellow";

export type Achievement = {
  id: number;
  title: string;
  description: string;
  progress: number;
  total: number;
  icon: React.ElementType;
  tone: AchievementTone;
};