"use client";

type DateRangePickerProps = {
    from: string;
    to: string;
    onFromChange: (v: string) => void;
    onToChange: (v: string) => void;
    onApply: () => void;
};

export function DateRangePicker({
    from,
    to,
    onFromChange,
    onToChange,
    onApply,
}: DateRangePickerProps) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
                <label className="text-slate-400 text-xs font-medium">Desde</label>
                <input
                    type="date"
                    value={from}
                    onChange={(e) => onFromChange(e.target.value)}
                    className="text-xs text-slate-700 border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
                />
            </div>
            <div className="flex items-center gap-1.5">
                <label className="text-slate-400 text-xs font-medium">Hasta</label>
                <input
                    type="date"
                    value={to}
                    onChange={(e) => onToChange(e.target.value)}
                    className="text-xs text-slate-700 border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
                />
            </div>
            <button
                onClick={onApply}
                className="px-3 py-1.5 text-xs font-semibold bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition-colors"
            >
                Aplicar
            </button>
        </div>
    );
}
