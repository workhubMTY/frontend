export function ProfilePageSkeleton() {
  return (
    <div className="flex flex-col flex-1 bg-background-page px-8 py-4">
      <div className="mx-auto flex flex-col flex-1 min-w-full max-w-screen-2xl animate-pulse">

        <div className=" flex flex-col flex-1 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex-1 border border-neutral-200 bg-container lg:col-span-9" />
          <div className="flex-1 border border-neutral-200 bg-container lg:col-span-3" />
        </div>

        <div className="flex flex-col flex-2 mt-6 grid grid-cols-1 gap-6 pb-8 lg:grid-cols-12">
          <div className="flex-1 border border-neutral-200 bg-container lg:col-span-4" />
          <div className="flex-1 border border-neutral-200 bg-container lg:col-span-4" />
          <div className="flex-1 border border-neutral-200 bg-container lg:col-span-4" />
        </div>
      </div>
    </div>
  );
}
