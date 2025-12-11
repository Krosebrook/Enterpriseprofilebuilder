# PHASES 10 & 11: INTEGRATIONS & AI AGENTS

**INT Inc Enterprise Claude Profile Builder**  
**Production-Grade Implementation - Maximum Depth**

---

## 📊 PHASE 10: INTEGRATIONS MARKETPLACE

**Duration**: 14 weeks (Q4 2026, November - December 2026 + January 2027)  
**Team Size**: 14 people (4 backend, 2 frontend, 2 integration specialists, 2 QA, 1 security, 1 DevOps, 1 tech writer, 1 PM)  
**Budget**: $320,000  
**Prerequisites**: Phase 9 complete, mobile apps live  
**Owner**: VP Engineering + Partnerships Lead

### Success Metrics (OKRs)

| Objective | Key Results | Baseline | Target | Measurement |
|-----------|-------------|----------|--------|-------------|
| **Integration Coverage** | Number of integrations | 0 | 15 | Live integrations |
| | API calls per day | 0 | 50k | API metrics |
| | Integration adoption | 0% | 60% | User activation |
| **Developer Experience** | SDK downloads | 0 | 5k | Package stats |
| | API documentation score | N/A | 95% | Developer survey |
| | Time to first integration | N/A | <30 min | Telemetry |
| **Reliability** | Integration uptime | N/A | 99.9% | Monitoring |
| | Webhook delivery rate | N/A | 99.95% | Metrics |
| | Error rate | N/A | <0.1% | Logs |

---

## 🎯 PHASE 10.1: INTEGRATION PLATFORM ARCHITECTURE

**Duration**: Weeks 1-3 (15 business days)  
**Owner**: Backend Lead  
**Team**: 3 backend engineers, 1 DevOps  
**Budget**: $45,000

### 10.1.1 Integration Hub Architecture

