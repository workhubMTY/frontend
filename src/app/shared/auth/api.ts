import { authFetch } from "@/app/shared/data/api";

export const authApi = {
  postData: <T>(endpoint: string, body: unknown): Promise<T> =>
    authFetch<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),

  getMe: () =>
    authFetch<{ eId: string; name: string; role: string }>("/auth/me"),

  postLogout: async (): Promise<void> => {
    await authFetch<void>("/auth/logout", { method: "POST" });
  },
};
