interface LegendItem {
  color: string;
  label: string;
}

interface ChartLegendProps {
  items: LegendItem[];
}

export function Chart({ items }: ChartLegendProps) {
  return (
    <div className="mb-3 flex flex-wrap gap-4">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-xs text-neutral-500">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}