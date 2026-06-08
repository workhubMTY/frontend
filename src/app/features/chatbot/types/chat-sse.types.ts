export type SSEEventType =
  | "thinking"
  | "token"
  | "tool_start"
  | "tool_done"
  | "client_tool"
  | "retrying"
  | "done"
  | "error";

export interface ThinkingEventData { text: string }
export interface TokenEventData { text: string }
export interface ToolStartEventData { name: string; label: string }
export interface ToolDoneEventData { name: string; label: string; ok: boolean; error?: string }
/** Each client_tool event now carries a stable widgetId */
export interface ClientToolEventData {
  widgetId: string;
  name: string;
  args: Record<string, unknown>;
}
export interface DoneEventData {
  message: string;
  /** widgetIds of CLIENT tools that need user input before continuing */
  pending_widgets?: string[];
}
export interface RetryingEventData {
  attempt: number;
  message: string;
}
export interface ErrorEventData { message: string }

export type SSEPayloadMap = {
  thinking: ThinkingEventData;
  token: TokenEventData;
  tool_start: ToolStartEventData;
  tool_done: ToolDoneEventData;
  client_tool: ClientToolEventData;
  retrying: RetryingEventData;
  done: DoneEventData;
  error: ErrorEventData;
};
