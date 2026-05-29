import { getInitials, getUserColor } from "@/app/features/home/utils/utils";

export type UserStatus = "online" | "idle" | "offline";
export type UserStatusLabel = "En línea" | "Ausente" | "Desconectado";

export const STATUS_LABEL: Record<UserStatus, UserStatusLabel> = {
  online: "En línea",
  idle: "Ausente",
  offline: "Desconectado",
};

export type User = {
  eId: string;
  name: string;
  email: string;
  roleName: string;
  status: UserStatus;
};

export type UserProfile = User & {
  friendCount: number;
  achievementCount: number;
};

export type CreateUserDto = Omit<User, "status"> & {
  password: string;
};

export type Guest = {
  id: number;
  name: string;
  email: string;
  invited_by: string;
};

export type UserViewModel = {
  eId: string;
  name: string;
  email: string;
  roleName: string;
  status: UserStatus;
  statusLabel: UserStatusLabel;
  initials: string;
  bgColor: string;
  textColor: string;
};

export function createUserViewModel(user: User): UserViewModel {
  const color = getUserColor(user.eId);
  return {
    eId: user.eId,
    name: user.name,
    email: user.email,
    roleName: user.roleName,
    status: user.status,
    statusLabel: STATUS_LABEL[user.status],
    initials: getInitials(user.name),
    bgColor: color.bg,
    textColor: color.text,
  };
}
