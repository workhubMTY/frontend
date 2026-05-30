type DetailsTabProps = {
  teamName: string;
  description: string;
  onTeamNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

export function DetailsTab({
  teamName,
  description,
  onTeamNameChange,
  onDescriptionChange,
}: DetailsTabProps) {
  return (
    <section className="space-y-7">
      <div>
        <label
          htmlFor="manage-team-name"
          className="text-sm font-semibold text-neutral-950"
        >
          Nombre del equipo
        </label>

        <input
          id="manage-team-name"
          value={teamName}
          onChange={(event) => onTeamNameChange(event.target.value)}
          placeholder="Ej. Equipo de Marketing"
          className="mt-3 h-11 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        />

        {teamName.length > 0 && teamName.trim().length < 1 && (
          <p className="mt-2 text-xs text-red-600">
            El nombre no puede estar vacío.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="manage-team-description"
          className="text-sm font-semibold text-neutral-950"
        >
          Descripción{" "}
          <span className="font-normal text-neutral-500">(opcional)</span>
        </label>

        <div className="relative mt-3">
          <textarea
            id="manage-team-description"
            value={description}
            onChange={(event) =>
              onDescriptionChange(event.target.value.slice(0, 300))
            }
            placeholder="Describe el propósito o los objetivos del equipo..."
            className="min-h-[120px] w-full resize-none border border-neutral-200 bg-white px-4 py-4 pr-16 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />

          <span className="absolute bottom-4 right-4 text-xs text-neutral-400">
            {description.length}/300
          </span>
        </div>
      </div>
    </section>
  );
}