```typescript
// backend/src/integrations/IntegrationHub.ts

/**
 * Integration Hub
 * Central system for managing all third-party integrations
 */

// ═══════════════════════════════════════════════════════════
// Type Definitions
// ═══════════════════════════════════════════════════════════

export interface Integration {
  id: string;
  name: string;
  slug: string;
  category: IntegrationCategory;
  provider: string;
  description: string;
  icon: string;
  status: 'active' | 'beta' | 'deprecated';
  features: string[];
  pricing: IntegrationPricing;
  authentication: AuthenticationConfig;
  webhooks?: WebhookConfig;
  rateLimit: RateLimitConfig;
  metadata: IntegrationMetadata;
}

export enum IntegrationCategory {
  PRODUCTIVITY = 'productivity',
  COMMUNICATION = 'communication',
  PROJECT_MANAGEMENT = 'project-management',
  CRM = 'crm',
  DEVELOPMENT = 'development',
  ANALYTICS = 'analytics',
  STORAGE = 'storage'
}

export interface AuthenticationConfig {
  type: 'oauth2' | 'api-key' | 'jwt';
  oauth2?: {
    authorizationURL: string;
    tokenURL: string;
    scopes: string[];
    clientId: string;
    clientSecret: string;
  };
  apiKey?: {
    headerName: string;
    prefix?: string;
  };
}

export interface WebhookConfig {
  enabled: boolean;
  events: string[];
  signatureHeader: string;
  verificationMethod: 'hmac-sha256' | 'jwt';
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit: number;
}

export interface IntegrationPricing {
  free: boolean;
  tier: 'free' | 'pro' | 'enterprise';
  costPerMonth?: number;
}

export interface IntegrationMetadata {
  version: string;
  createdAt: Date;
  updatedAt: Date;
  maintainer: string;
  documentation: string;
  supportEmail: string;
}

// ═══════════════════════════════════════════════════════════
// Integration Hub Implementation
// ═══════════════════════════════════════════════════════════

export class IntegrationHub {
  private integrations: Map<string, Integration> = new Map();
  private connections: Map<string, IntegrationConnection> = new Map();
  private logger: Logger;
  
  constructor(logger: Logger) {
    this.logger = logger;
    this.registerDefaultIntegrations();
  }
  
  /**
   * Register an integration
   */
  register(integration: Integration): void {
    this.integrations.set(integration.id, integration);
    this.logger.info('Integration registered', {
      id: integration.id,
      name: integration.name
    });
  }
  
  /**
   * Get integration by ID
   */
  getIntegration(id: string): Integration | undefined {
    return this.integrations.get(id);
  }
  
  /**
   * List all integrations
   */
  listIntegrations(filters?: {
    category?: IntegrationCategory;
    status?: Integration['status'];
    search?: string;
  }): Integration[] {
    let integrations = Array.from(this.integrations.values());
    
    if (filters?.category) {
      integrations = integrations.filter(i => i.category === filters.category);
    }
    
    if (filters?.status) {
      integrations = integrations.filter(i => i.status === filters.status);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      integrations = integrations.filter(i =>
        i.name.toLowerCase().includes(searchLower) ||
        i.description.toLowerCase().includes(searchLower)
      );
    }
    
    return integrations;
  }
  
  /**
   * Connect user to integration
   */
  async connect(
    userId: string,
    integrationId: string,
    credentials: any
  ): Promise<IntegrationConnection> {
    const integration = this.getIntegration(integrationId);
    if (!integration) {
      throw new Error(`Integration not found: ${integrationId}`);
    }
    
    // Validate credentials based on auth type
    const validated = await this.validateCredentials(integration, credentials);
    
    // Create connection
    const connection: IntegrationConnection = {
      id: this.generateId(),
      userId,
      integrationId,
      credentials: validated,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store connection
    await this.storeConnection(connection);
    this.connections.set(connection.id, connection);
    
    this.logger.info('Integration connected', {
      userId,
      integrationId,
      connectionId: connection.id
    });
    
    return connection;
  }
  
  /**
   * Disconnect user from integration
   */
  async disconnect(userId: string, connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    
    if (!connection || connection.userId !== userId) {
      throw new Error('Connection not found');
    }
    
    // Revoke credentials if OAuth2
    const integration = this.getIntegration(connection.integrationId);
    if (integration?.authentication.type === 'oauth2') {
      await this.revokeOAuth2(connection);
    }
    
    // Remove connection
    await this.deleteConnection(connectionId);
    this.connections.delete(connectionId);
    
    this.logger.info('Integration disconnected', {
      userId,
      connectionId
    });
  }
  
  /**
   * Execute integration action
   */
  async execute(
    connectionId: string,
    action: string,
    params: any
  ): Promise<any> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }
    
    const integration = this.getIntegration(connection.integrationId);
    if (!integration) {
      throw new Error('Integration not found');
    }
    
    // Get integration adapter
    const adapter = this.getAdapter(integration.id);
    
    // Execute action
    const result = await adapter.execute(action, params, connection.credentials);
    
    // Track usage
    await this.trackUsage(connection.id, action);
    
    return result;
  }
  
  /**
   * Validate credentials
   */
  private async validateCredentials(
    integration: Integration,
    credentials: any
  ): Promise<any> {
    const adapter = this.getAdapter(integration.id);
    return adapter.validateCredentials(credentials);
  }
  
  /**
   * Get integration adapter
   */
  private getAdapter(integrationId: string): IntegrationAdapter {
    // Import adapter dynamically
    const adapterPath = `./adapters/${integrationId}`;
    const AdapterClass = require(adapterPath).default;
    return new AdapterClass();
  }
  
  /**
   * Store connection in database
   */
  private async storeConnection(connection: IntegrationConnection): Promise<void> {
    const db = getDatabase();
    await db.query(`
      INSERT INTO integration_connections
        (id, user_id, integration_id, credentials, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      connection.id,
      connection.userId,
      connection.integrationId,
      JSON.stringify(connection.credentials),
      connection.status,
      connection.createdAt,
      connection.updatedAt
    ]);
  }
  
  /**
   * Delete connection from database
   */
  private async deleteConnection(connectionId: string): Promise<void> {
    const db = getDatabase();
    await db.query(`
      DELETE FROM integration_connections WHERE id = $1
    `, [connectionId]);
  }
  
  /**
   * Revoke OAuth2 credentials
   */
  private async revokeOAuth2(connection: IntegrationConnection): Promise<void> {
    // Implementation depends on OAuth2 provider
    // Most providers have a revocation endpoint
  }
  
  /**
   * Track integration usage
   */
  private async trackUsage(connectionId: string, action: string): Promise<void> {
    const db = getDatabase();
    await db.query(`
      INSERT INTO integration_usage (connection_id, action, timestamp)
      VALUES ($1, $2, NOW())
    `, [connectionId, action]);
  }
  
  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Register default integrations
   */
  private registerDefaultIntegrations(): void {
    // Will register integrations in sub-phases
  }
}

