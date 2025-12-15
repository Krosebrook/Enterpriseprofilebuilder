import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { claudeService } from "./claude_service.ts";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "x-user-id"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-0864fd03/health", (c) => {
  return c.json({ status: "ok" });
});

// Chat endpoint (Secure Proxy to Claude)
app.post("/make-server-0864fd03/chat", async (c) => {
  try {
    const body = await c.req.json();
    const { prompt, systemPrompt, model, temperature, maxTokens, stream } = body;
    const userId = c.req.header("x-user-id") || "anonymous";

    // Rate Limiting (Simple 20 requests per minute per user)
    const rateLimitKey = `ratelimit:${userId}`;
    const rateLimitData = await kv.get(rateLimitKey) || { count: 0, resetAt: Date.now() + 60000 };
    
    if (Date.now() > rateLimitData.resetAt) {
      rateLimitData.count = 0;
      rateLimitData.resetAt = Date.now() + 60000;
    }

    if (rateLimitData.count >= 20) {
      return c.json({ error: "Rate limit exceeded" }, 429);
    }

    rateLimitData.count++;
    await kv.set(rateLimitKey, rateLimitData);

    // Call Claude Service
    if (stream) {
      const streamBody = await claudeService.streamMessage(prompt, systemPrompt, model, temperature, maxTokens);
      return new Response(streamBody, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } else {
      const response = await claudeService.sendMessage(prompt, systemPrompt, model, temperature, maxTokens);
      return c.json(response);
    }
  } catch (error: any) {
    console.error("Chat Error:", error);
    return c.json({ error: error.message || "Internal Server Error" }, 500);
  }
});

Deno.serve(app.fetch);
