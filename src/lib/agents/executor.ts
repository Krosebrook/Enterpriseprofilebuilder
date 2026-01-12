import { Tool } from './framework';
import { toolRegistry } from '../../features/agents/tools';

export interface ExecutionStep {
  type: 'thought' | 'action' | 'observation' | 'answer';
  content: string;
  metadata?: any;
}

export interface ExecutionResult {
  steps: ExecutionStep[];
  finalResponse: string;
}

export class AgentExecutor {
  private tools: Tool[];
  private agentName: string;
  private agentRole: string;

  constructor(agentName: string, agentRole: string, toolIds: string[]) {
    this.agentName = agentName;
    this.agentRole = agentRole;
    this.tools = toolIds
      .map(id => toolRegistry[id])
      .filter(t => t !== undefined);
  }

  async execute(userInput: string): Promise<ExecutionResult> {
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
      toolParams = { message: userInput, channel: '#general' }; // simplified extraction
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
        content: `I understand. As a **${this.agentRole}**, I can help you with that conceptually. (Enable tools like Slack or Jira for real actions).`
      });
    }

    return {
      steps,
      finalResponse: steps[steps.length - 1].content
    };
  }
}
