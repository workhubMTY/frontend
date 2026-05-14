"use client";

import {
  Check,
  ChevronLeft,
  Mail,
  Search,
  Send,
  SlidersHorizontal,
  Trophy,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import type { Friend, FriendSuggestion, User } from "../../types/profile";
import { useMemo, useState, useEffect } from "react";
import { UserMultiSelect } from "../utils/UserMultiSelect";
import { Avatar } from "../utils/Avatar";
import { EmptyUsersState } from "../utils/EmptyUsersState";

type SendFriendRequestsPayload = {
  userIds: string[];
  message?: string;
};

type FriendsDrawerProps = {
  isOpen: boolean;
  friends: Friend[];
  selectedFriendId?: string | null;
  initialMode?: DrawerMode;

  onGetUsers: () => Promise<User[]>;
  onClose: () => void;
  onCompareFriend: (id: string) => void;
  onClearComparison: () => void;
  onSendFriendRequests?: (
    payload: SendFriendRequestsPayload,
  ) => Promise<void> | void;
};
type SortOption = "name-asc" | "name-desc";
type DrawerMode = "list" | "invite";
export function FriendsDrawer({
  isOpen,
  friends,
  selectedFriendId,
  initialMode = "list",
  onGetUsers,
  onClose,
  onCompareFriend,
  onClearComparison,
  onSendFriendRequests,
}: FriendsDrawerProps) {
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(initialMode);

  useEffect(() => {
    if (!isOpen) return;

    setDrawerMode(initialMode);
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  function handleClose() {
    setDrawerMode("list");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar panel"
        onClick={handleClose}
        className="absolute inset-0 bg-black/50"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col border-l border-neutral-200 bg-white shadow-2xl">
        {drawerMode === "list" ? (
          <FriendsListMode
            friends={friends}
            selectedFriendId={selectedFriendId}
            onClose={handleClose}
            onCompareFriend={onCompareFriend}
            onClearComparison={onClearComparison}
            onInviteMode={() => setDrawerMode("invite")}
          />
        ) : (
          <InviteFriendsMode
            onBack={() => setDrawerMode("list")}
            onClose={handleClose}
            onGetUsers={onGetUsers}
            onSendFriendRequests={async (payload) => {
              await onSendFriendRequests?.(payload);
              setDrawerMode("list");
            }}
          />
        )}
      </aside>
    </div>
  );
}
type FriendsListModeProps = {
  friends: Friend[];
  selectedFriendId?: string | null;
  onClose: () => void;
  onCompareFriend: (id: string) => void;
  onClearComparison: () => void;
  onInviteMode: () => void;
};

function FriendsListMode({
  friends,
  selectedFriendId,
  onClose,
  onCompareFriend,
  onClearComparison,
  onInviteMode,
}: FriendsListModeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");

  const filteredFriends = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchingFriends = friends.filter((friend) => {
      if (!normalizedSearch) return true;

      return (
        friend.name.toLowerCase().includes(normalizedSearch) ||
        friend.email.toLowerCase().includes(normalizedSearch) ||
        friend.role.toLowerCase().includes(normalizedSearch)
      );
    });

    return [...matchingFriends].sort((a, b) => {
      if (sortOption === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      return a.name.localeCompare(b.name);
    });
  }, [friends, searchTerm, sortOption]);

  return (
    <>
      <header className="border-b border-neutral-100 px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
              Todas las amistades
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Consulta tus amistades y elige con quién comparar logros.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
            />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar amistades"
              className="h-11 w-full border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-purple-700"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600"
            />

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as SortOption)
              }
              className="h-11 appearance-none border border-neutral-200 bg-white pl-11 pr-10 text-sm text-neutral-700 outline-none transition focus:border-purple-700"
            >
              <option value="name-asc">Ordenar A-Z</option>
              <option value="name-desc">Ordenar Z-A</option>
            </select>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {filteredFriends.length > 0 ? (
          <ul className="divide-y divide-neutral-100">
            {filteredFriends.map((friend) => {
              const isSelected = friend.id === selectedFriendId;

              return (
                <article
                  key={friend.id}
                  className={[
                    "grid items-center gap-4 px-7 py-4 transition",
                    "md:grid-cols-[1fr_auto]",
                    isSelected
                      ? "border-l-4 border-purple-700 bg-purple-50/70 pl-6"
                      : "border-l-4 border-transparent hover:bg-neutral-50",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <Avatar name={friend.name} avatarUrl={friend.avatarUrl} />

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-neutral-950">
                        {friend.name}
                      </h3>
                      <p className="text-sm text-neutral-500">{friend.role}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        isSelected
                          ? onClearComparison()
                          : onCompareFriend(friend.id)
                      }
                      className={[
                        "inline-flex h-10 items-center gap-2 border px-4 text-sm font-medium transition",
                        isSelected
                          ? "border-purple-700 bg-purple-700 text-white hover:bg-purple-800"
                          : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50",
                      ].join(" ")}
                    >
                      {isSelected ? <Check size={17} /> : <Trophy size={17} />}
                      {isSelected ? "Comparando" : "Comparar"}
                    </button>
                  </div>
                </article>
              );
            })}
          </ul>
        ) : (
          <EmptyUsersState
            title="No se encontraron amistades"
            description="Intenta buscar con otro nombre o invita a más amigos."
          />
        )}
      </div>

      <footer className="border-t border-neutral-100 bg-white px-8 py-5">
        <button
          type="button"
          onClick={onInviteMode}
          className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 transition hover:text-purple-900"
        >
          <UserPlus size={18} />
          Invitar a más amigos
        </button>
      </footer>
    </>
  );
}
type InviteFriendsModeProps = {
  onGetUsers: () => Promise<User[]>;
  onBack: () => void;
  onClose: () => void;
  onSendFriendRequests: (payload: SendFriendRequestsPayload) => Promise<void>;
};

function InviteFriendsMode({
  onGetUsers,
  onBack,
  onClose,
  onSendFriendRequests,
}: InviteFriendsModeProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        setIsLoadingUsers(true);

        const incomingUsers = await onGetUsers();

        if (isMounted) {
          setUsers(incomingUsers);
        }
      } catch (error) {
        console.error("Error loading users:", error);

        if (isMounted) {
          setUsers([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingUsers(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, [onGetUsers]);

  const canSend = selectedUsers.length > 0 && !isSubmitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSend) return;

    try {
      setIsSubmitting(true);

      await onSendFriendRequests({
        userIds: selectedUsers.map((user) => user.id),
        message: message.trim() || undefined,
      });

      setSelectedUsers([]);
      setMessage("");
      onBack();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <header className="border-b border-neutral-100 px-8 py-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-purple-700 transition hover:text-purple-900"
            >
              <ChevronLeft size={17} />
              Volver a amistades
            </button>

            <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
              Invitar a más amigos
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Busca personas y envía solicitudes de amistad.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-6">
            {isLoadingUsers ? (
              <div className="py-10 text-center text-sm text-neutral-500">
                Cargando usuarios...
              </div>
            ) : (
              <UserMultiSelect
                users={users}
                selectedUsers={selectedUsers}
                onSelectedUsersChange={setSelectedUsers}
                placeholder="Buscar por nombre, correo o rol"
                emptyTitle="Busca personas para invitar"
                emptyDescription="Escribe un nombre, correo o rol para encontrar usuarios."
              />
            )}

            <div>
              <label
                htmlFor="request-message"
                className="text-sm font-semibold text-neutral-950"
              >
                Mensaje{" "}
                <span className="font-normal text-neutral-500">(opcional)</span>
              </label>

              <div className="relative mt-3">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-4 text-neutral-500"
                />

                <textarea
                  id="request-message"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value.slice(0, 180))
                  }
                  placeholder="Ej. Hola, me gustaría agregarte como amistad."
                  className="min-h-[110px] w-full resize-none border border-neutral-200 bg-white py-3 pl-11 pr-14 text-sm outline-none transition placeholder:text-neutral-400 focus:border-purple-700 focus:ring-2 focus:ring-purple-100"
                />

                <span className="absolute bottom-3 right-4 text-xs text-neutral-400">
                  {message.length}/180
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-neutral-100 bg-white px-8 py-5">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 min-w-28 items-center justify-center border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex h-11 min-w-44 items-center justify-center gap-2 bg-purple-700 px-5 text-sm font-medium text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-300"
            >
              <Send size={16} />

              {isSubmitting
                ? "Enviando..."
                : selectedUsers.length === 1
                  ? "Enviar solicitud"
                  : `Enviar ${selectedUsers.length} solicitudes`}
            </button>
          </div>
        </footer>
      </form>
    </>
  );
}
function FriendRequestStatus({
  isSelected,
  status,
}: {
  isSelected: boolean;
  status?: FriendSuggestion["status"];
}) {
  if (status === "pending") {
    return (
      <span className="whitespace-nowrap bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
        Pendiente
      </span>
    );
  }

  if (status === "already-friend") {
    return (
      <span className="whitespace-nowrap bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
        Ya es amistad
      </span>
    );
  }

  if (isSelected) {
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap bg-purple-700 px-3 py-1 text-xs font-medium text-white">
        <Check size={13} />
        Seleccionado
      </span>
    );
  }

  return (
    <span className="whitespace-nowrap border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
      Seleccionar
    </span>
  );
}
