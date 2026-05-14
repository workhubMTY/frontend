import { authApi } from "./api";
import type { AuthResponse, LoginInput, User } from "./auth.types";

export const authService = {
  login(data: LoginInput) {
    return authApi.postData<AuthResponse>("/auth/login", data);
  },
  me(): Promise<User> {
    return authApi.getMe();
  },
  logout(): Promise<void> {
    return authApi.postLogout();
  }
};
