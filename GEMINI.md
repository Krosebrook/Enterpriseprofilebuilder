# GEMINI.md - Google Gemini Integration Guide

This document provides comprehensive documentation for integrating Google Gemini with the Enterprise Profile Builder.

---

## Overview

The Enterprise Profile Builder supports multi-model AI integration, including Google Gemini, enabling organizations to leverage the best AI capabilities for their specific use cases.

---

## Integration Architecture

### Multi-Provider Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI Provider Abstraction Layer                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Claude    │  │   Gemini    │  │   OpenAI    │              │
│  │   Adapter   │  │   Adapter   │  │   Adapter   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                    Unified API Interface                         │
│                    (Model Selection, Fallback, Load Balancing)   │
└─────────────────────────────────────────────────────────────────┘
```

### Provider Comparison

| Feature | Claude | Gemini | OpenAI |
|---------|--------|--------|--------|
| Max Context | 200K | 1M+ | 128K |
| Vision | Yes | Yes | Yes |
| Code Execution | Yes | Yes | Yes |
| Streaming | Yes | Yes | Yes |
| Fine-tuning | Limited | Yes | Yes |
| Enterprise | Yes | Yes | Yes |

---

## Setup

### Prerequisites

1. Google Cloud account with Gemini API access
2. API key or service account credentials
3. Node.js 18.x or 20.x

### Installation

```bash
# Install Google AI SDK
npm install @google/generative-ai

# Or for Vertex AI (enterprise)
npm install @google-cloud/vertexai
```

### Environment Configuration

```env
# Gemini API Key (AI Studio)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Or Vertex AI (Enterprise)
VITE_GOOGLE_CLOUD_PROJECT=your-project-id
VITE_GOOGLE_CLOUD_LOCATION=us-central1
VITE_GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Model Selection
VITE_GEMINI_MODEL=gemini-1.5-pro
VITE_GEMINI_VISION_MODEL=gemini-1.5-pro-vision
```

---

## Implementation

### Gemini Adapter

```typescript
// src/lib/api/gemini.ts

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

interface GeminiConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}

interface GeminiRequest {
  prompt: string;
  systemInstruction?: string;
  context?: string[];
  images?: string[];
  stream?: boolean;
}

interface GeminiResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: string;
}

export class GeminiAdapter {
  private client: GoogleGenerativeAI;
  private model: GenerativeModel;
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.model = this.client.getGenerativeModel({
      model: config.model,
      generationConfig: {
        maxOutputTokens: config.maxTokens || 8192,
        temperature: config.temperature || 0.7,
        topP: config.topP || 0.95,
        topK: config.topK || 40,
      },
    });
  }

  async generate(request: GeminiRequest): Promise<GeminiResponse> {
    const parts = this.buildParts(request);

    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts }],
      systemInstruction: request.systemInstruction,
    });

    const response = result.response;
    const text = response.text();
    const usage = response.usageMetadata;

    return {
      text,
      usage: {
        promptTokens: usage?.promptTokenCount || 0,
        completionTokens: usage?.candidatesTokenCount || 0,
        totalTokens: usage?.totalTokenCount || 0,
      },
      finishReason: response.candidates?.[0]?.finishReason || 'unknown',
    };
  }

  async *generateStream(request: GeminiRequest): AsyncGenerator<string> {
    const parts = this.buildParts(request);

    const result = await this.model.generateContentStream({
      contents: [{ role: 'user', parts }],
      systemInstruction: request.systemInstruction,
    });

    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  }

  async chat(history: ChatMessage[], message: string): Promise<GeminiResponse> {
    const chat = this.model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const response = result.response;

    return {
      text: response.text(),
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount || 0,
        completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata?.totalTokenCount || 0,
      },
      finishReason: response.candidates?.[0]?.finishReason || 'unknown',
    };
  }

  private buildParts(request: GeminiRequest): Part[] {
    const parts: Part[] = [];

    // Add context
    if (request.context?.length) {
      parts.push({ text: `Context:\n${request.context.join('\n\n')}` });
    }

    // Add images
    if (request.images?.length) {
      for (const image of request.images) {
        const [mimeType, data] = this.parseImage(image);
        parts.push({
          inlineData: { mimeType, data },
        });
      }
    }

    // Add prompt
    parts.push({ text: request.prompt });

    return parts;
  }

  private parseImage(image: string): [string, string] {
    if (image.startsWith('data:')) {
      const match = image.match(/^data:(.+?);base64,(.+)$/);
      if (match) {
        return [match[1], match[2]];
      }
    }
    // Assume base64 encoded image/png
    return ['image/png', image];
  }
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Part {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}
```

### Unified AI Provider

```typescript
// src/lib/api/ai-provider.ts

