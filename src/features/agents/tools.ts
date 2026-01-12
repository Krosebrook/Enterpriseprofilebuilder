import { Tool } from '../../lib/agents/framework';

// --- Tool Implementations ---

export const SlackTool: Tool = {
  name: 'slack',
  description: 'Send messages and check channels in Slack.',
  parameters: {
    channel: { type: 'string', description: 'The channel to send to (e.g., #general)' },
    message: { type: 'string', description: 'The message content' }
  },
  execute: async (params: { channel?: string; message?: string }) => {
    // Mock Execution
    const channel = params.channel || '#general';
    return {
      success: true,
      data: {
        ts: Date.now().toString(),
        channel: channel,
        message: params.message || "Hello world",
        status: "sent"
      },
      output: `Message sent to ${channel}: "${params.message}"`
    };
  }
};

export const JiraTool: Tool = {
  name: 'jira',
  description: 'Create and search Jira tickets.',
  parameters: {
    action: { type: 'string', enum: ['create', 'search', 'get'] },
    query: { type: 'string', description: 'Search query or ticket summary' }
  },
  execute: async (params: { action: string; query: string }) => {
    // Mock Execution
    if (params.action === 'create') {
      const ticketId = `PROJ-${Math.floor(Math.random() * 1000)}`;
      return {
        success: true,
        data: { id: ticketId, key: ticketId, self: `https://jira.intinc.com/browse/${ticketId}` },
        output: `Ticket ${ticketId} created successfully.`
      };
    }
    
    return {
      success: true,
      data: {
        issues: [
          { key: 'PROJ-123', summary: 'Fix login bug', status: 'In Progress' },
          { key: 'PROJ-124', summary: 'Update documentation', status: 'To Do' }
        ]
      },
      output: `Found 2 issues matching "${params.query}".`
    };
  }
};

export const GitHubTool: Tool = {
  name: 'github',
  description: 'Interact with GitHub repositories.',
  parameters: {
    action: { type: 'string', enum: ['list_prs', 'get_file'] },
    repo: { type: 'string' }
  },
  execute: async (params: { action: string; repo?: string }) => {
    return {
      success: true,
      data: {
        prs: [
          { number: 42, title: 'Feat: Add Agent Support', state: 'open', author: 'krosebrook' }
        ]
      },
      output: `Found 1 open PR in ${params.repo || 'current-repo'}.`
    };
  }
};

export const NotionTool: Tool = {
  name: 'notion',
  description: 'Search and read Notion pages.',
  parameters: {
    query: { type: 'string' }
  },
  execute: async (params: { query: string }) => {
    return {
      success: true,
      data: {
        results: [
          { id: 'page-1', title: 'Company Policies', url: 'https://notion.so/policies' }
        ]
      },
      output: `Found page "Company Policies" matching "${params.query}".`
    };
  }
};

// --- Registry ---

export const toolRegistry: Record<string, Tool> = {
  slack: SlackTool,
  jira: JiraTool,
  github: GitHubTool,
  notion: NotionTool
};
