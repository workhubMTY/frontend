"use client";
import { useEffect, useState } from "react";
import { User } from "../../../types/profile";
import { CreateTeamPayload } from "./types";
import { ChevronLeft, X } from "lucide-react";
import { Avatar } from "./TeamsDrawer";
import { useAuth } from "@/app/shared/auth/useAuth";

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
  const {user} = useAuth()
  



  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  // const [privacy, setPrivacy] = useState<"private" | "public">("private");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filteredCandidates, setFilteredCandidates] = useState<User[]>([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);
  

  useEffect(() => {
    const normalizedSearch = memberSearch.trim();

    if (!normalizedSearch) {
      setFilteredCandidates([]);
      return;
    }

    let ignore = false;

    async function searchCandidates() {
      try {
        setIsSearchingMembers(true);

        const candidates = await onGetCandidates(normalizedSearch);

        if (ignore) return;

        setFilteredCandidates(
          candidates.filter(
            (candidate) =>
              !selectedMembers.some(
                (member) => String(member.eId) === String(candidate.eId),
              ),
          ),
        );
      } finally {
        if (!ignore) {
          setIsSearchingMembers(false);
        }
      }
    }

    searchCandidates();

    return () => {
      ignore = true;
    };
  }, [memberSearch, onGetCandidates, selectedMembers]);

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
      memberEIds: [
        ...selectedMembers.map((member) => member.eId),
        user.eId,
      ],
    });
  } finally {
    setIsSubmitting(false);
  }
}

  function handleSelectMember(member: User) {
    setSelectedMembers((current) => [...current, member]);
    setMemberSearch("");
  }

  function handleRemoveMember(memberId: string) {
    setSelectedMembers((current) =>
      current.filter((member) => member.eId !== memberId),
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
            <div>
              <label
                htmlFor="member-search"
                className="text-sm font-semibold text-neutral-950"
              >
                Invitar miembros
              </label>

              <div className="relative mt-3">
                <div className="flex min-h-12 w-full flex-wrap items-center gap-2 border border-neutral-200 bg-white px-3 py-2 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
                  {selectedMembers.map((member) => (
                    <span
                      key={member.eId}
                      className="inline-flex h-8 items-center gap-2 bg-neutral-100 px-3 text-sm text-neutral-700"
                    >
                      {member.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.eId)}
                        className="text-neutral-500 transition hover:text-neutral-900"
                        aria-label={`Quitar ${member.name}`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}

                  <input
                    id="member-search"
                    value={memberSearch}
                    onChange={(event) => setMemberSearch(event.target.value)}
                    placeholder={
                      selectedMembers.length > 0
                        ? "Buscar personas..."
                        : "Busca personas para invitar..."
                    }
                    className="h-8 min-w-[180px] flex-1 border-0 bg-transparent px-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                  />
                </div>

                {filteredCandidates.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-56 overflow-y-auto border border-neutral-200 bg-white shadow-lg">
                    {filteredCandidates.map((candidate) => (
                      <button
                        key={candidate.eId}
                        type="button"
                        onClick={() => handleSelectMember(candidate)}
                        className="flex w-full items-center gap-3 border-b border-neutral-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-neutral-50"
                      >
                        <Avatar
                          name={candidate.name}
                          src={candidate.avatarUrl}
                          size="sm"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-neutral-950">
                            {candidate.name}
                          </p>
                          <p className="truncate text-xs text-neutral-500">
                            {candidate.role}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="mt-2 text-xs text-neutral-500">
                Puedes invitar más miembros después.
              </p>
            </div>
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
