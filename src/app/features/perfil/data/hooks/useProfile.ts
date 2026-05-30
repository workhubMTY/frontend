import { useQuery } from "@tanstack/react-query";
import { perfilApi } from "../api";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => perfilApi.getProfile(),
  });
}