import { GeminiAdapter } from './gemini';
import { ClaudeAdapter } from './claude';

export type AIProvider = 'claude' | 'gemini' | 'openai';

interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  context?: string[];
  images?: string[];
  provider?: AIProvider;
  options?: {
    maxTokens?: number;
    temperature?: number;
    stream?: boolean;
  };
}

interface AIResponse {
  text: string;
  provider: AIProvider;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: Record<string, unknown>;
}

export class AIProviderManager {
  private claudeAdapter: ClaudeAdapter;
  private geminiAdapter: GeminiAdapter;
  private defaultProvider: AIProvider;
  private fallbackOrder: AIProvider[];

  constructor() {
    this.claudeAdapter = new ClaudeAdapter({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      model: 'claude-3-5-sonnet-20241022',
    });

    this.geminiAdapter = new GeminiAdapter({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-pro',
    });

    this.defaultProvider = 'claude';
    this.fallbackOrder = ['claude', 'gemini', 'openai'];
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const provider = request.provider || this.defaultProvider;

    try {
      return await this.executeWithProvider(provider, request);
    } catch (error) {
      // Fallback to next provider
      return this.executeWithFallback(provider, request, error as Error);
    }
  }

  private async executeWithProvider(
    provider: AIProvider,
    request: AIRequest
  ): Promise<AIResponse> {
    switch (provider) {
      case 'gemini':
        const geminiResponse = await this.geminiAdapter.generate({
          prompt: request.prompt,
          systemInstruction: request.systemPrompt,
          context: request.context,
          images: request.images,
        });
        return {
          text: geminiResponse.text,
          provider: 'gemini',
          usage: geminiResponse.usage,
        };

      case 'claude':
      default:
        const claudeResponse = await this.claudeAdapter.generate({
          prompt: request.prompt,
          system: request.systemPrompt,
          context: request.context,
          images: request.images,
        });
        return {
          text: claudeResponse.text,
          provider: 'claude',
          usage: claudeResponse.usage,
        };
    }
  }

  private async executeWithFallback(
    failedProvider: AIProvider,
    request: AIRequest,
    error: Error
  ): Promise<AIResponse> {
    console.warn(`Provider ${failedProvider} failed:`, error.message);

    for (const provider of this.fallbackOrder) {
      if (provider === failedProvider) continue;

      try {
        console.log(`Falling back to ${provider}`);
        return await this.executeWithProvider(provider, request);
      } catch (fallbackError) {
        console.warn(`Fallback to ${provider} failed:`, (fallbackError as Error).message);
      }
    }

    throw new Error('All AI providers failed');
  }

  setDefaultProvider(provider: AIProvider): void {
    this.defaultProvider = provider;
  }

  getProviderStatus(): Record<AIProvider, boolean> {
    return {
      claude: !!import.meta.env.VITE_ANTHROPIC_API_KEY,
      gemini: !!import.meta.env.VITE_GEMINI_API_KEY,
      openai: !!import.meta.env.VITE_OPENAI_API_KEY,
    };
  }
}

export const aiProvider = new AIProviderManager();
```

---

## Features

### Text Generation

```typescript
import { aiProvider } from './lib/api/ai-provider';

// Basic generation
const response = await aiProvider.generate({
  prompt: 'Explain quantum computing in simple terms',
  provider: 'gemini',
});

console.log(response.text);
```

### Vision (Multi-modal)

```typescript
// Generate with image
const response = await aiProvider.generate({
  prompt: 'Describe this image in detail',
  images: [base64ImageData],
  provider: 'gemini',
});
```

### Streaming

```typescript
import { geminiAdapter } from './lib/api/gemini';

for await (const chunk of geminiAdapter.generateStream({
  prompt: 'Write a long-form article about AI',
})) {
  process.stdout.write(chunk);
}
```

### Chat/Conversation

```typescript
const history = [
  { role: 'user', content: 'What is machine learning?' },
  { role: 'assistant', content: 'Machine learning is...' },
];

