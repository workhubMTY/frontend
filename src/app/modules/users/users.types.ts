// deprecated

export type UserStatus = "En línea" | "Ausente" | "Desconectado";

export interface Friend {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  avatar: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  avatar: string;
  createdAt: string;
}
