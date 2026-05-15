import { getInitials, getUserColor } from "@/app/features/profile.utils";

export type UserStatus = "En línea" | "Ausente" | "Desconectado";

export type User = {
  eId: string;
  name: string;
  email: string;
  roleName: string;
};

export type UserProfile = User & {
  friendCount: number;
  achievementCount: number;
};

export type CreateUserDto = User & {
  password: string;
};

export type Guest = {
  id: number;
  name: string;
  email: string;
  invited_by: string;
};

export type UserViewModel = User & {
  status: UserStatus;
  initials: string;
  bgColor: string;
  textColor: string;
};

export function createUserViewModel(
  user: User,
  status: UserStatus
): UserViewModel {
  const userColor = getUserColor(user.eId);
  return {
    ...user,
    status,
    initials: getInitials(user.name),
    bgColor: userColor.bg,
    textColor: userColor.text,
  };
}