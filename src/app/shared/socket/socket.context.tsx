"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import type { ParkingUpdateMessage } from "@/app/features/estacionamientos/data/types";
import type { Friendship, FriendRequest } from "@/app/shared/data/friendships/types";

// ─── WS payload types (mirrors backend socket.types.ts) ───────────────────────

export type UserUpdateMessage =
    | { type: "user.updated"; payload: { eId: string; name: string; email: string; role: string; avatar?: string } }
    | { type: "user.deleted"; payload: { eId: string } }
    | { type: "friendship.created"; payload: Friendship }
    | { type: "friendship.removed"; payload: { userLow: string; userHigh: string } }
    | { type: "friendRequest.sent"; payload: FriendRequest }
    | { type: "friendRequest.accepted"; payload: FriendRequest }
    | { type: "friendRequest.canceled"; payload: FriendRequest }
    | { type: "friendRequest.rejected"; payload: FriendRequest };

export type TeamSummaryWS = {
    id: number;
    name: string;
    description: string | null;
    memberCount?: number;
};

export type TeamMembersWS = TeamSummaryWS & {
    members: Array<{ eId: string; name: string; email: string; role: string }>;
};

export type TeamPublicUpdate =
    | { type: "team.updated"; payload: TeamSummaryWS }
    | { type: "team.deleted"; payload: { teamId: number } };

export type TeamMembersUpdate =
    | { type: "team.updated"; payload: TeamMembersWS }
    | { type: "team.memberAdded"; payload: TeamMembersWS }
    | { type: "team.memberRemoved"; payload: TeamMembersWS };

export type OfficeParticipantPublic = {
    id: number;
    reservations_id: number;
    user_id: string | null;
    ownership_priority: number | null;
    attendance_status: string | null;
    created_at: string;
    updated_at: string;
};

export type OfficeReservationPublic = {
    id: number;
    reservable_id: number;
    category: string;
    start_time: string;
    end_time: string;
    description: string;
    attendance_status: string;
    lifecycle_status: string;
    updated_at: string;
    reservable: { id: number; name: string; capacity: number; floor_id: number };
    participants: OfficeParticipantPublic[];
};

export type OfficeSlotPublic = {
    id: number;
    name: string;
    capacity: number;
    floor_id: number;
};

export type OfficeUpdateMessage =
    | { type: "reservation.created"; payload: OfficeReservationPublic }
    | { type: "reservation.canceled"; payload: OfficeReservationPublic }
    | { type: "reservation.checkedin"; payload: OfficeReservationPublic }
    | { type: "reservation.checkedout"; payload: OfficeReservationPublic }
    | { type: "reservation.noshow"; payload: OfficeReservationPublic }
    | { type: "reservation.attendance_updated"; payload: OfficeReservationPublic }
    | { type: "participant.updated"; payload: OfficeReservationPublic }
    | { type: "slot.created"; payload: OfficeSlotPublic }
    | { type: "slot.updated"; payload: OfficeSlotPublic }
    | { type: "slot.deleted"; payload: { id: number } };

// ─── Socket event maps ────────────────────────────────────────────────────────

interface ServerToClientEvents {
    notification: (data: unknown) => void;
    statusChanged: (data: { eId: string; status: string }) => void;
    userUpdate: (data: UserUpdateMessage) => void;
    teamPublicUpdate: (data: TeamPublicUpdate) => void;
    teamMembersUpdate: (data: TeamMembersUpdate) => void;
    parkingUpdate: (data: ParkingUpdateMessage) => void;
    officeUpdate: (data: OfficeUpdateMessage) => void;
}

interface ClientToServerEvents {
    ping: () => void;
    joinUserRoom: (userId: string) => void;
    joinParkingRoom: () => void;
    leaveParkingRoom: () => void;
    joinOfficeRoom: () => void;
    leaveOfficeRoom: () => void;
    joinFriendsRoom: () => void;
    leaveFriendsRoom: () => void;
    joinTeamRoom: (teamId: number) => void;
    leaveTeamRoom: (teamId: number) => void;
}

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

type SocketContextValue = {
    socket: AppSocket;
    connected: boolean;
};

const SocketContext = createContext<SocketContextValue | null>(null);

const PING_INTERVAL_MS = 30_000;

interface SocketProviderProps {
    children: ReactNode;
    isAuthenticated: boolean;
    accessToken: string | null;
}

export function SocketProvider({ children, isAuthenticated, accessToken }: SocketProviderProps) {
    const [connected, setConnected] = useState(false);
    const socketRef = useRef<AppSocket | null>(null);

    if (!socketRef.current) {
        socketRef.current = io(process.env.NEXT_PUBLIC_API_URL!, {
            auth: { token: accessToken ?? "" },
            autoConnect: false,
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });
    }

    const socket = socketRef.current;

    useEffect(() => {
        if (!isAuthenticated || !accessToken) {
            if (socket.connected) socket.disconnect();
            setConnected(false);
            return;
        }

        socket.auth = { token: accessToken };
        if (socket.connected) {
            socket.disconnect();
        }
        socket.connect();

        socket.on("connect", () => {
            console.log("[socket] connected:", socket.id);
            setConnected(true);
            // Unirse a la sala de amigos automáticamente al conectar
            socket.emit("joinFriendsRoom");
        });
        socket.on("disconnect", (reason) => {
            console.warn("[socket] disconnected:", reason);
            setConnected(false);
        });
        socket.on("connect_error", (err) => {
            console.warn("[socket] connect_error:", err.message, err.cause);
            setConnected(false);
        });

        const pingTimer = setInterval(() => {
            if (socket.connected) socket.emit("ping");
        }, PING_INTERVAL_MS);

        return () => {
            clearInterval(pingTimer);
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
            socket.disconnect();
        };
    }, [isAuthenticated, accessToken, socket]);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket(): AppSocket {
    const ctx = useContext(SocketContext);
    if (!ctx) {
        throw new Error("useSocket debe usarse dentro de <SocketProvider>");
    }
    return ctx.socket;
}

export function useSocketConnected(): boolean {
    const ctx = useContext(SocketContext);
    if (!ctx) return false;
    return ctx.connected;
}