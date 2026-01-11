import { getEnvConfig } from "../../config/env.config";
import { validate, validators } from "../validation";
import { logger } from "../logger";

export interface ChatRequest {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export async function sendChatRequest(request: ChatRequest) {
  // Validate input
  const validatedRequest = validate(request, validators.chatRequest, 'ChatRequest');
  
  // Get configuration from environment
  const envConfig = getEnvConfig();
  const { projectId, anonKey } = envConfig.supabase;
  
  const url = `https://${projectId}.supabase.co/functions/v1/make-server-0864fd03/chat`;
  
  logger.debug('Sending chat request', {
    url,
    model: validatedRequest.model,
    hasSystemPrompt: !!validatedRequest.systemPrompt,
    promptLength: validatedRequest.prompt.length,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${anonKey}`
    },
    body: JSON.stringify(validatedRequest),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    logger.error('Chat request failed', new Error(error.error || response.statusText), {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error(error.error || "Failed to send chat request");
  }

  logger.debug('Chat request successful');
  return response;
}
