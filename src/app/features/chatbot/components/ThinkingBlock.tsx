"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Brain } from "lucide-react";

interface Props {
  text: string;
  isStreaming?: boolean;
}

export default function ThinkingBlock({ text, isStreaming }: Props) {
  const [open, setOpen] = useState(false);

  if (!text) return null;

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors group"
      >
        <Brain size={12} className={isStreaming ? "animate-pulse text-violet-400" : "text-gray-400"} />
        <span className="font-medium">
          {isStreaming ? "Pensando..." : "Ver razonamiento"}
        </span>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>

      {open && (
        <div className="mt-1.5 ml-4 border-l-2 border-gray-200 pl-3 max-h-48 overflow-y-auto">
          <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap font-mono">
            {text}
            {isStreaming && (
              <span className="inline-block w-1.5 h-3 bg-gray-400 ml-0.5 animate-pulse" />
            )}
          </p>
        </div>
      )}
    </div>
  );
}
