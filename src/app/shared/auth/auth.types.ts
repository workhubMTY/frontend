export interface User {
  eId: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  user: User;
}

export interface LoginInput {
  eId: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (data: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}
