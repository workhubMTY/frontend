"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, CalendarPlus, Users, CalendarRange, Bot, Send, Car } from "lucide-react";
import Image from "next/image";
import DownTransition from "@/app/shared/components/PageTransition/DownTransition";
import { useAuth } from "@/app/shared/auth/useAuth";
import { sendChatMessage } from "@/app/features/chatbot/data/chat.api";
import MessageBubble from "@/app/features/chatbot/components/MessageBubble";
import {
  ChatUIMessage,
  ChatWidgetInstance,
  HistoryMessage,
  SingleWidgetResult,
  ChatWidget,
} from "@/app/features/chatbot/types/chat-api.types";
import {
  ShowSpaceCarouselArgs,
  OpenParticipantPickerArgs,
} from "@/app/features/chatbot/types/chat-tools.types";
import type {
  ClientToolEventData,
  DoneEventData,
  ErrorEventData,
  ThinkingEventData,
  TokenEventData,
  ToolDoneEventData,
  ToolStartEventData,
} from "@/app/features/chatbot/types/chat-sse.types";

const AccentureLogo = "/accenture_logo_purple1.png";

const QUICK_ACTIONS = [
  { id: "search", icon: Search, label: "Busca salas\ndisponibles", prompt: "¿Qué salas tienen disponibles para hoy?" },
  { id: "reserve", icon: CalendarPlus, label: "Reserva un\nespacio", prompt: "Quiero reservar una sala" },
  { id: "parking", icon: Car, label: "Reservar\nestacionamiento", prompt: "Quiero reservar un cajón de estacionamiento" },
  { id: "calendar", icon: CalendarRange, label: "Ver mis\nreservaciones", prompt: "Muéstrame mis reservaciones de hoy" },
];

let _seq = 0;
const uid = () => `m${++_seq}-${Date.now()}`;

function toWidgetInstance(
  widgetId: string,
  name: string,
  args: Record<string, unknown>,
): ChatWidgetInstance | null {
  let widget: ChatWidget | null = null;

  if (name === "showSpaceCarousel") {
    widget = { type: "space_carousel", args: args as unknown as ShowSpaceCarouselArgs };
  } else if (name === "openParticipantPicker") {
    widget = { type: "participant_picker", args: args as unknown as OpenParticipantPickerArgs };
  }

  if (!widget) return null;

  return { widgetId, toolName: name, widget, resolved: false };
}

