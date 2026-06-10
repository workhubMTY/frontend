"use client";

import type { Users, Friendships } from "../data/types";

type Props = {
  user: Users | null;
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
  online: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  offline: "bg-slate-100 text-slate-400 border border-slate-200",
  inactive: "bg-red-50 text-red-500 border border-red-200",
};

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-amber-50 text-amber-600 border border-amber-200",
  IT: "bg-sky-50 text-sky-600 border border-sky-200",
  USER: "bg-slate-100 text-slate-500 border border-slate-200",
};

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function Placeholder() {
  return (
    <div className="flex flex-col bg-white border border-slate-200 border-dashed rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-2.5 bg-slate-100 rounded-full w-2/3" />
          <div className="h-2 bg-slate-100 rounded-full w-1/2" />
        </div>
      </div>
      <div className="px-4 py-2 border-b border-slate-100">
        <div className="h-2 bg-slate-100 rounded-full w-1/3" />
      </div>
      <div className="px-3 py-3 flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-2.5 bg-slate-200 rounded-full w-3/4" />
              <div className="h-2 bg-slate-200 rounded-full w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center py-4">
        <p className="text-slate-300 text-xs font-medium">Selecciona un usuario</p>
      </div>
    </div>
  );
}

export function FriendshipsPanel({ user, friendships, loading, onClose }: Props) {
  if (!user) return <Placeholder />;

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden h-fit max-h-[calc(100vh-12rem)] sticky top-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-semibold shrink-0">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-slate-800 text-sm font-semibold truncate leading-tight">{user.name}</p>
            <p className="text-slate-400 text-xs truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0 ml-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="px-4 py-2 border-b border-slate-100">
        <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">
          Amistades · {loading ? "..." : friendships.length}
        </p>
      </div>
      <div className="overflow-y-auto flex-1 px-3 py-3">
        {loading ? (
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : friendships.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-slate-300">
            <p className="text-xs">Sin amistades registradas</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {friendships.map((friend, i) => {
              const avatarClass = AVATAR_BG[i % AVATAR_BG.length];
              const statusStyle = STATUS_STYLES[friend.status?.toLowerCase()] ?? STATUS_STYLES.offline;
              const roleStyle = ROLE_STYLES[friend.roleName?.toUpperCase()] ?? ROLE_STYLES.USER;

              return (
                <div
                  key={friend.eId}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full ${avatarClass} flex items-center justify-center text-xs font-semibold shrink-0`}>
                    {getInitials(friend.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-700 text-sm font-medium truncate leading-tight">{friend.name}</p>
                    <p className="text-slate-400 text-xs truncate">{friend.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleStyle}`}>
                      {friend.roleName}
                    </span>
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
    </div>
  );
}