"use client";

import type { Users } from "../data/types";

type Props = {
  users: Users[];
  loading: boolean;
  error: string | null;
  search: string;
  onUserClick: (user: Users) => void;
};

const AVATAR_BG = [
  "bg-violet-100 text-violet-600",
  "bg-sky-100 text-sky-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-indigo-100 text-indigo-600",
];

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-amber-50 text-amber-600 border border-amber-200",
  IT: "bg-sky-50 text-sky-600 border border-sky-200",
  USER:  "bg-slate-100 text-slate-500 border border-slate-200",
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  offline: "bg-slate-100 text-slate-400 border border-slate-200",
  inactive: "bg-red-50 text-red-500 border border-red-200",
};

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export function UserList({ users, loading, error, search, onUserClick }: Props) {
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.eId.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400 text-sm py-4 text-center">{error}</p>;
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-slate-400">
        <span className="text-3xl mb-2">👥</span>
        <p className="text-sm">Sin resultados</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {filtered.map((user, i) => {
        const avatarClass = AVATAR_BG[i % AVATAR_BG.length];
        const roleStyle = ROLE_STYLES[user.roleName?.toUpperCase()] ?? ROLE_STYLES.USER;
        const statusStyle = STATUS_STYLES[user.status?.toLowerCase()] ?? STATUS_STYLES.offline;

        return (
          <button
            key={user.eId}
            onClick={() => onUserClick(user)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group w-full border border-transparent hover:border-slate-200"
          >
            <div className={`w-9 h-9 rounded-full ${avatarClass} flex items-center justify-center text-sm font-semibold shrink-0`}>
              {getInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-slate-800 text-sm font-medium truncate leading-tight">{user.name}</p>
              <p className="text-slate-400 text-xs truncate">{user.email}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleStyle}`}>
                {user.roleName}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyle}`}>
                {user.status}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}