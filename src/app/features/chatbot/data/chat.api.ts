import { API_URL } from "@/app/shared/data/api";
import { ChatApiRequest } from "../types/chat-api.types";
import { SSEEventType, SSEPayloadMap } from "../types/chat-sse.types";

export interface SSEEvent<T extends SSEEventType = SSEEventType> {
  event: T;
  data: SSEPayloadMap[T];
}

export async function* sendChatMessage(
  payload: ChatApiRequest,
  token: string,
): AsyncGenerator<SSEEvent> {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.body) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message ?? `HTTP ${response.status}`);
  }

  yield* parseSseStream(response.body);
}

async function* parseSseStream(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<SSEEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";

      for (const block of blocks) {
        if (!block.trim()) continue;
        let event = "";
        let dataStr = "";
        for (const line of block.split("\n")) {
          if (line.startsWith("event: ")) event = line.slice(7).trim();
          else if (line.startsWith("data: ")) dataStr = line.slice(6).trim();
        }
        if (event && dataStr) {
          try {
            yield {
              event: event as SSEEventType,
              data: JSON.parse(dataStr),
            } as SSEEvent;
          } catch {
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
