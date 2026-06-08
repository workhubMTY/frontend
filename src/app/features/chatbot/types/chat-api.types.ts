export interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SingleWidgetResult {
  widget_id: string;
  tool_name: string;
  args: Record<string, unknown>;
  cancelled?: boolean;
}

export interface ChatApiRequest {
  messages: HistoryMessage[];
  message: string;
  widget_results?: SingleWidgetResult[];
}

export interface ToolStatus {
  name: string;
  label: string;
  status: "running" | "done" | "error";
  error?: string;
}

export type ChatUIMessageRole = "user" | "assistant";

export interface ChatUIMessage {
  id: string;
  role: ChatUIMessageRole;
  content: string;
  thinking?: string;
  tools?: ToolStatus[];
  isStreaming?: boolean;
  /** Multiple widgets can be pending simultaneously in one message */
  widgets?: ChatWidgetInstance[];
}

export type ChatWidget =
  | { type: "space_carousel"; args: import("./chat-tools.types").ShowSpaceCarouselArgs }
  | { type: "participant_picker"; args: import("./chat-tools.types").OpenParticipantPickerArgs };

export interface ChatWidgetInstance {
  widgetId: string;       // UUID from backend — used to match tool_result
  toolName: string;
  widget: ChatWidget;
  resolved: boolean;      // true once user interacted
  result?: Record<string, unknown>;
  cancelled?: boolean;
}
