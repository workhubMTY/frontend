import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { perfilApi } from "./api";
import type { Achievement, Friend, UserProfile } from "./perfil.types";

interface PerfilState {
  profile: UserProfile | null;
  friends: Friend[];
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
}

export function usePerfil(): PerfilState {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    Promise.all([
      perfilApi.getProfile(),
      perfilApi.getFriends(),
      perfilApi.getAchievements(),
    ])
      .then(([p, f, a]) => {
        setProfile(p);
        setFriends(f);
        setAchievements(a);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [user]);

  return { profile, friends, achievements, isLoading, error };
}
