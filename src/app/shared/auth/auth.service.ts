import type { AuthResponse, LoginInput } from "./auth.types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

// INCLUDE CREDENTIALS SO THE REFRESH TOKEN IS STORED

export const authService = {
  async login(data: LoginInput): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      throw new Error(payload?.message ?? `Error ${res.status}`);
    }
    const payload = await res.json();
    return payload.data as AuthResponse;
  },

  async refresh(): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Refresh failed");
    const payload = await res.json();
    return payload.data as AuthResponse;
  },

  async logout(): Promise<void> {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  },
};
