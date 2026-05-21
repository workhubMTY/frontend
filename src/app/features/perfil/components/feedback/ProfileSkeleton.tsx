export function ProfilePageSkeleton() {
  return (
    <main className="min-h-screen bg-background-page px-8 py-8">
      <div className="mx-auto min-w-full max-w-screen-2xl animate-pulse">
        <div className="h-10 w-72 bg-container" />
        <div className="mt-3 h-5 w-96 bg-container" />

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-64 border border-neutral-200 bg-container lg:col-span-9" />
          <div className="h-64 border border-neutral-200 bg-container lg:col-span-3" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-[430px] border border-neutral-200 bg-container lg:col-span-4" />
          <div className="h-[430px] border border-neutral-200 bg-container lg:col-span-4" />
          <div className="h-[430px] border border-neutral-200 bg-container lg:col-span-4" />
        </div>
      </div>
    </main>
  );
}
