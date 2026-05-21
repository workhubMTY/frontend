type ProfilePageMessageProps = {
  title: string;
  description?: string;
};

export function ProfilePageMessage({
  title,
  description,
}: ProfilePageMessageProps) {
  return (
    <main className="min-h-screen bg-background-page px-8 py-8 text-neutral-950">
      <div className="mx-auto max-w-screen-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
          {title}
        </h1>

        {description ? (
          <p className="mt-2 text-sm text-neutral-500">{description}</p>
        ) : null}
      </div>
    </main>
  );
}
