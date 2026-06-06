"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CalendarPlus,
  Users,
  CalendarRange,
  Bot,
  Send,
} from "lucide-react";
const AccentureLogo = "/accenture_logo_purple1.png";
import Image from "next/image";
import DownTransition from "@/app/shared/components/PageTransition/DownTransition";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolUse?: string[];   // herramientas MCP usadas (se muestran discretamente)
}

// ─── Config API ───────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL ?? "http://localhost:3000";

// sessionId se mantiene en memoria mientras la página esté abierta
let sessionId: string | null = null;

async function* streamChat(message: string): AsyncGenerator<{
  type: string;
  text?: string;
  sessionId?: string;
}> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!res.ok || !res.body) throw new Error(`Error del servidor: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      try { yield JSON.parse(line); } catch { /* ignorar líneas malformadas */ }
    }
  }
}

// ─── Quick actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    id: "search",
    icon: Search,
    label: "Busca salas\ndisponibles",
    prompt: "¿Qué salas de juntas tienen disponibles?",
  },
  {
    id: "reserve",
    icon: CalendarPlus,
    label: "Reserva un\nespacio",
    prompt: "Quiero reservar una sala",
  },
  {
    id: "friends",
    icon: Users,
    label: "¿Qué amigos van\nhoy a la oficina?",
    prompt: "¿Qué amigos van hoy a la oficina?",
  },
  {
    id: "multiple",
    icon: CalendarRange,
    label: "Realiza una\nagenda múltiple",
    prompt: "Quiero realizar una agenda múltiple",
  },
];

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ChatbotPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    // Primera vez: agrega el saludo del asistente + el mensaje del usuario
    if (messages.length === 0) {
      setMessages([
        { id: "greeting", role: "assistant", content: "Hola! ¿Cómo puedo asistirle hoy?" },
        userMsg,
      ]);
    } else {
      setMessages((prev) => [...prev, userMsg]);
    }

    setInput("");
    inputRef.current?.focus();
    setIsTyping(true);

    // Agrega burbuja vacía del asistente (se irá llenando con el stream)
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", toolUse: [] },
    ]);

    try {
      for await (const chunk of streamChat(text.trim())) {
        // Guarda el sessionId para mantener contexto
        if (chunk.type === "session" && chunk.sessionId) {
          sessionId = chunk.sessionId;
        }
        // Muestra qué herramienta MCP se está usando
        else if (chunk.type === "tool_use" && chunk.text) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, toolUse: [...(m.toolUse ?? []), chunk.text!] }
                : m
            )
          );
        }
        // Acumula el texto de la respuesta (streaming)
        else if (chunk.type === "content" && chunk.text) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: m.content + chunk.text }
                : m
            )
          );
        }
        // Error del backend
        else if (chunk.type === "error") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: "Lo siento, ocurrió un error. Intenta de nuevo." }
                : m
            )
          );
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "No pude conectarme al servidor. Verifica tu conexión." }
            : m
        )
      );
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [isTyping, messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <DownTransition>
      <div className="w-screen h-screen flex flex-col bg-[#e8e8e8] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-8 py-5">
          <a href="/home">
            <Image src={AccentureLogo} alt="accenture logo" width={40} height={40} />
          </a>
          <span className="text-2xl font-semibold text-gray-800 tracking-wide">
            Chatbot
          </span>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {!hasMessages ? (
            /* ── Estado vacío: quick actions ── */
            <div className="flex-1 flex flex-col items-center justify-center px-12 gap-10">
              <h1 className="text-2xl font-normal text-gray-700 text-center">
                ¡Hola! ¿Cómo puedo asistirle hoy?
              </h1>
              <div className="grid grid-cols-4 gap-4 w-full max-w-5xl">
                {QUICK_ACTIONS.map(({ id, icon: Icon, label, prompt }) => (
                  <button
                    key={id}
                    onClick={() => sendMessage(prompt)}
                    className="flex flex-col items-center justify-center gap-3 bg-[#d0d0d0] hover:bg-[#c8c8c8] active:scale-95 rounded-2xl p-7 min-h-[140px] transition-all duration-150 text-center"
                  >
                    <Icon size={34} className="text-gray-700" strokeWidth={1.3} />
                    <span className="text-sm text-gray-700 leading-snug font-medium whitespace-pre-line">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── Historial de mensajes ── */
            <div className="flex-1 flex flex-col px-12 py-6 gap-4 max-w-5xl mx-auto w-full">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                      <Bot size={20} className="text-white" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1 max-w-[55%]">
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 ml-1">
                        <span className="text-xs text-gray-500 font-medium">
                          Asistente virtual
                        </span>
                        {/* Badges de herramientas MCP (discretos) */}
                        {msg.toolUse?.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-gray-400 bg-gray-200 rounded-full px-2 py-0.5"
                          >
                            {t.replace("🔧 Consultando: ", "")}
                          </span>
                        ))}
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-[#1a1a2e] text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      {/* Burbuja vacía mientras llega el stream */}
                      {msg.content || (msg.role === "assistant" && isTyping && (
                        <span className="flex gap-2 items-center py-0.5">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input bar — idéntico al original */}
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
              className="flex-shrink-0 bg-[#d4d4d4] hover:bg-[#cacaca] active:bg-[#c0c0c0] transition-colors duration-150 text-sm font-medium text-gray-700 w-[110px] h-[52px] whitespace-nowrap"
            >
              Volver
            </button>
            <form onSubmit={handleSubmit} className="flex-1 ml-3 mb-1">
              <div className="flex items-center bg-[#d4d4d4] rounded-full px-4 py-0.5">
                <svg
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#6b7280" strokeWidth="1.8" className="flex-shrink-0"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Solicita al chatbot..."
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