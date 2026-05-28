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

interface ServerToClientEvents {
    notification: (data: unknown) => void;
    statusChanged: (data: { eId: string; status: string }) => void;
    parkingUpdate: (data: ParkingUpdateMessage) => void;
}

interface ClientToServerEvents {
    ping: () => void;
    joinUserRoom: (userId: string) => void;
    joinParkingRoom: () => void;
    leaveParkingRoom: () => void;
}

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

type SocketContextValue = {
    socket: AppSocket;
    connected: boolean;
};

const SocketContext = createContext<SocketContextValue | null>(null);

const PING_INTERVAL_MS = 30_000; // 30 s

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
        // If already connected with a stale token, force a reconnect.
        if (socket.connected) {
            socket.disconnect();
        }
        socket.connect();

        socket.on("connect", () => {
            console.log("[socket] connected:", socket.id);
            setConnected(true);
        });
        socket.on("disconnect", (reason) => {
            console.warn("[socket] disconnected:", reason);
            setConnected(false);
        });
        socket.on("connect_error", (err) => {
            console.warn("[socket] connect_error:", err.message, err.cause);
            setConnected(false);
        });

        // Keepalive de presencia
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