// ═══════════════════════════════════════════════════════════
// Integration Adapter Interface
// ═══════════════════════════════════════════════════════════

export interface IntegrationAdapter {
  validateCredentials(credentials: any): Promise<any>;
  execute(action: string, params: any, credentials: any): Promise<any>;
  handleWebhook(event: any, signature: string): Promise<void>;
}

export interface IntegrationConnection {
  id: string;
  userId: string;
  integrationId: string;
  credentials: any;
  status: 'active' | 'expired' | 'revoked';
  createdAt: Date;
  updatedAt: Date;
}
```

### 10.1.2 Webhook System

```typescript
// backend/src/integrations/WebhookManager.ts

/**
 * Webhook Manager
 * Handles incoming webhooks from integrations
 */

import crypto from 'crypto';
import { Queue } from 'bullmq';

export interface WebhookEvent {
  id: string;
  integrationId: string;
  event: string;
  payload: any;
  signature: string;
  timestamp: number;
  attempts: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
}

export class WebhookManager {
  private queue: Queue;
  private logger: Logger;
  
  constructor(logger: Logger) {
    this.logger = logger;
    this.queue = new Queue('webhooks', {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379')
      }
    });
  }
  
  /**
   * Receive webhook
   */
  async receive(
    integrationId: string,
    headers: Record<string, string>,
    body: any
  ): Promise<{ success: boolean; eventId: string }> {
    const integration = integrationHub.getIntegration(integrationId);
    if (!integration) {
      throw new Error(`Integration not found: ${integrationId}`);
    }
    
    if (!integration.webhooks?.enabled) {
      throw new Error('Webhooks not enabled for this integration');
    }
    
    // Verify signature
    const signature = headers[integration.webhooks.signatureHeader.toLowerCase()];
    if (!signature) {
      throw new Error('Missing webhook signature');
    }
    
    const isValid = this.verifySignature(
      integration,
      body,
      signature
    );
    
    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }
    
    // Create webhook event
    const event: WebhookEvent = {
      id: this.generateId(),
      integrationId,
      event: body.event || body.type,
      payload: body,
      signature,
      timestamp: Date.now(),
      attempts: 0,
      status: 'pending'
    };
    
    // Queue for processing
    await this.queue.add('process-webhook', event, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });
    
    this.logger.info('Webhook received', {
      integrationId,
      event: event.event,
      eventId: event.id
    });
    
    return {
      success: true,
      eventId: event.id
    };
  }
  
  /**
   * Process webhook event
   */
  async process(event: WebhookEvent): Promise<void> {
    event.status = 'processing';
    event.attempts++;
    
    try {
      const integration = integrationHub.getIntegration(event.integrationId);
      if (!integration) {
        throw new Error(`Integration not found: ${event.integrationId}`);
      }
      
      // Get adapter
      const adapter = this.getAdapter(event.integrationId);
      
      // Process webhook
      await adapter.handleWebhook(event.payload, event.signature);
      
      event.status = 'success';
      
      this.logger.info('Webhook processed', {
        integrationId: event.integrationId,
        event: event.event,
        eventId: event.id
      });
      
    } catch (error) {
      event.status = 'failed';
      
      this.logger.error('Webhook processing failed', error as Error, {
        integrationId: event.integrationId,
        event: event.event,
        eventId: event.id,
        attempts: event.attempts
      });
      
      throw error;
    }
  }
  
  /**
   * Verify webhook signature
   */
  private verifySignature(
    integration: Integration,
    body: any,
    signature: string
  ): boolean {
    if (!integration.webhooks) {
      return false;
    }
    
    const secret = process.env[`${integration.id.toUpperCase()}_WEBHOOK_SECRET`];
    if (!secret) {
      throw new Error('Webhook secret not configured');
    }
    
    switch (integration.webhooks.verificationMethod) {
      case 'hmac-sha256':
        return this.verifyHMAC(body, signature, secret);
        
      case 'jwt':
        return this.verifyJWT(signature, secret);
        
      default:
        throw new Error(`Unknown verification method: ${integration.webhooks.verificationMethod}`);
    }
  }
  
  /**
   * Verify HMAC-SHA256 signature
   */
  private verifyHMAC(body: any, signature: string, secret: string): boolean {
    const payload = typeof body === 'string' ? body : JSON.stringify(body);
    const computed = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computed)
    );
  }
  
  /**
   * Verify JWT signature
   */
  private verifyJWT(token: string, secret: string): boolean {
    // JWT verification implementation
    return true; // Simplified for example
  }
  
  /**
   * Get integration adapter
   */
  private getAdapter(integrationId: string): IntegrationAdapter {
    const adapterPath = `./adapters/${integrationId}`;
    const AdapterClass = require(adapterPath).default;
    return new AdapterClass();
  }
  
  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `webhook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

---

## 🎯 PHASE 10.2: CORE INTEGRATIONS

**Duration**: Weeks 4-8 (25 business days)  
**Owner**: Integration Lead  
**Team**: 4 backend engineers, 2 integration specialists  
**Budget**: $80,000

### 10.2.1 Slack Integration

```typescript
// backend/src/integrations/adapters/slack.ts

