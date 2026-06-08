"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot } from "lucide-react";
import { ChatUIMessage, ChatWidgetInstance } from "../types/chat-api.types";
import { ShowSpaceCarouselResult, OpenParticipantPickerResult } from "../types/chat-tools.types";
import ThinkingBlock from "./ThinkingBlock";
import ToolStatusList from "./ToolStatusList";
import SpaceCarousel from "./SpaceCarousel";
import ParticipantPicker from "./ParticipantPicker";

interface Props {
  message: ChatUIMessage;
  onWidgetResult: (widgetId: string, toolName: string, result: Record<string, unknown>, cancelled?: boolean) => void;
}

function WidgetRenderer({
  instance,
  onResult,
}: {
  instance: ChatWidgetInstance;
  onResult: (result: Record<string, unknown>, cancelled?: boolean) => void;
}) {
  if (instance.resolved) return null;

  const { widget } = instance;

  if (widget.type === "space_carousel") {
    return (
      <SpaceCarousel
        args={widget.args}
        onSelect={(r: ShowSpaceCarouselResult) =>
          onResult(r as Record<string, unknown>, r.selected_id === null)
        }
      />
    );
  }

  if (widget.type === "participant_picker") {
    return (
      <ParticipantPicker
        args={widget.args}
        onConfirm={(r: OpenParticipantPickerResult) =>
          onResult(r as Record<string, unknown>, false)
        }
      />
    );
  }

  // Fallback: unknown widget type — don't block the conversation
  return (
    <div className="mt-1 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-600">
      Widget no soportado: <strong>{instance.toolName}</strong>. El asistente continuará sin esta información.
    </div>
  );
}

export default function MessageBubble({ message, onWidgetResult }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[65%] rounded-2xl rounded-br-sm px-5 py-3 bg-[#1a1a2e] text-white text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
        <Bot size={18} className="text-white" />
      </div>

      <div className="flex flex-col gap-2 max-w-[75%] min-w-0">
        {message.thinking && (
          <ThinkingBlock
            text={message.thinking}
            isStreaming={message.isStreaming && !message.content}
          />
        )}

        {message.tools && message.tools.length > 0 && (
          <ToolStatusList tools={message.tools} />
        )}

        {(message.content || message.isStreaming) && (
          <div className="rounded-2xl rounded-bl-sm px-5 py-3 bg-white text-gray-800 text-sm leading-relaxed shadow-sm">
            {message.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">{children}</strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-0.5 my-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-0.5 my-1">{children}</ol>
                  ),
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-2">
                      <table className="text-xs border-collapse w-full">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-200 px-2 py-1 bg-gray-50 font-semibold text-left">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-200 px-2 py-1">{children}</td>
                  ),
                  p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                  code: ({ children }) => (
                    <code className="bg-gray-100 rounded px-1 py-0.5 text-xs font-mono">
                      {children}
                    </code>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <span className="flex gap-1.5 items-center py-0.5">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            )}
          </div>
        )}

        {message.widgets?.map((instance) => (
          <WidgetRenderer
            key={instance.widgetId}
            instance={instance}
            onResult={(result, cancelled) =>
              onWidgetResult(instance.widgetId, instance.toolName, result, cancelled)
            }
          />
        ))}
      </div>
    </div>
  );
}
