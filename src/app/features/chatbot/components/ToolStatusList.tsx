"use client";

import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { ToolStatus } from "../types/chat-api.types";

interface Props {
  tools: ToolStatus[];
}

export default function ToolStatusList({ tools }: Props) {
  if (!tools.length) return null;

  return (
    <div className="flex flex-col gap-1 mb-2">
      {tools.map((t, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {t.status === "running" && (
            <Loader2 size={11} className="animate-spin text-violet-500 flex-shrink-0" />
          )}
          {t.status === "done" && (
            <CheckCircle2 size={11} className="text-emerald-500 flex-shrink-0" />
          )}
          {t.status === "error" && (
            <XCircle size={11} className="text-red-400 flex-shrink-0" />
          )}
          <span
            className={`text-xs ${
              t.status === "error"
                ? "text-red-400"
                : t.status === "running"
                ? "text-violet-500"
                : "text-gray-400"
            }`}
          >
            {t.label}
            {t.status === "error" && t.error && (
              <span className="ml-1 text-red-300">· {t.error}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
