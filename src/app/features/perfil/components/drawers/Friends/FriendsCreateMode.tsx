"use client";
import { useEffect, useState } from "react";
import { FriendSuggestion } from "../../../types/profile";
import { SendFriendRequestsPayload } from "./types";
import { Check, ChevronLeft, Mail, Search, Send, Users, X } from "lucide-react";
import { Avatar } from "../../utils/Avatar";
import { useDebouncedSearch } from "../../../hooks/useDebouncedSearch";

type InviteFriendsModeProps = {
  onSearchSuggestions: (query: string) => Promise<FriendSuggestion[]>;
  onBack: () => void;
  onClose: () => void;
  onSendFriendRequests: (payload: SendFriendRequestsPayload) => Promise<void>;
};
export function InviteFriendsMode({
  onSearchSuggestions,
  onBack,
  onClose,
  onSendFriendRequests,
}: InviteFriendsModeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<FriendSuggestion[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    results: suggestions,
    isSearching,
    hasSearched,
  } = useDebouncedSearch<FriendSuggestion>({
    searchTerm,
    searchFn: onSearchSuggestions,
  });
  const filteredSuggestions = suggestions;

  const canSend = selectedUsers.length > 0 && !isSubmitting;

  function handleToggleUser(person: FriendSuggestion) {
    if (person.status === "pending" || person.status === "already-friend") {
      return;
    }

    setSelectedUsers((current) => {
      const exists = current.some((user) => user.eId === person.eId);

      if (exists) {
        return current.filter((user) => user.eId !== person.eId);
      }

      return [...current, person];
    });
  }

  function handleRemoveUser(userId: string) {
    setSelectedUsers((current) => {
      return current.filter((user) => user.eId !== userId);
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSend) return;

    try {
      setIsSubmitting(true);

      await onSendFriendRequests({
        userIds: selectedUsers.map((user) => user.eId),
        message: message.trim() || undefined,
      });

      setSelectedUsers([]);
      setMessage("");
      setSearchTerm("");
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
            <div>
              <label
                htmlFor="friend-search"
                className="text-sm font-semibold text-neutral-950"
              >
                Buscar personas
              </label>

              <div className="relative mt-3">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                />

                <input
                  id="friend-search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar por nombre, correo o rol"
                  className="h-11 w-full border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-purple-700 focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            {selectedUsers.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-neutral-950">
                  Personas seleccionadas
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <span
                      key={user.eId}
                      className="inline-flex h-8 items-center gap-2 bg-neutral-100 px-3 text-sm text-neutral-700"
                    >
                      {user.name}

                      <button
                        type="button"
                        onClick={() => handleRemoveUser(user.eId)}
                        className="text-neutral-500 transition hover:text-neutral-900"
                        aria-label={`Quitar ${user.name}`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-950">
                  Resultados
                </p>

                <p className="text-xs text-neutral-500">
                  {selectedUsers.length} seleccionados
                </p>
              </div>

              <div className="border border-neutral-200">
                {!searchTerm.trim() ? (
                  <InitialSearchState />
                ) : isSearching ? (
                  <div className="px-5 py-10 text-center text-sm text-neutral-500">
                    Buscando personas...
                  </div>
                ) : hasSearched && filteredSuggestions.length > 0 ? (
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-neutral-100">
                    {filteredSuggestions.map((person) => {
                      const isSelected = selectedUsers.some(
                        (user) => user.eId === person.eId,
                      );

                      const isDisabled =
                        person.status === "pending" ||
                        person.status === "already-friend";

                      return (
                        <button
                          key={person.eId}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => handleToggleUser(person)}
                          className={[
                            "grid w-full grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 text-left transition",
                            isDisabled
                              ? "cursor-not-allowed bg-neutral-50 opacity-70"
                              : "hover:bg-neutral-50",
                            isSelected ? "bg-purple-50" : "",
                          ].join(" ")}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar
                              name={person.name}
                              avatarUrl={person.avatarUrl}
                            />

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-neutral-950">
                                {person.name}
                              </p>

                              <p className="truncate text-xs text-neutral-500">
                                {person.email}
                              </p>
                            </div>
                          </div>

                          <FriendRequestStatus
                            isSelected={isSelected}
                            status={person.status}
                          />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <EmptySearchState />
                )}
              </div>
            </div>

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

function InitialSearchState() {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-3 grid size-12 place-items-center bg-neutral-100 text-neutral-500">
        <Search size={22} />
      </div>

      <h3 className="text-sm font-semibold text-neutral-950">
        Busca una persona
      </h3>

      <p className="mt-1 max-w-sm text-sm text-neutral-500">
        Escribe un nombre, correo o rol para encontrar personas.
      </p>
    </div>
  );
}
function EmptySearchState() {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-3 grid size-12 place-items-center bg-neutral-100 text-neutral-500">
        <Users size={22} />
      </div>

      <h3 className="text-sm font-semibold text-neutral-950">
        No hay resultados
      </h3>

      <p className="mt-1 max-w-sm text-sm text-neutral-500">
        Intenta buscar por nombre, correo o usuario.
      </p>
    </div>
  );
}
