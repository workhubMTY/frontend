"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/app/shared/socket/socket.context";
import type { UserUpdateMessage } from "@/app/shared/socket/socket.context";
import type { UserProfile } from "@/app/features/perfil/types/profile";

import { perfilApi } from "../api";

export function useProfile() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: () => perfilApi.getProfile(),
  });

  useEffect(() => {
    function onUserUpdate(msg: UserUpdateMessage) {
      if (msg.type === "user.updated") {
        // Actualizamos el perfil si el eId coincide con el usuario actual
        queryClient.setQueryData<UserProfile>(["profile"], (prev) => {
          if (!prev) return prev;
          if (prev.eId !== msg.payload.eId) return prev;
          return {
            ...prev,
            name: msg.payload.name,
            email: msg.payload.email,
            roleName: msg.payload.role,
            ...(msg.payload.avatar !== undefined
              ? { avatar: msg.payload.avatar }
              : {}),
          };
        });
      }
    }

    socket.on("userUpdate", onUserUpdate);
    return () => {
      socket.off("userUpdate", onUserUpdate);
    };
  }, [socket, queryClient]);

  return query;
}
