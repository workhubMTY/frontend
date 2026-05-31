export function TimelineGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 grid grid-cols-12">
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={index}
          className="border-l border-dashed border-slate-200 first:border-l-0"
        />
      ))}
    </div>
  );
}