const response = await geminiAdapter.chat(history, 'How does it differ from AI?');
```

### Code Execution

```typescript
// Gemini can execute code in certain contexts
const response = await geminiAdapter.generate({
  prompt: 'Write and execute a Python function to calculate fibonacci',
  systemInstruction: 'You can execute code to verify your answers.',
});
```

---

## Model Selection

### Available Models

| Model | Best For | Context | Speed |
|-------|----------|---------|-------|
| gemini-1.5-flash | Fast responses | 1M tokens | Fast |
| gemini-1.5-pro | Complex reasoning | 2M tokens | Medium |
| gemini-1.0-pro | General use | 32K tokens | Fast |
| gemini-1.0-pro-vision | Image analysis | 16K tokens | Medium |

### Selection Strategy

```typescript
function selectModel(task: TaskType): string {
  switch (task) {
    case 'quick-response':
      return 'gemini-1.5-flash';
    case 'complex-analysis':
      return 'gemini-1.5-pro';
    case 'image-analysis':
      return 'gemini-1.5-pro-vision';
    case 'code-generation':
      return 'gemini-1.5-pro';
    default:
      return 'gemini-1.5-flash';
  }
}
```

---

## Security

### Input Validation

All inputs to Gemini go through the same security pipeline as Claude:

```typescript
import { securePipeline } from '../security/prompt-injection-defense';

// Validate before sending to Gemini
const result = await securePipeline.processRequest(
  userInput,
  systemPrompt,
  userId
);

if (result.allowed) {
  const response = await geminiAdapter.generate({
    prompt: result.sanitizedInput || userInput,
    systemInstruction: systemPrompt,
  });
}
```

### Output Validation

```typescript
import { OutputValidator } from '../security/prompt-injection-defense';

const validator = new OutputValidator();

const geminiResponse = await geminiAdapter.generate(request);

const validation = validator.validateOutput(geminiResponse.text);

if (!validation.safe) {
  // Use redacted output
  return validation.redactedOutput;
}

return geminiResponse.text;
```

### Rate Limiting

```typescript
import { RateLimiter } from '../security/prompt-injection-defense';

const rateLimiter = new RateLimiter();

const limit = await rateLimiter.checkRateLimit(userId);

if (!limit.allowed) {
  throw new Error(`Rate limit exceeded. Try again at ${limit.resetAt}`);
}
```

---

## Error Handling

### Error Types

```typescript
enum GeminiErrorCode {
  INVALID_API_KEY = 'INVALID_API_KEY',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  CONTENT_FILTERED = 'CONTENT_FILTERED',
  MODEL_NOT_FOUND = 'MODEL_NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR',
}

class GeminiError extends Error {
  constructor(
    message: string,
    public code: GeminiErrorCode,
    public retryable: boolean = false
  ) {
    super(message);
  }
}
```

### Error Handling

```typescript
try {
  const response = await geminiAdapter.generate(request);
  return response;
} catch (error) {
  if (error.message.includes('SAFETY')) {
    throw new GeminiError(
      'Content filtered by safety settings',
      GeminiErrorCode.CONTENT_FILTERED,
      false
    );
  }

  if (error.message.includes('quota')) {
    throw new GeminiError(
      'API quota exceeded',
      GeminiErrorCode.QUOTA_EXCEEDED,
      true
    );
  }

  if (error.message.includes('429')) {
    throw new GeminiError(
      'Rate limited by Gemini',
      GeminiErrorCode.RATE_LIMITED,
      true
    );
  }

  throw new GeminiError(
    'Unknown Gemini error',
    GeminiErrorCode.SERVER_ERROR,
    true
  );
}
```

### Retry Logic

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (error instanceof GeminiError && !error.retryable) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}
```

---

## Monitoring

### Usage Tracking