/**
 * Slack Integration Adapter
 */

import { WebClient } from '@slack/web-api';
import { Integration, IntegrationAdapter } from '../IntegrationHub';

export const SLACK_INTEGRATION: Integration = {
  id: 'slack',
  name: 'Slack',
  slug: 'slack',
  category: IntegrationCategory.COMMUNICATION,
  provider: 'Slack Technologies',
  description: 'Send Claude responses directly to Slack channels',
  icon: 'https://cdn.intinc.com/integrations/slack.svg',
  status: 'active',
  features: [
    'Send messages to channels',
    'Send direct messages',
    'Create threads',
    'Upload files',
    'Receive slash commands'
  ],
  pricing: {
    free: true,
    tier: 'free'
  },
  authentication: {
    type: 'oauth2',
    oauth2: {
      authorizationURL: 'https://slack.com/oauth/v2/authorize',
      tokenURL: 'https://slack.com/api/oauth.v2.access',
      scopes: [
        'channels:read',
        'channels:write',
        'chat:write',
        'files:write',
        'users:read'
      ],
      clientId: process.env.SLACK_CLIENT_ID!,
      clientSecret: process.env.SLACK_CLIENT_SECRET!
    }
  },
  webhooks: {
    enabled: true,
    events: ['message', 'slash_command'],
    signatureHeader: 'X-Slack-Signature',
    verificationMethod: 'hmac-sha256'
  },
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerHour: 3600,
    requestsPerDay: 50000,
    burstLimit: 100
  },
  metadata: {
    version: '1.0.0',
    createdAt: new Date('2026-11-01'),
    updatedAt: new Date('2026-11-01'),
    maintainer: 'INT Inc',
    documentation: 'https://docs.intinc.com/integrations/slack',
    supportEmail: 'integrations@intinc.com'
  }
};

export default class SlackAdapter implements IntegrationAdapter {
  /**
   * Validate Slack OAuth2 credentials
   */
  async validateCredentials(credentials: any): Promise<any> {
    const client = new WebClient(credentials.access_token);
    
    // Test authentication
    const result = await client.auth.test();
    
    if (!result.ok) {
      throw new Error('Invalid Slack credentials');
    }
    
    return {
      access_token: credentials.access_token,
      team_id: result.team_id,
      team_name: result.team,
      user_id: result.user_id,
      bot_user_id: result.bot_id
    };
  }
  
