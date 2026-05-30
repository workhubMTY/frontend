"use client";

import { useEffect, useState } from "react";
import { Check, ChevronLeft, Mail, Send, X } from "lucide-react";

import type { FriendSuggestion } from "../../../types/profile";
import type { SendFriendRequestsPayload } from "./types";
import { SearchSelectionBox } from "../../utils/SearchSelectionBox";

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
  const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<FriendSuggestion[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const normalizedSearch = searchTerm.trim();

    if (!normalizedSearch) {
      setSuggestions([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    let isActive = true;

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        setHasSearched(true);

        const incomingSuggestions = await onSearchSuggestions(normalizedSearch);

        if (isActive) {
          setSuggestions(incomingSuggestions);
        }
      } catch (error) {
        console.error("Error loading friend suggestions:", error);

        if (isActive) {
          setSuggestions([]);
        }
      } finally {
        if (isActive) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm, onSearchSuggestions]);

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
            <SearchSelectionBox<FriendSuggestion>
              id="friend-search"
              label="Buscar personas"
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              selectedItems={selectedUsers}
              results={suggestions}
              isSearching={isSearching}
              hasSearched={hasSearched}
              selectedLabel="Personas seleccionadas"
              resultsLabel="Resultados"
              placeholder="Buscar por nombre, correo o rol"
              searchPlaceholderWhenSelected="Buscar personas..."
              getItemId={(person) => person.eId}
              getItemName={(person) => person.name}
              getItemAvatarUrl={(person) => person.avatarUrl}
              getItemDescription={(person) => person.email}
              onSelectItem={handleToggleUser}
              onRemoveItem={handleRemoveUser}
              isItemSelected={(person) =>
                selectedUsers.some((user) => user.eId === person.eId)
              }
              isItemDisabled={(person) =>
                person.status === "pending" ||
                person.status === "already-friend"
              }
              renderItemStatus={(person, { isSelected }) => (
                <FriendRequestStatus
                  isSelected={isSelected}
                  status={person.status}
                />
              )}
            />

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