```typescript
interface GeminiUsageMetrics {
  totalRequests: number;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  averageLatency: number;
  errorRate: number;
  costEstimate: number;
}

class GeminiMetricsCollector {
  private metrics: GeminiUsageMetrics = {
    totalRequests: 0,
    totalTokens: 0,
    promptTokens: 0,
    completionTokens: 0,
    averageLatency: 0,
    errorRate: 0,
    costEstimate: 0,
  };

  recordRequest(response: GeminiResponse, latency: number): void {
    this.metrics.totalRequests++;
    this.metrics.totalTokens += response.usage.totalTokens;
    this.metrics.promptTokens += response.usage.promptTokens;
    this.metrics.completionTokens += response.usage.completionTokens;
    this.updateAverageLatency(latency);
    this.updateCostEstimate(response.usage);
  }

  private updateCostEstimate(usage: TokenUsage): void {
    // Gemini 1.5 Pro pricing (example)
    const promptCost = usage.promptTokens * 0.00000125; // $1.25 per 1M tokens
    const completionCost = usage.completionTokens * 0.00000375; // $3.75 per 1M tokens
    this.metrics.costEstimate += promptCost + completionCost;
  }

  getMetrics(): GeminiUsageMetrics {
    return { ...this.metrics };
  }
}
```

### Logging

```typescript
import { logger } from '../lib/logger';

// Log request
logger.info('Gemini request', {
  model: config.model,
  promptLength: request.prompt.length,
  hasImages: (request.images?.length || 0) > 0,
});

// Log response
logger.info('Gemini response', {
  model: config.model,
  tokensUsed: response.usage.totalTokens,
  latencyMs: endTime - startTime,
  finishReason: response.finishReason,
});

// Log error
logger.error('Gemini error', error, {
  model: config.model,
  errorCode: error.code,
});
```

---

## Best Practices

### 1. Use Appropriate Models

```typescript
// Fast tasks: use flash
const quickResponse = await aiProvider.generate({
  prompt: 'Quick question',
  provider: 'gemini',
  options: { model: 'gemini-1.5-flash' },
});

// Complex tasks: use pro
const analysis = await aiProvider.generate({
  prompt: 'Analyze this complex document...',
  provider: 'gemini',
  options: { model: 'gemini-1.5-pro' },
});
```

### 2. Optimize Prompts

```typescript
// Good: Clear, structured prompt
const prompt = `
Task: Summarize the following document
Format: Bullet points, max 5 items
Document:
${documentText}
`;

// Bad: Vague prompt
const prompt = 'Summarize this';
```

### 3. Handle Long Contexts

```typescript
// Gemini supports up to 1M tokens
// Use context caching for repeated calls
const cachedContext = await geminiAdapter.cacheContext(longDocument);

const response1 = await geminiAdapter.generate({
  prompt: 'Question 1',
  cachedContext,
});

const response2 = await geminiAdapter.generate({
  prompt: 'Question 2',
  cachedContext,
});
```

### 4. Implement Fallbacks

```typescript
// Always have fallback providers
const response = await aiProvider.generate({
  prompt: request.prompt,
  provider: 'gemini',
  fallbackProviders: ['claude', 'openai'],
});
```

---

## Migration from Claude

### Prompt Translation

| Claude | Gemini |
|--------|--------|
| `system` parameter | `systemInstruction` |
| `Human:` / `Assistant:` | `user` / `model` roles |
| `<thinking>` tags | Native reasoning |
| `max_tokens` | `maxOutputTokens` |

### Code Changes

```typescript
// Before (Claude)
const response = await claude.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  system: 'You are a helpful assistant',
  messages: [{ role: 'user', content: 'Hello' }],
  max_tokens: 1024,
});

// After (Gemini)
const response = await gemini.generateContent({
  model: 'gemini-1.5-pro',
  systemInstruction: 'You are a helpful assistant',
  contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
  generationConfig: { maxOutputTokens: 1024 },
});
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 400 Bad Request | Invalid prompt format | Check prompt structure |
| 403 Forbidden | Invalid API key | Verify credentials |
| 429 Too Many Requests | Rate limited | Implement backoff |
| Safety filter triggered | Content policy violation | Adjust prompt |
| Unexpected output | Model mismatch | Check model capabilities |

### Debug Mode

```typescript
// Enable debug logging
const geminiAdapter = new GeminiAdapter({
  apiKey: process.env.VITE_GEMINI_API_KEY,
  model: 'gemini-1.5-pro',
  debug: true, // Logs all requests/responses
});
```

---

## Resources

- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Pricing](https://ai.google.dev/pricing)
- [Model Comparison](https://ai.google.dev/models/gemini)

---

**Last Updated:** December 30, 2025
**Version:** 1.0.0
