"use client";

import { useState, useEffect } from "react";
import { Search, X, UserPlus, Check } from "lucide-react";
import { usersApi } from "@/app/shared/data/users/api";
import { User } from "@/app/shared/data/users/types";
import { OpenParticipantPickerArgs, OpenParticipantPickerResult } from "../types/chat-tools.types";

interface Props {
  args: OpenParticipantPickerArgs;
  onConfirm: (result: OpenParticipantPickerResult) => void;
}

export default function ParticipantPicker({ args, onConfirm }: Props) {
  const { prompt, preselected_eids } = args;

  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  // Load all users once
  useEffect(() => {
    usersApi.getAll().then(setAllUsers).catch(() => setAllUsers([]));
  }, []);

  // Apply preselected eids once users are loaded
  useEffect(() => {
    if (allUsers.length && preselected_eids.length) {
      const pre = allUsers.filter((u) => preselected_eids.includes(u.eId));
      setSelected(pre);
    }
  }, [allUsers, preselected_eids]);

  if (confirmed) return null;

  const filtered = query.trim()
    ? allUsers.filter(
        (u) =>
          !selected.find((s) => s.eId === u.eId) &&
          (u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())),
      ).slice(0, 6)
    : [];

  const addUser = (user: User) => {
    setSelected((prev) => [...prev, user]);
    setQuery("");
  };

  const removeUser = (eId: string) => {
    setSelected((prev) => prev.filter((u) => u.eId !== eId));
  };

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm({ participant_eids: selected.map((u) => u.eId) });
  };

  const handleCancel = () => {
    setConfirmed(true);
    onConfirm({ participant_eids: [] });
  };

  return (
    <div className="mt-1 w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <UserPlus size={14} className="text-violet-500 flex-shrink-0" />
          <p className="text-sm font-medium text-gray-700">{prompt}</p>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-violet-400 transition-colors">
            <Search size={13} className="text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre..."
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
            />
          </div>

          {filtered.length > 0 && (
            <ul className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {filtered.map((u) => (
                <li key={u.eId}>
                  <button
                    onClick={() => addUser(u)}
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-violet-700">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {selected.map((u) => (
              <span
                key={u.eId}
                className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full px-2.5 py-1"
              >
                {u.name}
                <button
                  onClick={() => removeUser(u.eId)}
                  className="hover:text-violet-900 transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex border-t border-gray-100">
        <button
          onClick={handleCancel}
          className="flex-1 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <div className="w-px bg-gray-100" />
        <button
          onClick={handleConfirm}
          className="flex-1 py-3 text-sm font-medium text-violet-600 hover:bg-violet-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Check size={14} />
          {selected.length > 0
            ? `Confirmar (${selected.length})`
            : "Continuar sin participantes"}
        </button>
      </div>
    </div>
  );
}
