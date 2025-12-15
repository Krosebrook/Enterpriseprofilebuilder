import { projectId } from "../../utils/supabase/info";

export interface ChatRequest {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export async function sendChatRequest(request: ChatRequest) {
  const url = `https://${projectId}.supabase.co/functions/v1/make-server-0864fd03/chat`;
  
  // Get anon key from env or use a placeholder if testing locally without it (though it won't work on Supabase)
  // In this environment, we might need to rely on the fact that the proxy handles it or we need to pass it.
  // The system prompt says: "When sending requests to the server, use Authorization: Bearer ${publicAnonKey}"
  // I need publicAnonKey.
  
  // I'll import it.
  const { publicAnonKey } = await import("../../utils/supabase/info");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || "Failed to send chat request");
  }

  return response;
}