export default function ChatbotPage() {
  const router = useRouter();
  const { accessToken, silentRefresh } = useAuth();

  const [uiMessages, setUiMessages] = useState<ChatUIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const historyRef = useRef<HistoryMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [uiMessages]);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (accessToken) return accessToken;
    return silentRefresh();
  }, [accessToken, silentRefresh]);

  const patchMsg = useCallback(
    (id: string, updater: (m: ChatUIMessage) => ChatUIMessage) => {
      setUiMessages((prev) => prev.map((m) => (m.id === id ? updater(m) : m)));
    },
    [],
  );

  const runStream = useCallback(
    async (opts: {
      userMessage?: string;
      widgetResults?: SingleWidgetResult[];
    }) => {
      const { userMessage, widgetResults } = opts;
      const token = await getToken();
      if (!token) { router.push("/login"); return; }

      // Push user bubble
      if (userMessage) {
        const userBubble: ChatUIMessage = { id: uid(), role: "user", content: userMessage };
        setUiMessages((prev) =>
          prev.length === 0
            ? [{ id: "greeting", role: "assistant", content: "¡Hola! ¿En qué puedo ayudarte hoy?" }, userBubble]
            : [...prev, userBubble],
        );
        historyRef.current = [...historyRef.current, { role: "user", content: userMessage }];
      }

      // Push empty assistant bubble
      const aId = uid();
      setUiMessages((prev) => [
        ...prev,
        { id: aId, role: "assistant", content: "", thinking: "", tools: [], widgets: [], isStreaming: true },
      ]);

      setInput("");
      inputRef.current?.focus();
      setIsTyping(true);

      try {
        const stream = sendChatMessage(
          {
            messages: userMessage
              ? historyRef.current.slice(0, -1)
              : historyRef.current,
            message: userMessage ?? "",
            widget_results: widgetResults,
          },
          token,
        );

        let finalContent = "";
        // Collect widgets emitted during this stream
        const streamWidgets = new Map<string, ChatWidgetInstance>();

        for await (const evt of stream) {
          switch (evt.event) {
            case "thinking": {
              const d = evt.data as ThinkingEventData;
              patchMsg(aId, (m) => ({ ...m, thinking: (m.thinking ?? "") + d.text }));
              break;
            }
            case "token": {
              const d = evt.data as TokenEventData;
              finalContent += d.text;
              patchMsg(aId, (m) => ({ ...m, content: m.content + d.text }));
              break;
            }
            case "tool_start": {
              const d = evt.data as ToolStartEventData;
              patchMsg(aId, (m) => ({
                ...m,
                tools: [...(m.tools ?? []), { name: d.name, label: d.label, status: "running" as const }],
              }));
              break;
            }
            case "tool_done": {
              const d = evt.data as ToolDoneEventData;
              patchMsg(aId, (m) => ({
                ...m,
                tools: (m.tools ?? []).map((t) =>
                  t.name === d.name
                    ? { ...t, status: d.ok ? ("done" as const) : ("error" as const), error: d.error }
                    : t,
                ),
              }));
              break;
            }
            case "client_tool": {
              const d = evt.data as ClientToolEventData;
              const instance = toWidgetInstance(d.widgetId, d.name, d.args);
              if (instance) {
                streamWidgets.set(d.widgetId, instance);
                patchMsg(aId, (m) => ({
                  ...m,
                  widgets: [...(m.widgets ?? []), instance],
                }));
              } else {
                console.warn("[chat] Unknown client tool, auto-cancelling:", d.name);
              }
              break;
            }
            case "done": {
              const d = evt.data as DoneEventData;
              finalContent = d.message || finalContent;
              patchMsg(aId, (m) => ({ ...m, content: finalContent, isStreaming: false }));
              if (finalContent) {
                historyRef.current = [...historyRef.current, { role: "assistant", content: finalContent }];
              }
              break;
            }
            case "error": {
              const d = evt.data as ErrorEventData;
              patchMsg(aId, (m) => ({ ...m, content: `⚠️ ${d.message}`, isStreaming: false }));
              break;
            }
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error de conexión";
        patchMsg(aId, (m) => ({ ...m, content: `⚠️ ${msg}`, isStreaming: false }));
      } finally {
        setIsTyping(false);
        patchMsg(aId, (m) => ({ ...m, isStreaming: false }));
      }
    },
    [getToken, router, patchMsg],
  );

  const pendingWidgetResultsRef = useRef<Map<string, SingleWidgetResult>>(new Map());
  const pendingWidgetIdsRef = useRef<Set<string>>(new Set());

  const handleWidgetResult = useCallback(
    (widgetId: string, toolName: string, result: Record<string, unknown>, cancelled?: boolean) => {
      setUiMessages((prev) =>
        prev.map((m) => ({
          ...m,
          widgets: m.widgets?.map((w) =>
            w.widgetId === widgetId ? { ...w, resolved: true, result, cancelled } : w,
          ),
        })),
      );

      const singleResult: SingleWidgetResult = { widget_id: widgetId, tool_name: toolName, args: result, cancelled };
      pendingWidgetResultsRef.current.set(widgetId, singleResult);

      const allResolved = [...pendingWidgetIdsRef.current].every(
        (id) => pendingWidgetResultsRef.current.has(id),
      );

      if (allResolved && pendingWidgetIdsRef.current.size > 0) {
        const results = [...pendingWidgetResultsRef.current.values()];
        // Reset accumulators
        pendingWidgetResultsRef.current = new Map();
        pendingWidgetIdsRef.current = new Set();
        // Resume conversation with all results
        runStream({ widgetResults: results });
      }
    },
    [runStream],
  );

  const setPendingWidgetIds = useCallback((ids: string[]) => {
    pendingWidgetIdsRef.current = new Set(ids);
    pendingWidgetResultsRef.current = new Map();
  }, []);

  const setPendingRef = useRef(setPendingWidgetIds);
  setPendingRef.current = setPendingWidgetIds;

  // Re-create runStream with access to setPendingRef
  const runStreamFull = useCallback(
    async (opts: {
      userMessage?: string;
      widgetResults?: SingleWidgetResult[];
    }) => {
      const { userMessage, widgetResults } = opts;
      const token = await getToken();
      if (!token) { router.push("/login"); return; }

      if (userMessage) {
        const userBubble: ChatUIMessage = { id: uid(), role: "user", content: userMessage };
        setUiMessages((prev) =>
          prev.length === 0
            ? [{ id: "greeting", role: "assistant", content: "¡Hola! ¿En qué puedo ayudarte hoy?" }, userBubble]
            : [...prev, userBubble],
        );
        historyRef.current = [...historyRef.current, { role: "user", content: userMessage }];
      }

      const aId = uid();
      setUiMessages((prev) => [
        ...prev,
        { id: aId, role: "assistant", content: "", thinking: "", tools: [], widgets: [], isStreaming: true },
      ]);
      setInput("");
      inputRef.current?.focus();
      setIsTyping(true);

      try {
        const stream = sendChatMessage(
          {
            messages: userMessage ? historyRef.current.slice(0, -1) : historyRef.current,
            message: userMessage ?? "",
            widget_results: widgetResults,
          },
          token,
        );

        let finalContent = "";

        for await (const evt of stream) {
          switch (evt.event) {
            case "thinking": {
              const d = evt.data as ThinkingEventData;
              patchMsg(aId, (m) => ({ ...m, thinking: (m.thinking ?? "") + d.text }));
              break;
            }
            case "token": {
              const d = evt.data as TokenEventData;
              finalContent += d.text;
              patchMsg(aId, (m) => ({ ...m, content: m.content + d.text }));
              break;
            }
            case "tool_start": {
              const d = evt.data as ToolStartEventData;
              patchMsg(aId, (m) => ({
                ...m,
                tools: [...(m.tools ?? []), { name: d.name, label: d.label, status: "running" as const }],
              }));
              break;
            }
            case "tool_done": {
              const d = evt.data as ToolDoneEventData;
              patchMsg(aId, (m) => ({
                ...m,
                tools: (m.tools ?? []).map((t) =>
                  t.name === d.name
                    ? { ...t, status: d.ok ? ("done" as const) : ("error" as const), error: d.error }
                    : t,
                ),
              }));
              break;
            }
            case "client_tool": {
              const d = evt.data as ClientToolEventData;
              const instance = toWidgetInstance(d.widgetId, d.name, d.args);
              if (instance) {
                patchMsg(aId, (m) => ({ ...m, widgets: [...(m.widgets ?? []), instance] }));
              }
              break;
            }
            case "done": {
              const d = evt.data as DoneEventData;
              finalContent = d.message || finalContent;
              patchMsg(aId, (m) => ({ ...m, content: finalContent, isStreaming: false }));
              if (finalContent) {
                historyRef.current = [...historyRef.current, { role: "assistant", content: finalContent }];
              }
              // Register pending widgets so handleWidgetResult knows when all are done
              if (d.pending_widgets?.length) {
                setPendingRef.current(d.pending_widgets);
              }
              break;
            }
            case "error": {
              const d = evt.data as ErrorEventData;
              patchMsg(aId, (m) => ({ ...m, content: `⚠️ ${d.message}`, isStreaming: false }));
              break;
            }
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error de conexión";
        patchMsg(aId, (m) => ({ ...m, content: `⚠️ ${msg}`, isStreaming: false }));
      } finally {
        setIsTyping(false);
        patchMsg(aId, (m) => ({ ...m, isStreaming: false }));
      }
    },
    [getToken, router, patchMsg],
  );

  const sendUserMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;
      runStreamFull({ userMessage: text.trim() });
    },
    [runStreamFull, isTyping],
  );

  const runStreamRef = useRef(runStreamFull);
  runStreamRef.current = runStreamFull;

  const handleWidgetResultFull = useCallback(
    (widgetId: string, toolName: string, result: Record<string, unknown>, cancelled?: boolean) => {
      setUiMessages((prev) =>
        prev.map((m) => ({
          ...m,
          widgets: m.widgets?.map((w) =>
            w.widgetId === widgetId ? { ...w, resolved: true, result, cancelled } : w,
          ),
        })),
      );

      const singleResult: SingleWidgetResult = { widget_id: widgetId, tool_name: toolName, args: result, cancelled };
      pendingWidgetResultsRef.current.set(widgetId, singleResult);

      const allResolved =
        pendingWidgetIdsRef.current.size > 0 &&
        [...pendingWidgetIdsRef.current].every((id) => pendingWidgetResultsRef.current.has(id));

      if (allResolved) {
        const results = [...pendingWidgetResultsRef.current.values()];
        pendingWidgetResultsRef.current = new Map();
        pendingWidgetIdsRef.current = new Set();
        runStreamRef.current({ widgetResults: results });
      }
    },
    [],
  );

  const hasMessages = uiMessages.length > 0;

  return (
    <DownTransition>
      <div className="flex flex-col h-screen bg-[#e8e8e8]">
        {/* Header */}
        <div className="flex items-center px-8 pt-6 pb-4 gap-4">
          <Image src={AccentureLogo} alt="Logo" width={32} height={32} className="opacity-80" />
          <div>
            <h1 className="text-base font-semibold text-gray-800 leading-tight">Asistente virtual</h1>
            <p className="text-xs text-gray-500">WorkHub · Reservaciones y más</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isTyping ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
            <span className="text-xs text-gray-500">{isTyping ? "Procesando..." : "En línea"}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Bot size={32} className="text-white" strokeWidth={1.5} />
                </div>
                <h2 className="text-lg font-semibold text-gray-700">¿En qué te ayudo hoy?</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Reserva espacios de oficina, estacionamiento y gestiona tu agenda.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {QUICK_ACTIONS.map(({ id, icon: Icon, label, prompt }) => (
                  <button
                    key={id}
                    onClick={() => sendUserMessage(prompt)}
                    disabled={isTyping}
                    className="flex flex-col items-center justify-center gap-3 bg-[#d0d0d0] hover:bg-[#c8c8c8] active:scale-95 rounded-2xl p-7 min-h-[140px] transition-all duration-150 text-center disabled:opacity-50"
                  >
                    <Icon size={34} className="text-gray-700" strokeWidth={1.3} />
                    <span className="text-sm text-gray-700 leading-snug font-medium whitespace-pre-line">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col px-6 md:px-12 py-6 gap-5 max-w-3xl mx-auto w-full">
              {uiMessages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onWidgetResult={handleWidgetResultFull}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="w-full bg-[#e8e8e8]">
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <clipPath id="tab-shape" clipPathUnits="objectBoundingBox">
                <path d="M0.20,0.08 Q0.22,0 0.30,0 L0.70,0 Q0.78,0 0.80,0.08 L1,1 L0,1 Z" />
              </clipPath>
            </defs>
          </svg>
          <div className="flex items-end w-full px-6 pt-2">
            <button
              onClick={() => router.back()}
              style={{ clipPath: "url(#tab-shape)" }}
              className="flex-shrink-0 bg-[#d4d4d4] hover:bg-[#cacaca] active:bg-[#c0c0c0] transition-colors text-sm font-medium text-gray-700 w-[110px] h-[52px]"
            >
              Volver
            </button>
            <form
              onSubmit={(e) => { e.preventDefault(); sendUserMessage(input); }}
              className="flex-1 ml-3 mb-1"
            >
              <div className="flex items-center bg-[#d4d4d4] rounded-full px-4 py-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" className="flex-shrink-0">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-gray-600 placeholder-gray-500 outline-none"
                  disabled={isTyping}
                  autoFocus
                />
                {input.trim() && (
                  <button
                    type="submit"
                    disabled={isTyping}
                    className="w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#6D28D9] transition-colors disabled:opacity-50"
                  >
                    <Send size={14} className="text-white ml-0.5" />
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="w-full h-6 bg-[#d4d4d4]" />
        </div>
      </div>
    </DownTransition>
  );
}
