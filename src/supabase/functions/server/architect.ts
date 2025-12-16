// Create an endpoint for architecture generation if we want to move logic server side later
// For now, the prompt is handled in the frontend lib/api/architect.ts via the /chat endpoint
// This file is just a placeholder to remind us that we can create specialized endpoints
import { Hono } from "npm:hono";
const app = new Hono();
export default app;
