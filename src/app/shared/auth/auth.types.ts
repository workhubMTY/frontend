export interface User {
  eId: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginInput {
  eId: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (data: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  silentRefresh: () => Promise<string | null>;
  isAuthenticated: boolean;
  isLoading: boolean;
}
