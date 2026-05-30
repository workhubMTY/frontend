"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, X } from "lucide-react";

import { useAuth } from "@/app/shared/auth/useAuth";

import type { User } from "../../../types/profile";
import type { CreateTeamPayload } from "./types";
import { SearchSelectionBox } from "../../utils/SearchSelectionBox";

type CreateTeamModeProps = {
  onGetCandidates: (query: string) => Promise<User[]>;
  onBack: () => void;
  onClose: () => void;
  onCreateTeam: (payload: CreateTeamPayload) => Promise<void>;
};

export function CreateTeamMode({
  onGetCandidates,
  onBack,
  onClose,
  onCreateTeam,
}: CreateTeamModeProps) {
  const { user } = useAuth();

  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [candidates, setCandidates] = useState<User[]>([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);
  const [hasSearchedMembers, setHasSearchedMembers] = useState(false);

  useEffect(() => {
    const normalizedSearch = memberSearch.trim();

    if (!normalizedSearch) {
      setCandidates([]);
      setIsSearchingMembers(false);
      setHasSearchedMembers(false);
      return;
    }

    let isActive = true;

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearchingMembers(true);
        setHasSearchedMembers(true);

        const incomingCandidates = await onGetCandidates(normalizedSearch);

        if (isActive) {
          setCandidates(incomingCandidates);
        }
      } catch (error) {
        console.error("Error loading team member candidates:", error);

        if (isActive) {
          setCandidates([]);
        }
      } finally {
        if (isActive) {
          setIsSearchingMembers(false);
        }
      }
    }, 350);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [memberSearch, onGetCandidates]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(
      (candidate) =>
        !selectedMembers.some(
          (member) => String(member.eId) === String(candidate.eId),
        ),
    );
  }, [candidates, selectedMembers]);

  const canCreateTeam =
    teamName.trim().length >= 3 && !isSubmitting && Boolean(user?.eId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canCreateTeam || !user?.eId) return;

    try {
      setIsSubmitting(true);

      await onCreateTeam({
        name: teamName.trim(),
        description: description.trim(),
        memberEIds: [...selectedMembers.map((member) => member.eId), user.eId],
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  function handleToggleMember(member: User) {
    setSelectedMembers((current) => {
      const exists = current.some(
        (selectedMember) => String(selectedMember.eId) === String(member.eId),
      );

      if (exists) {
        return current.filter(
          (selectedMember) => String(selectedMember.eId) !== String(member.eId),
        );
      }

      return [...current, member];
    });
  }
  function handleRemoveMember(memberId: string) {
    setSelectedMembers((current) =>
      current.filter((member) => String(member.eId) !== String(memberId)),
    );
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
              Volver a equipos
            </button>

            <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
              Crear nuevo equipo
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Crea un equipo y agrega a tus miembros.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Cerrar drawer"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="space-y-7">
            <div>
              <label
                htmlFor="team-name"
                className="text-sm font-semibold text-neutral-950"
              >
                Nombre del equipo
              </label>

              <input
                id="team-name"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                placeholder="Ej. Equipo de Marketing"
                className="mt-3 h-11 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

              {teamName.trim().length > 0 && teamName.trim().length < 3 && (
                <p className="mt-2 text-xs text-red-600">
                  El nombre debe tener al menos 3 caracteres.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="team-description"
                className="text-sm font-semibold text-neutral-950"
              >
                Descripción{" "}
                <span className="font-normal text-neutral-500">(opcional)</span>
              </label>

              <div className="relative mt-3">
                <textarea
                  id="team-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value.slice(0, 300))
                  }
                  placeholder="Describe el propósito o los objetivos del equipo..."
                  className="min-h-[140px] w-full resize-none border border-neutral-200 bg-white px-4 py-4 pr-16 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

                <span className="absolute bottom-4 right-4 text-xs text-neutral-400">
                  {description.length}/300
                </span>
              </div>
            </div>

            <SearchSelectionBox<User>
              id="member-search"
              label="Invitar miembros"
              searchValue={memberSearch}
              onSearchChange={setMemberSearch}
              selectedItems={selectedMembers}
              results={candidates}
              isSearching={isSearchingMembers}
              hasSearched={hasSearchedMembers}
              selectedLabel="Miembros seleccionados"
              resultsLabel="Resultados"
              placeholder="Buscar por nombre, correo o rol"
              searchPlaceholderWhenSelected="Buscar personas..."
              getItemId={(member) => String(member.eId)}
              getItemName={(member) => member.name}
              getItemAvatarUrl={(member) => member.avatarUrl}
              getItemDescription={(member) => member.email}
              onSelectItem={handleToggleMember}
              onRemoveItem={handleRemoveMember}
              isItemSelected={(member) =>
                selectedMembers.some(
                  (selectedMember) =>
                    String(selectedMember.eId) === String(member.eId),
                )
              }
              renderItemStatus={(_, { isSelected }) =>
                isSelected ? (
                  <span className="inline-flex items-center gap-1 whitespace-nowrap bg-purple-700 px-3 py-1 text-xs font-medium text-white">
                    <Check size={13} />
                    Seleccionado
                  </span>
                ) : (
                  <span className="whitespace-nowrap border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                    Seleccionar
                  </span>
                )
              }
            />
          </div>
        </div>

        <footer className="border-t border-neutral-100 bg-white px-8 py-5">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 min-w-32 items-center justify-center border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!canCreateTeam}
              className="inline-flex h-11 min-w-40 items-center justify-center bg-primary-2 px-5 text-sm font-medium text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-300"
            >
              {isSubmitting ? "Creando..." : "Crear equipo"}
            </button>
          </div>
        </footer>
      </form>
    </>
  );
}