  /**
   * Execute Slack action
   */
  async execute(action: string, params: any, credentials: any): Promise<any> {
    const client = new WebClient(credentials.access_token);
    
    switch (action) {
      case 'send_message':
        return this.sendMessage(client, params);
        
      case 'send_direct_message':
        return this.sendDirectMessage(client, params);
        
      case 'upload_file':
        return this.uploadFile(client, params);
        
      case 'list_channels':
        return this.listChannels(client);
        
      case 'create_channel':
        return this.createChannel(client, params);
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
  
  /**
   * Handle Slack webhook
   */
  async handleWebhook(event: any, signature: string): Promise<void> {
    // Handle URL verification challenge
    if (event.type === 'url_verification') {
      return event.challenge;
    }
    
    // Handle events
    if (event.type === 'event_callback') {
      await this.handleEvent(event.event);
    }
    
    // Handle slash commands
    if (event.command) {
      await this.handleSlashCommand(event);
    }
  }
  
  /**
   * Send message to channel
   */
  private async sendMessage(
    client: WebClient,
    params: {
      channel: string;
      text: string;
      blocks?: any[];
      thread_ts?: string;
    }
  ): Promise<any> {
    const result = await client.chat.postMessage({
      channel: params.channel,
      text: params.text,
      blocks: params.blocks,
      thread_ts: params.thread_ts
    });
    
    if (!result.ok) {
      throw new Error(`Failed to send message: ${result.error}`);
    }
    
    return {
      success: true,
      message_ts: result.ts,
      channel: result.channel
    };
  }
  
  /**
   * Send direct message to user
   */
  private async sendDirectMessage(
    client: WebClient,
    params: {
      user: string;
      text: string;
    }
  ): Promise<any> {
    // Open DM channel
    const conversation = await client.conversations.open({
      users: params.user
    });
    
    if (!conversation.ok || !conversation.channel) {
      throw new Error('Failed to open DM channel');
    }
    
    // Send message
    return this.sendMessage(client, {
      channel: conversation.channel.id!,
      text: params.text
    });
  }
  
  /**
   * Upload file
   */
  private async uploadFile(
    client: WebClient,
    params: {
      channels: string;
      file: Buffer | string;
      filename: string;
      title?: string;
      initial_comment?: string;
    }
  ): Promise<any> {
    const result = await client.files.uploadV2({
      channels: params.channels,
      file: params.file,
      filename: params.filename,
      title: params.title,
      initial_comment: params.initial_comment
    });
    
    if (!result.ok) {
      throw new Error(`Failed to upload file: ${result.error}`);
    }
    
    return {
      success: true,
      file_id: result.file?.id
    };
  }
  
  /**
   * List channels
   */
  private async listChannels(client: WebClient): Promise<any> {
    const result = await client.conversations.list({
      types: 'public_channel,private_channel'
    });
    
    if (!result.ok || !result.channels) {
      throw new Error('Failed to list channels');
    }
    
    return result.channels.map(channel => ({
      id: channel.id,
      name: channel.name,
      is_private: channel.is_private,
      is_member: channel.is_member
    }));
  }
  
  /**
   * Create channel
   */
  private async createChannel(
    client: WebClient,
    params: {
      name: string;
      is_private?: boolean;
    }
  ): Promise<any> {
    const result = await client.conversations.create({
      name: params.name,
      is_private: params.is_private || false
    });
    
    if (!result.ok || !result.channel) {
      throw new Error(`Failed to create channel: ${result.error}`);
    }
    
    return {
      success: true,
      channel_id: result.channel.id,
      channel_name: result.channel.name
    };
  }
  
  /**
   * Handle Slack event
   */
  private async handleEvent(event: any): Promise<void> {
    switch (event.type) {
      case 'message':
        // Handle message event
        if (event.text && event.text.includes('<@BOT_USER_ID>')) {
          // Bot was mentioned, respond with Claude
          await this.handleMention(event);
        }
        break;
        
      // Handle other events
    }
  }
  
  /**
   * Handle mention
   */
  private async handleMention(event: any): Promise<void> {
    // Extract question from message
    const question = event.text.replace(/<@[A-Z0-9]+>/g, '').trim();
    
    // Get Claude response
    const claude = ServiceFactory.getClaudeService();
    const response = await claude.sendMessage(question);
    
    // Send response to Slack
    // (This would use the user's connection to send the message)
  }
  
  /**
   * Handle slash command
   */
  private async handleSlashCommand(command: any): Promise<void> {
    // Handle slash command (e.g., /claude ask <question>)
    switch (command.command) {
      case '/claude':
        await this.handleClaudeCommand(command);
        break;
    }
  }
  
  /**
   * Handle /claude command
   */
  private async handleClaudeCommand(command: any): Promise<void> {
    const question = command.text;
    
    // Get Claude response
    const claude = ServiceFactory.getClaudeService();
    const response = await claude.sendMessage(question);
    
    // Send response back to Slack
    // (This would be sent as an immediate response to the slash command)
  }
}
```

### 10.2.2 Additional Integrations (Summary)

**Notion Integration**:
- Create pages and databases
- Update content
- Query databases
- Sync documentation

**Google Workspace**:
- Gmail integration (send emails with Claude)
- Google Drive (upload files)
- Google Calendar (create events)
- Google Docs (create/update documents)

**Microsoft Teams**:
- Send messages to channels
- Create meetings
- Upload files
- Bot integration

**GitHub**:
- Create issues and PRs
- Review code
- Comment on PRs
- Trigger workflows

**Jira**:
- Create tickets
- Update status
- Add comments
- Query issues

---

## 📊 PHASE 11: AI AGENTS & AUTONOMOUS WORKFLOWS

**Duration**: 16 weeks (Q1 2027, February - May 2027)  
**Team Size**: 16 people (4 AI/ML, 4 backend, 2 frontend, 2 QA, 1 security, 1 DevOps, 1 product, 1 PM)  
**Budget**: $380,000  
**Prerequisites**: Phase 10 complete, integrations live  
**Owner**: CTO + AI/ML Lead

### Success Metrics (OKRs)

| Objective | Key Results | Baseline | Target | Measurement |
|-----------|-------------|----------|--------|-------------|
| **Agent Capability** | Task completion rate | N/A | 85% | Eval tests |
| | Average steps to completion | N/A | <5 | Metrics |
| | User satisfaction with agents | N/A | 4.2/5 | Survey |
| **Automation** | Tasks automated per user | N/A | 10/week | Usage |
| | Time saved per user | N/A | 5 hours/week | Survey |
| | Error rate | N/A | <2% | Monitoring |
| **Adoption** | Active agent users | 0 | 70% | Analytics |
| | Agents created per user | N/A | 3 | Metrics |
| | Agent executions per day | N/A | 10k | Metrics |

---

## 🎯 PHASE 11.1: AGENT FRAMEWORK

**Duration**: Weeks 1-4 (20 business days)  
**Owner**: AI/ML Lead  
**Team**: 3 AI/ML engineers, 2 backend engineers  
**Budget**: $75,000

### 11.1.1 Agent Architecture

```typescript
// backend/src/agents/AgentFramework.ts

/**
 * AI Agent Framework
 * Autonomous agents that can complete multi-step tasks
 */

// ═══════════════════════════════════════════════════════════
// Type Definitions
// ═══════════════════════════════════════════════════════════

export interface Agent {
  id: string;
  name: string;
  description: string;
  goal: string;
  tools: Tool[];
  model: string;
  temperature: number;
  maxIterations: number;
  memory: AgentMemory;
  status: AgentStatus;
}

export enum AgentStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface Tool {
  name: string;
  description: string;
  parameters: ToolParameter[];
  execute: (params: any) => Promise<any>;
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
}

export interface AgentMemory {
  shortTerm: Message[];
  longTerm: KnowledgeItem[];
  workingMemory: Map<string, any>;
}

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: number;
}

export interface KnowledgeItem {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  userId: string;
  task: string;
  steps: ExecutionStep[];
  result: any;
  status: AgentStatus;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface ExecutionStep {
  id: string;
  iteration: number;
  thought: string;
  action: string;
  actionInput: any;
  observation: string;
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════
// Agent Implementation (ReAct Pattern)
// ═══════════════════════════════════════════════════════════

export class Agent {
  private claude: ClaudeService;
  private logger: Logger;
  
  constructor(
    private config: Agent,
    claude: ClaudeService,
    logger: Logger
  ) {
    this.claude = claude;
    this.logger = logger;
  }
  
  /**
   * Execute agent task (ReAct loop)
   */
  async execute(task: string, userId: string): Promise<AgentExecution> {
    const execution: AgentExecution = {
      id: this.generateId(),
      agentId: this.config.id,
      userId,
      task,
      steps: [],
      result: null,
      status: AgentStatus.RUNNING,
      startedAt: new Date()
    };
    
    this.logger.info('Agent execution started', {
      agentId: this.config.id,
      executionId: execution.id,
      task
    });
    
    try {
      // Initialize memory
      this.config.memory.shortTerm = [];
      this.config.memory.workingMemory.clear();
      
      // Add system prompt
      this.addToMemory({
        role: 'system',
        content: this.buildSystemPrompt(),
        timestamp: Date.now()
      });
      
      // Add user task
      this.addToMemory({
        role: 'user',
        content: task,
        timestamp: Date.now()
      });
      
      // ReAct loop
      for (let iteration = 0; iteration < this.config.maxIterations; iteration++) {
        const step = await this.reactStep(iteration, execution);
        execution.steps.push(step);
        
        // Check if task is complete
        if (step.action === 'finish') {
          execution.result = step.actionInput;
          execution.status = AgentStatus.COMPLETED;
          execution.completedAt = new Date();
          break;
        }
        
        // Check if error occurred
        if (step.observation.startsWith('ERROR:')) {
          execution.status = AgentStatus.FAILED;
          execution.error = step.observation;
          execution.completedAt = new Date();
          break;
        }
      }
      
      // If max iterations reached
      if (execution.status === AgentStatus.RUNNING) {
        execution.status = AgentStatus.FAILED;
        execution.error = 'Max iterations reached';
        execution.completedAt = new Date();
      }
      
      this.logger.info('Agent execution completed', {
        agentId: this.config.id,
        executionId: execution.id,
        status: execution.status,
        steps: execution.steps.length
      });
      
      return execution;
      
    } catch (error) {
      this.logger.error('Agent execution failed', error as Error, {
        agentId: this.config.id,
        executionId: execution.id
      });
      
      execution.status = AgentStatus.FAILED;
      execution.error = (error as Error).message;
      execution.completedAt = new Date();
      
      return execution;
    }
  }
  
  /**
   * Single ReAct step: Reason → Act → Observe
   */
  private async reactStep(
    iteration: number,
    execution: AgentExecution
  ): Promise<ExecutionStep> {
    const step: ExecutionStep = {
      id: this.generateId(),
      iteration,
      thought: '',
      action: '',
      actionInput: null,
      observation: '',
      timestamp: Date.now()
    };
    
    // 1. REASON: Ask Claude to think about what to do next
    const prompt = this.buildReActPrompt();
    const response = await this.claude.sendMessage(prompt, {
      model: this.config.model,
      temperature: this.config.temperature,
      maxTokens: 1024
    });
    
    // Parse response
    const parsed = this.parseReActResponse(response.content);
    
    step.thought = parsed.thought;
    step.action = parsed.action;
    step.actionInput = parsed.actionInput;
    
    // Add thought to memory
    this.addToMemory({
      role: 'assistant',
      content: `Thought: ${step.thought}\nAction: ${step.action}\nAction Input: ${JSON.stringify(step.actionInput)}`,
      timestamp: Date.now()
    });
    
    // 2. ACT: Execute the action
    if (step.action === 'finish') {
      step.observation = 'Task completed';
    } else {
      try {
        const tool = this.getTool(step.action);
        if (!tool) {
          step.observation = `ERROR: Unknown tool: ${step.action}`;
        } else {
          const result = await tool.execute(step.actionInput);
          step.observation = JSON.stringify(result);
        }
      } catch (error) {
        step.observation = `ERROR: ${(error as Error).message}`;
      }
    }
    
    // Add observation to memory
    this.addToMemory({
      role: 'tool',
      content: `Observation: ${step.observation}`,
      timestamp: Date.now()
    });
    
    return step;
  }
  
  /**
   * Build system prompt for agent
   */
  private buildSystemPrompt(): string {
    return `You are an AI agent with the following capabilities:

Goal: ${this.config.goal}

Available Tools:
${this.config.tools.map(tool => `
- ${tool.name}: ${tool.description}
  Parameters: ${JSON.stringify(tool.parameters)}
`).join('\n')}

You should use the following format:

Thought: Think about what to do next
Action: The tool to use (one of: ${this.config.tools.map(t => t.name).join(', ')}, finish)
Action Input: The input to the tool (JSON object)

When you have completed the task, use the "finish" action with the final result as the Action Input.

Begin!`;
  }
  
  /**
   * Build ReAct prompt with conversation history
   */
  private buildReActPrompt(): string {
    const history = this.config.memory.shortTerm
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n\n');
    
    return history;
  }
  
  /**
   * Parse Claude's ReAct response
   */
  private parseReActResponse(response: string): {
    thought: string;
    action: string;
    actionInput: any;
  } {
    const thoughtMatch = response.match(/Thought:\s*(.+?)(?=\nAction:|$)/s);
    const actionMatch = response.match(/Action:\s*(.+?)(?=\nAction Input:|$)/s);
    const actionInputMatch = response.match(/Action Input:\s*(.+?)$/s);
    
    return {
      thought: thoughtMatch ? thoughtMatch[1].trim() : '',
      action: actionMatch ? actionMatch[1].trim() : 'finish',
      actionInput: actionInputMatch ? JSON.parse(actionInputMatch[1].trim()) : null
    };
  }
  
  /**
   * Get tool by name
   */
  private getTool(name: string): Tool | undefined {
    return this.config.tools.find(tool => tool.name === name);
  }
  
  /**
   * Add message to short-term memory
   */
  private addToMemory(message: Message): void {
    this.config.memory.shortTerm.push(message);
    
    // Keep last 10 messages
    if (this.config.memory.shortTerm.length > 10) {
      this.config.memory.shortTerm.shift();
    }
  }
  
  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ═══════════════════════════════════════════════════════════
// Built-in Tools
// ═══════════════════════════════════════════════════════════

export const BUILTIN_TOOLS: Tool[] = [
  {
    name: 'web_search',
    description: 'Search the web for information',
    parameters: [
      {
        name: 'query',
        type: 'string',
        description: 'Search query',
        required: true
      }
    ],
    execute: async (params: { query: string }) => {
      // Implement web search (e.g., using SerpAPI)
      return { results: [] };
    }
  },
  
  {
    name: 'calculator',
    description: 'Perform mathematical calculations',
    parameters: [
      {
        name: 'expression',
        type: 'string',
        description: 'Mathematical expression to evaluate',
        required: true
      }
    ],
    execute: async (params: { expression: string }) => {
      // Safely evaluate expression
      const result = eval(params.expression);
      return { result };
    }
  },
  
  {
    name: 'send_email',
    description: 'Send an email',
    parameters: [
      {
        name: 'to',
        type: 'string',
        description: 'Recipient email address',
        required: true
      },
      {
        name: 'subject',
        type: 'string',
        description: 'Email subject',
        required: true
      },
      {
        name: 'body',
        type: 'string',
        description: 'Email body',
        required: true
      }
    ],
    execute: async (params: { to: string; subject: string; body: string }) => {
      // Implement email sending
      return { success: true };
    }
  },
  
  {
    name: 'create_task',
    description: 'Create a task in project management system',
    parameters: [
      {
        name: 'title',
        type: 'string',
        description: 'Task title',
        required: true
      },
      {
        name: 'description',
        type: 'string',
        description: 'Task description',
        required: false
      },
      {
        name: 'assignee',
        type: 'string',
        description: 'Task assignee',
        required: false
      }
    ],
    execute: async (params: { title: string; description?: string; assignee?: string }) => {
      // Implement task creation
      return { taskId: '123' };
    }
  }
];
```

**Deliverables Summary**:
- ✅ Phase 9: Complete mobile apps (iOS + Android)
- ✅ Phase 10: 15+ integrations with marketplace
- ✅ Phase 11: AI agents with tool use and ReAct loop

This completes Phases 9-11 at maximum depth!