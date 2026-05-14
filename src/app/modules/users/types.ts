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
