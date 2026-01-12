import { Tool } from './framework';
import { toolRegistry } from '../../features/agents/tools';
import { RealAgentExecutor } from './react-executor';

export interface ExecutionStep {
  type: 'thought' | 'action' | 'observation' | 'answer';
  content: string;
  metadata?: any;
}

export interface ExecutionResult {
  steps: ExecutionStep[];
  finalResponse: string;
}

export interface AgentExecutorOptions {
  useRealAPI?: boolean;
  dryRun?: boolean;
  maxIterations?: number;
}

export class AgentExecutor {
  private tools: Tool[];
  private agentName: string;
  private agentRole: string;
  private agentGoal: string;
  private model: string;
  private temperature: number;
  private options: AgentExecutorOptions;

  constructor(
    agentName: string, 
    agentRole: string, 
    toolIds: string[],
    agentGoal: string = 'Assist the user with their requests',
    model: string = 'claude-3-5-sonnet-20241022',
    temperature: number = 0.7,
    options: AgentExecutorOptions = {}
  ) {
    this.agentName = agentName;
    this.agentRole = agentRole;
    this.agentGoal = agentGoal;
    this.model = model;
    this.temperature = temperature;
    this.options = { useRealAPI: false, dryRun: false, ...options };
    this.tools = toolIds
      .map(id => toolRegistry[id])
      .filter(t => t !== undefined);
  }

  async execute(userInput: string): Promise<ExecutionResult> {
    // If real API is enabled, use the new RealAgentExecutor
    if (this.options.useRealAPI) {
      const realExecutor = new RealAgentExecutor({
        agentName: this.agentName,
        agentRole: this.agentRole,
        agentGoal: this.agentGoal,
        toolIds: this.tools.map(t => t.name),
        model: this.model,
        temperature: this.temperature,
        maxIterations: this.options.maxIterations,
        dryRun: this.options.dryRun
      });
      
      return await realExecutor.execute(userInput);
    }

    // Otherwise, fall back to mock/simulation mode
    return await this.executeMockMode(userInput);
  }

  /**
   * Legacy mock mode execution (simulation for testing without API)
   */
  private async executeMockMode(userInput: string): Promise<ExecutionResult> {
    const steps: ExecutionStep[] = [];
    
    // 1. Thought
    const thought = `I need to address the user's request: "${userInput}".
Context: I am ${this.agentName}, a ${this.agentRole}.
Available Tools: ${this.tools.map(t => t.name).join(', ') || 'None'}.`;
    
    steps.push({ type: 'thought', content: thought });

    // 2. Mock Reasoning (Keyword matching to select tool)
    let selectedTool: Tool | undefined;
    let toolParams: any = {};

    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('slack') && this.tools.find(t => t.name === 'slack')) {
      selectedTool = this.tools.find(t => t.name === 'slack');
      toolParams = { message: userInput, channel: '#general' };
    } else if (lowerInput.includes('jira') && this.tools.find(t => t.name === 'jira')) {
      selectedTool = this.tools.find(t => t.name === 'jira');
      toolParams = { action: 'search', query: userInput };
    } else if ((lowerInput.includes('pr') || lowerInput.includes('github')) && this.tools.find(t => t.name === 'github')) {
      selectedTool = this.tools.find(t => t.name === 'github');
      toolParams = { action: 'list_prs' };
    } else if (lowerInput.includes('notion') && this.tools.find(t => t.name === 'notion')) {
        selectedTool = this.tools.find(t => t.name === 'notion');
        toolParams = { query: userInput };
    }

    // 3. Action & Observation
    if (selectedTool) {
      steps.push({ 
        type: 'action', 
        content: `Calling tool: ${selectedTool.name}`, 
        metadata: { tool: selectedTool.name, params: toolParams } 
      });

      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const result = await selectedTool.execute(toolParams);
        steps.push({ 
          type: 'observation', 
          content: result.output,
          metadata: result.data 
        });
        
        steps.push({
          type: 'answer',
          content: `I've used ${selectedTool.name} to help with that. ${result.output}`
        });

      } catch (e) {
        steps.push({ type: 'observation', content: `Error: ${e}` });
        steps.push({ type: 'answer', content: "I attempted to use a tool but encountered an error." });
      }

    } else {
      // No tool selected
      steps.push({
        type: 'thought',
        content: "No specific tool matched the request keywords. Proceeding with conversational response."
      });
      
      // Simulate thinking delay
      await new Promise(resolve => setTimeout(resolve, 600));

      steps.push({
        type: 'answer',
        content: `I understand. As a **${this.agentRole}**, I can help you with that conceptually. (Enable Real API mode for actual tool execution).`
      });
    }

    return {
      steps,
      finalResponse: steps[steps.length - 1].content
    };
  }
}