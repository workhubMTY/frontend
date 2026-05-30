export function DrawerLoadingState() {
  return (
    <div className="space-y-4 px-8 py-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_120px_120px] gap-5 border-b border-neutral-100 py-4"
        >
          <div className="flex gap-4">
            <div className="h-11 w-11 animate-pulse rounded-full bg-neutral-100" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-neutral-100" />
              <div className="h-3 w-full animate-pulse rounded bg-neutral-100" />
            </div>
          </div>

          <div className="h-4 w-16 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-16 animate-pulse rounded bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}