"use client";

import { useEffect } from "react";
import type { Users, Friendships } from "../data/types";

type Props = {
  user: Users;
  friendships: Friendships[];
  loading: boolean;
  onClose: () => void;
};

const AVATAR_BG = [
  "bg-violet-100 text-violet-600",
  "bg-sky-100 text-sky-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  offline: "bg-slate-100 text-slate-400 border border-slate-200",
  inactive: "bg-red-50 text-red-500 border border-red-200",
};

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export function FriendshipsModal({ user, friendships, loading, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-semibold shrink-0">
              {getInitials(user.name)}
            </div>
            <div>
              <h2 className="text-slate-800 font-semibold text-base leading-tight">{user.name}</h2>
              <p className="text-slate-400 text-xs">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <p className="text-slate-400 text-xs uppercase tracking-widest font-medium mb-3">
            Amistades · {friendships.length}
          </p>
          {loading ? (
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : friendships.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-slate-300">
              <p className="text-sm">Sin amistades registradas</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {friendships.map((friend, i) => {
                const avatarClass  = AVATAR_BG[i % AVATAR_BG.length];
                const statusStyle  = STATUS_STYLES[friend.status?.toLowerCase()] ?? STATUS_STYLES.offline;

                return (
                  <div
                    key={friend.eId}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className={`w-8 h-8 rounded-full ${avatarClass} flex items-center justify-center text-xs font-semibold shrink-0`}>
                      {getInitials(friend.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-700 text-sm font-medium truncate">{friend.name}</p>
                      <p className="text-slate-400 text-xs truncate">{friend.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-slate-400 text-[10px] font-medium">{friend.roleName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyle}`}>
                        {friend.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded-lg transition-all"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}