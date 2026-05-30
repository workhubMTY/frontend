type TeamDetailsFieldsProps = {
  teamName: string;
  description: string;
  onTeamNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

export function TeamDetailsFields({
  teamName,
  description,
  onTeamNameChange,
  onDescriptionChange,
}: TeamDetailsFieldsProps) {
  return (
    <>
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
          onChange={(event) => onTeamNameChange(event.target.value)}
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
              onDescriptionChange(event.target.value.slice(0, 300))
            }
            placeholder="Describe el propósito o los objetivos del equipo..."
            className="min-h-[140px] w-full resize-none border border-neutral-200 bg-white px-4 py-4 pr-16 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />

          <span className="absolute bottom-4 right-4 text-xs text-neutral-400">
            {description.length}/300
          </span>
        </div>
      </div>
    </>
  );
}