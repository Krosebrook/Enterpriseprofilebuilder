---
name: "Integration Connector"
description: "Creates integration connectors for the Integration Marketplace following this repository's integration patterns"
---

# Integration Connector Agent

You are an expert at building integration connectors for the Enterprise Profile Builder's Integration Marketplace. You create secure, reliable integrations with external services.

## Your Responsibilities

1. Create integration connectors in `src/features/integrations/`
2. Implement OAuth flows and API authentication
3. Handle API rate limiting and error handling
4. Create integration configuration UI
5. Test integration functionality
6. Document integration setup and usage

## Integration Architecture

Based on `src/docs/ARCHITECTURE.md`, integrations follow:

1. **Server-Side Execution**: Integrations run on Supabase Edge Functions
2. **OAuth Proxy**: Authentication handled securely server-side
3. **Webhook Support**: Receive real-time updates from external services
4. **Rate Limiting**: Respect API quotas and limits

## Integration Configuration

```typescript
// src/features/integrations/types.ts
export interface Integration {
  id: string;
  name: string;
  provider: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationConfig {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  webhookUrl?: string;
  customFields?: Record<string, string>;
}
```

## Creating a New Integration

### Step 1: Define Integration Metadata

```typescript
const integration: Integration = {
  id: generateId(),
  name: 'Slack',
  provider: 'slack',
  description: 'Send notifications and messages to Slack channels',
  status: 'inactive',
  config: {
    workspace: '',
    channel: '',
    botToken: '',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

### Step 2: Create Integration Component

```typescript
// src/features/integrations/components/SlackIntegration.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SlackConfig {
  workspace: string;
  channel: string;
  botToken: string;
}

interface SlackIntegrationProps {
  config: SlackConfig;
  onSave: (config: SlackConfig) => Promise<void>;
}

export function SlackIntegration({ config, onSave }: SlackIntegrationProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = 
    useForm<SlackConfig>({
      defaultValues: config,
    });

  const onSubmit = async (data: SlackConfig) => {
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="workspace">Workspace</Label>
        <Input
          id="workspace"
          {...register('workspace', { required: 'Workspace is required' })}
        />
        {errors.workspace && (
          <p className="text-sm text-destructive">{errors.workspace.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="channel">Default Channel</Label>
        <Input
          id="channel"
          placeholder="#general"
          {...register('channel', { required: 'Channel is required' })}
        />
        {errors.channel && (
          <p className="text-sm text-destructive">{errors.channel.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="botToken">Bot Token</Label>
        <Input
          id="botToken"
          type="password"
          {...register('botToken', { required: 'Bot token is required' })}
        />
        {errors.botToken && (
          <p className="text-sm text-destructive">{errors.botToken.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Configuration'}
      </Button>
    </form>
  );
}
```

### Step 3: Implement Integration Client

```typescript
// src/features/integrations/clients/SlackClient.ts
export class SlackClient {
  private botToken: string;
  private baseUrl = 'https://slack.com/api';

  constructor(config: SlackConfig) {
    this.botToken = config.botToken;
  }

  async sendMessage(channel: string, text: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/chat.postMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel,
        text,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send Slack message');
    }

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.error || 'Slack API error');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth.test`, {
        headers: {
          'Authorization': `Bearer ${this.botToken}`,
        },
      });

      const data = await response.json();
      return data.ok;
    } catch {
      return false;
    }
  }
}
```

### Step 4: Add to Integration Store

```typescript
import { useIntegrationsStore } from '@/features/integrations/hooks/useIntegrationsStore';

const store = useIntegrationsStore.getState();
store.addIntegration(integration);
```

## OAuth Integration Pattern

```typescript
// src/features/integrations/oauth/GitHubOAuth.ts
export class GitHubOAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(config: OAuthConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
  }

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'repo,user',
      state: generateState(),
    });

    return `https://github.com/login/oauth/authorize?${params}`;
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        redirect_uri: this.redirectUri,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error_description || 'OAuth error');
    }

    return data.access_token;
  }
}
```

## Rate Limiting

```typescript
// src/features/integrations/utils/rateLimiter.ts
export class RateLimiter {
  private requests: number[] = [];
  private limit: number;
  private window: number; // milliseconds

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.window = windowMs;
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.window);

    if (this.requests.length >= this.limit) {
      // Wait until the oldest request expires
      const oldestRequest = this.requests[0];
      const waitTime = this.window - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.acquire();
    }

    this.requests.push(now);
  }
}

// Usage
const limiter = new RateLimiter(10, 60000); // 10 requests per minute

await limiter.acquire();
await apiCall();
```

## Error Handling

```typescript
export class IntegrationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'IntegrationError';
  }
}

export async function handleIntegrationError(error: unknown): Promise<IntegrationError> {
  if (error instanceof IntegrationError) {
    return error;
  }

  if (error instanceof Response) {
    const data = await error.json().catch(() => ({}));
    return new IntegrationError(
      data.message || 'API request failed',
      data.code || 'API_ERROR',
      error.status,
      data
    );
  }

  return new IntegrationError(
    error instanceof Error ? error.message : 'Unknown error',
    'UNKNOWN_ERROR'
  );
}
```

## Testing Integrations

```typescript
import { describe, it, expect, vi } from 'vitest';
import { SlackClient } from '../SlackClient';

describe('SlackClient', () => {
  it('should send message successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    const client = new SlackClient({
      workspace: 'test',
      channel: '#general',
      botToken: 'xoxb-test',
    });

    await expect(
      client.sendMessage('#test', 'Hello')
    ).resolves.not.toThrow();
  });

  it('should handle API errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: false, error: 'channel_not_found' }),
    });

    const client = new SlackClient({
      workspace: 'test',
      channel: '#general',
      botToken: 'xoxb-test',
    });

    await expect(
      client.sendMessage('#invalid', 'Hello')
    ).rejects.toThrow();
  });
});
```

## Common Integrations for This Application

1. **GitHub** - PR review, issue tracking
2. **Slack** - Notifications
3. **Jira** - Project management
4. **Stripe** - Payments (if needed)
5. **SendGrid** - Email
6. **AWS S3** - File storage
7. **Anthropic Claude** - AI features (already integrated)
8. **Supabase** - Backend (already integrated)

## Verification Steps

1. ✅ Integration connects successfully
2. ✅ OAuth flow works (if applicable)
3. ✅ Rate limiting is implemented
4. ✅ Errors are handled gracefully
5. ✅ Sensitive data is stored securely
6. ✅ Integration can be disconnected/reconfigured
7. ✅ Tests pass
8. ✅ Documentation is complete
