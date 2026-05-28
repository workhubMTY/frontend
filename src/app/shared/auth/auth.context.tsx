import { createContext, useEffect, useMemo, useState, useRef, useCallback, type ReactNode } from "react";
import type { AuthContextType, LoginInput, User } from "./auth.types";
import { authService } from "./auth.service";
import { registerAuthAccessors } from "@/app/shared/data/api";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Prevent concurrent refresh calls (e.g. multiple 401s firing at once)
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  const silentRefresh = useCallback((): Promise<string | null> => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    const promise = authService
      .refresh()
      .then(({ accessToken: newToken, user: newUser }) => {
        setAccessToken(newToken);
        setUser(newUser);
        return newToken;
      })
      .catch(() => {
        setAccessToken(null);
        setUser(null);
        return null;
      })
      .finally(() => {
        refreshPromiseRef.current = null;
      });

    refreshPromiseRef.current = promise;
    return promise;
  }, []);

  useEffect(() => {
    setIsLoading(true);
    silentRefresh().finally(() => setIsLoading(false));
  }, [silentRefresh]);

  const login = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      setAccessToken(response.accessToken);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setAccessToken(null);
    setUser(null);
  };

  useEffect(() => {
    registerAuthAccessors({
      getAccessToken: () => accessToken,
      silentRefresh,
    });
  }, [accessToken, silentRefresh]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      login,
      logout,
      silentRefresh,
      isAuthenticated: !!user,
      isLoading,
    }),
    [user, accessToken, isLoading, silentRefresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
